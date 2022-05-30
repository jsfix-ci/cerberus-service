import React, { useState, useEffect } from 'react';
import config from '../../config';
import { Renderers } from '../../utils/Form';
import { useKeycloak } from '../../utils/keycloak';
import useAxiosInstance from '../../utils/axiosInstance';

import { PNR_USER_SESSION_ID } from '../../constants';

// Components / Pages
import RenderForm from '../../components/RenderForm';
import Layout from '../../components/Layout';
import OutcomeNotification from './OutcomeNotification';

// JSON
import viewPnrData from '../../cop-forms/viewPnrData';

const PnrAccessRequest = ({ children }) => {
  const [isSubmitted, setSubmitted] = useState(false);
  const [displayForm, setDisplayForm] = useState(false);

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
    return !!localStorage.getItem(PNR_USER_SESSION_ID);
  };

  const shouldRequestPnrAccess = () => {
    if (!hasStoredUserSession()) {
      return true;
    }
    const storedUserSession = JSON.parse(localStorage.getItem(PNR_USER_SESSION_ID));
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
      <div className="govuk-width-container ">
        <main className="govuk-main-wrapper govuk-main-wrapper--auto-spacing" id="main-content" role="main">
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-full">
              {!isSubmitted && (
                <RenderForm
                  onSubmit={
                    async (data) => {
                      try {
                        if (data.data.viewPnrData === RESPONSE.yes) {
                          const response = await taskApiClient.post(
                            '/passenger-name-record-access-requests',
                            undefined,
                            { headers: { Authorization: `Bearer ${keycloak.token}` } },
                          );
                          storeSession(PNR_USER_SESSION_ID, response.data.user.sessionId, response.data.requested);
                        } else {
                          storeSession(PNR_USER_SESSION_ID, keycloak.sessionId, false);
                        }
                      } catch (e) {
                        setSubmitted(false);
                      } finally {
                        setSubmitted(true);
                      }
                    }
                  }
                  form={viewPnrData}
                  renderer={Renderers.REACT}
                />
              )}
              {isSubmitted && <OutcomeNotification setDisplayForm={setDisplayForm} />}
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default PnrAccessRequest;
