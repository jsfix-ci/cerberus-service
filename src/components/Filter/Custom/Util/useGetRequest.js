// Global imports
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useKeycloak } from '../../../../context/Keycloak';

// Local imports
import { useAxiosInstance } from '../../../../utils/Axios/axiosInstance';
import config from '../../../../utils/config';

// Caches for responses and errors.
const cache = {};
const errorCache = {};

const clearCache = (cacheObject) => {
  const keys = Object.keys(cacheObject);
  keys.forEach((key) => {
    delete cacheObject[key];
  });
};

export const clear = () => {
  clearCache(cache);
  clearCache(errorCache);
};

export const STATUS_IDLE = 'idle';
export const STATUS_FETCHING = 'fetching';
export const STATUS_FETCHED = 'fetched';
export const STATUS_ERROR = 'error';

const useGetRequest = (url) => {
  const keycloak = useKeycloak();
  const axiosInstance = useAxiosInstance(keycloak, config.refdataApiUrl);
  const cancelToken = axios.CancelToken.source();
  const cancelRequests = () => {
    if (cancelToken) cancelToken.cancel();
  };
  const [status, setStatus] = useState(STATUS_IDLE);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  useEffect(() => {
    if (!url || !axiosInstance) return;

    const fetchData = async () => {
      try {
        setError(null);
        setStatus(STATUS_FETCHING);
        let fetchedData;
        if (cache[url]) {
          fetchedData = cache[url];
        } else if (errorCache[url]) {
          /**
           * This logic is intended to stop multiple requests being made in succession
           * that all fail. Presently, this will only allow the first request to be
           * made and then never make the same request again until the page is reloaded.
           * This is probably not the desired behaviour overall so some sort of cooldown
           * might be good here.
           */
          throw errorCache[url];
        } else {
          const response = await axiosInstance.get(url, {
            cancelToken: cancelToken.token,
          }).catch((e) => {
            throw e;
          });
          fetchedData = response.data;
          cache[url] = fetchedData;
        }
        setData(fetchedData);
        setStatus(STATUS_FETCHED);
      } catch (e) {
        errorCache[url] = e;
        setError(e);
        setData(null);
        setStatus(STATUS_ERROR);
      }
    };
    fetchData();
  }, [axiosInstance, url, cancelToken.token]);

  return { status, error, data, cancelRequests };
};

export default useGetRequest;
