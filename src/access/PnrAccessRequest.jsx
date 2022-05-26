import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import { Renderers } from '../utils/Form';
import { useKeycloak } from '../utils/keycloak';
import useAxiosInstance from '../utils/axiosInstance';

import { PNR_USER_SESSION_ID } from '../constants';

// Components / Pages
import RenderForm from '../components/RenderForm';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import OutcomeNotification from './OutcomeNotification';

// JSON
import viewPnrData from '../cop-forms/viewPnrData';

const PnrAccessRequest = ({ children }) => {
  const [isLoading, setLoading] = useState(false);
  const [isSubmitted, setSubmitted] = useState(false);
  const [displayForm, setDisplayForm] = useState(false);

  const keycloak = useKeycloak();
  const taskApiClient = useAxiosInstance(keycloak, config.taskApiUrl);
  const source = axios.CancelToken.source();
  const RESPONSE = {
    yes: 'yes',
  };

  const storeSession = (key, keycloakSessionId, pnrRequested) => {
    localStorage.setItem(key, JSON.stringify({
      sessionId: keycloakSessionId,
      requested: pnrRequested,
    }));
  };

  const hasStoredUserSession = () => {
    return !!localStorage.getItem(PNR_USER_SESSION_ID);
  };

  const shouldRequestPnrAuth = () => {
    if (!hasStoredUserSession()) {
      return true;
    }
    const storedUserSession = JSON.parse(localStorage.getItem(PNR_USER_SESSION_ID));
    return keycloak.sessionId !== storedUserSession.sessionId;
  };

  useEffect(async () => {
    setLoading(true);
    setDisplayForm(shouldRequestPnrAuth());
    setLoading(false);
    return () => {
      source.cancel('Cancelling request');
    };
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (displayForm) {
    return (
      <Layout>
        <div className="govuk-width-container ">
          <main className="govuk-main-wrapper govuk-main-wrapper--auto-spacing" id="main-content" role="main">
            <div className="govuk-grid-row">
              <div className="govuk-grid-column-full">
                {!isSubmitted && (
                <RenderForm
                  onSubmit={async (data) => {
                    try {
                      if (data.data.viewPnrData === RESPONSE.yes) {
                        const requestConfig = {
                          headers: { Authorization: `Bearer ${keycloak.token}` },
                        };
                        const response = await taskApiClient.post('/passenger-name-record-access-requests',
                          undefined, requestConfig);
                        storeSession(PNR_USER_SESSION_ID, response.data.user.sessionId, response.data.requested);
                      } else {
                        storeSession(PNR_USER_SESSION_ID, keycloak.sessionId, false);
                      }
                    } catch (e) {
                      setSubmitted(false);
                    } finally {
                      setSubmitted(true);
                    }
                  }}
                  form={viewPnrData}
                  renderer={Renderers.REACT}
                />
                )}
                {isSubmitted && <OutcomeNotification setShowForm={setDisplayForm} />}
              </div>
            </div>
          </main>
        </div>
      </Layout>
    );
  }

  if (!displayForm) {
    return children;
  }
  // return children;
};

export default PnrAccessRequest;
