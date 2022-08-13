import React, { useState, useEffect, useContext } from 'react';
import config from '../utils/config';
import { Renderers } from '../utils/Form/ReactForm';
import { useKeycloak } from '../context/Keycloak';
import { useAxiosInstance } from '../utils/Axios/axiosInstance';

import { PnrAccessContext } from '../context/PnrAccessContext';

import { LOCAL_STORAGE_KEYS } from '../utils/constants';

// Components / Pages
import RenderForm from '../components/RenderForm/RenderForm';
import Layout from '../components/Layout/Layout';

// Styling
import './PnrAccessRequest.scss';

// JSON
import viewPnrData from '../forms/viewPnrData';

const PnrAccessRequest = ({ children }) => {
  const [isSubmitted, setSubmitted] = useState(false);
  const [displayForm, setDisplayForm] = useState(false);
  const { setViewPnrData } = useContext(PnrAccessContext);

  const keycloak = useKeycloak();
  const taskApiClient = useAxiosInstance(keycloak, config.taskApiUrl);
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
    return !!localStorage.getItem(LOCAL_STORAGE_KEYS.PNR_USER_SESSION_ID);
  };

  const shouldRequestPnrAccess = () => {
    if (!config.copTargetingApiEnabled) {
      return false;
    }
    if (!hasStoredUserSession()) {
      return true;
    }
    const storedUserSession = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.PNR_USER_SESSION_ID));
    return keycloak.sessionId !== storedUserSession.sessionId;
  };

  useEffect(async () => {
    setDisplayForm(shouldRequestPnrAccess());
  }, []);

  if (!displayForm) {
    return children;
  }

  return (
    <Layout>
      <div className="govuk-width-container pnr-access-form-container">
        <main className="govuk-main-wrapper govuk-main-wrapper--auto-spacing" id="main-content" role="main">
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-full">
              {!isSubmitted && (
                <RenderForm
                  onSubmit={
                    async ({ data }) => {
                      let postParam = { requested: false };
                      try {
                        if (data.viewPnrData === RESPONSE.yes && data.approvedSite === RESPONSE.yes) {
                          postParam.requested = true;
                        }
                        const response = await taskApiClient.post(
                          '/passenger-name-record-access-requests', postParam, {
                            headers: {
                              Authorization: `Bearer ${keycloak.token}`,
                            },
                          },
                        );
                        storeSession(
                          LOCAL_STORAGE_KEYS.PNR_USER_SESSION_ID, response.data.user.sessionId, response.data.requested,
                        );
                        setViewPnrData(response.data.requested);
                      } catch (e) {
                        setSubmitted(false);
                      } finally {
                        setDisplayForm(false);
                        setSubmitted(true);
                      }
                    }
                  }
                  form={viewPnrData}
                  renderer={Renderers.REACT}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default PnrAccessRequest;
