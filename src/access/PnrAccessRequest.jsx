import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import { useKeycloak } from '../utils/keycloak';
import useAxiosInstance from '../utils/axiosInstance';

import Layout from '../components/Layout';
import PnrRequestForm from './PnrRequestForm';
import LoadingSpinner from '../components/LoadingSpinner';

import { PNR_USER_SESSION_ID } from '../constants';

import PNR_DATA from './resources/pnrData';
import OutcomeNotification from './OutcomeNotification';

const PnrAccessRequest = ({ children }) => {
  const [isLoading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isSubmitted, setSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const keycloak = useKeycloak();
  const taskApiClient = useAxiosInstance(keycloak, config.taskApiUrl);
  const source = axios.CancelToken.source();

  // Remove any preselected values from the form on page reload
  window.onunload = function () {
    localStorage.removeItem(PNR_DATA.id);
  };

  const storeUserSession = (key, keycloakSessionId, pnrRequested) => {
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

  const checkError = (e) => {
    const { name } = e.target;
    const error = localStorage.getItem(name) === null;
    setHasError(error);
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    /**
     * For radio button error handling as useState()
     * does not update fast enough
     */
    localStorage.setItem(name, value);
    checkError(e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name } = e.target;
    if (!checkError(e)) {
      if (localStorage.getItem(PNR_DATA.id) === 'true') {
        try {
          const requestConfig = {
            headers: { Authorization: `Bearer ${keycloak.token}` },
          };
          const response = await taskApiClient.post('/passenger-name-record-access-requests',
            {}, requestConfig);
          if (response.status === 200) {
            storeUserSession(PNR_USER_SESSION_ID, response.data.user.sessionId, response.data.requested);
          }
        } catch (ex) {
          setSubmitted(false);
        }
      } else {
        storeUserSession(PNR_USER_SESSION_ID, keycloak.sessionId, false);
      }
      // setShowForm(false);
      setSubmitted(true);
      localStorage.removeItem(name);
    }
  };

  useEffect(async () => {
    if (!hasStoredUserSession()) {
      setLoading(true);
      const response = await taskApiClient.get('/passenger-name-record-access-requests');
      storeUserSession(PNR_USER_SESSION_ID, response.data.user.sessionId, response.data.requested);
    }
    setShowForm(shouldRequestPnrAuth());
    setLoading(false);
    return () => {
      source.cancel('Cancelling request');
    };
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (showForm) {
    return (
      <Layout>
        {!isSubmitted && (
        <PnrRequestForm
          pnrData={PNR_DATA}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          hasError={hasError}
          isSubmitted={isSubmitted}
        />
        )}
        {isSubmitted && <OutcomeNotification pnrData={PNR_DATA} setShowForm={setShowForm} />}
      </Layout>
    );
  }

  return children;
};

export default PnrAccessRequest;
