// Global imports
import FormRenderer, { Utils } from '@ukhomeoffice/cop-react-form-renderer';
import { MultiSelectAutocomplete } from '@ukhomeoffice/cop-react-components';
import gds from '@ukhomeoffice/formio-gds-template/lib';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Form, Formio } from 'react-formio';

import { ApplicationContext } from '../../context/ApplicationContext';

// Local imports
import config from '../../utils/config';
import { FORM_ACTIONS } from '../../utils/constants';
import { useAxiosInstance } from '../../utils/Axios/axiosInstance';
import FormUtils, { Renderers } from '../../utils/Form/ReactForm';
import { augmentRequest, interpolate } from '../../utils/Form/FormIO/formIOUtil';
import { useKeycloak } from '../../context/Keycloak';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { TargetInformationUtil } from '../../utils';

Formio.use(gds);

const RenderForm = ({ formName,
  form: _form,
  renderer: _renderer,
  onSubmit,
  onCancel,
  preFillData,
  cacheTisFormData,
  setError,
  viewOnly,
  children }) => {
  const [form, setForm] = useState(_form);
  const [renderer, setRenderer] = useState(_renderer);
  const [isLoaderVisible, setLoaderVisibility] = useState(true);
  const [formattedPreFillData, setFormattedPreFillData] = useState();
  const [submitted, setSubmitted] = useState(false);
  const keycloak = useKeycloak();
  const { setTisCache } = useContext(ApplicationContext);
  const formApiClient = useAxiosInstance(keycloak, config.formApiUrl);
  const uploadApiClient = useAxiosInstance(keycloak, config.fileUploadApiUrl);

  Formio.plugins = [augmentRequest(keycloak)];

  const onGetComponent = (component, wrap) => {
    const attrs = Utils.Component.clean(component, ['fieldId', 'dynamicOptions', 'multi']);
    if (component?.multi === true || component?.multi === 'true') {
      const multiSelect = (
        <MultiSelectAutocomplete
          className="hods-multi-select-autocomplete"
          {...component}
        />
      );
      if (wrap) {
        return Utils.Component.wrap(attrs, multiSelect);
      }
      return multiSelect;
    }
    return null;
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

  useEffect(() => {
    if (form && renderer === Renderers.FORM_IO) {
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
  }, [form, renderer]);

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

    loadForm();
    return () => {
      source.cancel('Cancelling request');
    };
  }, []);

  useEffect(() => {
    formatPreFillData();
  }, [preFillData]);

  if (submitted && children) {
    return children;
  }

  if (isLoaderVisible) {
    return <LoadingSpinner />;
  }

  return (
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
        viewOnly={viewOnly}
        hooks={{
          onGetComponent,
          onRequest: (req) => FormUtils.formHooks.onRequest(req, keycloak.token),
          onSubmit: async (type, payload, onSuccess) => {
            if (type === FORM_ACTIONS.NEXT) {
              if (cacheTisFormData) {
                setTisCache(TargetInformationUtil.convertToPrefill(payload));
              }
              // Do nothing.
              return onSuccess(payload);
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
          onCancel,
        }}
      />
      )}
    </>
  );
};

export default RenderForm;
