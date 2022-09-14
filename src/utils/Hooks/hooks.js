import { useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import { useKeycloak } from '../../context/Keycloak';

import { useAxiosInstance } from '../Axios/axiosInstance';

import config from '../config';

import { ApplicationContext } from '../../context/ApplicationContext';

export const useIsMounted = () => {
  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  return isMounted;
};

export const useGetRefDataAirlineCodes = () => {
  const keycloak = useKeycloak();
  const source = axios.CancelToken.source();
  const refDataClient = useAxiosInstance(keycloak, config.refdataApiUrl);
  const { setRefDataAirlineCodes } = useContext(ApplicationContext);

  useEffect(() => {
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

    if (keycloak?.token) {
      getAirlineCodes();
    }
    return () => {
      source.cancel('Cancelling request');
    };
  }, [keycloak]);
};

export default useIsMounted;
