// Global imports
import FormRenderer, { Utils } from '@ukhomeoffice/cop-react-form-renderer';
import gds from '@ukhomeoffice/formio-gds-template/lib';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Form, Formio } from 'react-formio';

// Local imports
import config from '../config';
import { FORM_ACTION_CANCEL } from '../constants';
import ErrorSummary from '../govuk/ErrorSummary';
import useAxiosInstance from '../utils/axiosInstance';
import FormUtils, { Renderers } from '../utils/Form';
import { augmentRequest, interpolate } from '../utils/formioSupport';
import { useKeycloak } from '../utils/keycloak';
import LoadingSpinner from './LoadingSpinner';

Formio.use(gds);

const RenderForm = ({ formName, form: _form, renderer: _renderer, onSubmit, onCancel, preFillData, children }) => {
  const [error, setError] = useState(null);
  const [form, setForm] = useState(_form);
  const [renderer, setRenderer] = useState(_renderer);
  const [isLoaderVisible, setLoaderVisibility] = useState(true);
  const [formattedPreFillData, setFormattedPreFillData] = useState();
  const [submitted, setSubmitted] = useState(false);
  const keycloak = useKeycloak();
  const formApiClient = useAxiosInstance(keycloak, config.formApiUrl);
  const uploadApiClient = useAxiosInstance(keycloak, config.fileUploadApiUrl);

  Formio.plugins = [augmentRequest(keycloak)];

  useEffect(() => {
    if (form) {
      interpolate(form, {
        keycloakContext: {
          accessToken: keycloak.token,
          refreshToken: keycloak.refreshToken,
          sessionId: keycloak.tokenParsed.session_state,
          email: keycloak.tokenParsed.email,
          givenName: keycloak.tokenParsed.given_name,
          familyName: keycloak.tokenParsed.family_name,
          subject: keycloak.subject,
          url: keycloak.authServerUrl,
          realm: keycloak.realm,
          roles: keycloak.tokenParsed.realm_access.roles,
          groups: keycloak.tokenParsed.groups,
        },
        environmentContext: {
          referenceDataUrl: config.refdataApiUrl,
        },
      });
    }
  }, [form]);

  useEffect(() => {
    const source = axios.CancelToken.source();

    const loadForm = async () => {
      try {
        if (formName) {
          const formRenderer = FormUtils.getRenderer(formName);
          const formEndpoint = formRenderer === Renderers.REACT ? 'copform' : 'form';
          const { data } = await formApiClient.get(`/${formEndpoint}/name/${formName}`);
          setForm(data);
          setRenderer(formRenderer);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoaderVisibility(false);
      }
    };

    const formatPreFillData = () => {
      if (!preFillData) {
        setFormattedPreFillData(null);
      } else {
        setFormattedPreFillData(
          {
            data: {
              environmentContext: {
                referenceDataUrl: config.refdataApiUrl,
              },
              ...preFillData,
            },
          },
        );
      }
    };

    loadForm();
    formatPreFillData();
    return () => {
      source.cancel('Cancelling request');
    };
  }, []);

  if (submitted && children) {
    return children;
  }

  const onGetComponent = (component, wrap) => {
    if (component.type === 'select') {
      if (wrap) {
        return Utils.Component.wrap(component, <select />);
      }
      return <select />;
    }
    return null;
  };

  return (
    <LoadingSpinner loading={isLoaderVisible}>
      {error && (
        <ErrorSummary
          title="There is a problem"
          errorList={[
            { children: error },
          ]}
        />
      )}
      {form && (
        <>
          {renderer === Renderers.FORM_IO && (
            <Form
              form={form}
              submission={formattedPreFillData}
              onSubmit={async (data) => {
                setLoaderVisibility(true);
                try {
                  await onSubmit(data, form);
                  setSubmitted(true);
                } catch (e) {
                  setError(e.message);
                } finally {
                  setLoaderVisibility(false);
                }
              }}
              onNextPage={() => {
                window.scrollTo(0, 0);
              }}
              onPrevPage={() => {
                window.scrollTo(0, 0);
                setError(null);
              }}
              options={{
                noAlerts: true,
                hooks: {
                  beforeCancel: async () => {
                    if (onCancel) {
                      await onCancel();
                    } else {
                      history.go(0);
                    }
                  },
                },
              }}
            />
          )}
          {renderer === Renderers.REACT && (
            <FormRenderer
              {...form}
              data={formattedPreFillData?.data}
              hooks={{
                onRequest: (req) => FormUtils.formHooks.onRequest(req, keycloak.token),
                onGetComponent,
                onSubmit: async (type, payload, onSuccess) => {
                  if (type === FORM_ACTION_CANCEL) {
                    return onCancel();
                  }
                  setLoaderVisibility(true);
                  try {
                    const { businessKey, submissionPayload } = await FormUtils.setupSubmission(
                      form,
                      payload,
                      keycloak.tokenParsed.email,
                      formApiClient,
                    );
                    await FormUtils.uploadDocuments(uploadApiClient, submissionPayload);
                    await onSubmit({ data: { ...submissionPayload, businessKey } }, form);
                    onSuccess({ ...submissionPayload, businessKey });
                    setSubmitted(true);
                  } catch (e) {
                    setError(e.message);
                  } finally {
                    setLoaderVisibility(false);
                  }
                },
              }}
            />
          )}
        </>
      )}
    </LoadingSpinner>
  );
};

export default RenderForm;
