import React, { useState, createContext, useEffect } from 'react';
import { useKeycloak } from '../utils/keycloak';

import useAxiosInstance from '../utils/axiosInstance';

import config from '../config';

const ApplicationContext = createContext({});

const ApplicationContextProvider = ({ children }) => {
  const keycloak = useKeycloak();
  const refDataClient = useAxiosInstance(keycloak, config.refdataApiUrl);
  const [refDataAirlineCodes, setRefDataAirlineCodes] = useState([]);
  const [airPaxRefDataMode, setAirpaxRefDataMode] = useState([]);

  const getAirpaxRefDataMode = async () => {
    let response;
    try {
      response = await refDataClient.get('/v2/entities/targetmode', {
        params: {
          mode: 'dataOnly',
          filter: 'modecode=eq.airpass',
        },
      });
      setAirpaxRefDataMode(response.data.data[0]);
    } catch (e) {
      setAirpaxRefDataMode({});
    }
  };

  const getAirlineCodes = async () => {
    let response;
    try {
      response = await refDataClient.get('/v2/entities/carrierlist', {
        params: {
          mode: 'dataOnly',
        },
      });
      setRefDataAirlineCodes(response.data.data);
    } catch (e) {
      setRefDataAirlineCodes([]);
    }
  };

  useEffect(() => {
    getAirlineCodes();
    getAirpaxRefDataMode();
  }, [keycloak]);

  return (
    <ApplicationContext.Provider value={{ refDataAirlineCodes, airPaxRefDataMode }}>
      {children}
    </ApplicationContext.Provider>
  );
};

export { ApplicationContext, ApplicationContextProvider };
