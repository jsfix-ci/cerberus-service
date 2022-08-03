import axios from 'axios';

const useAxiosInstance = (keycloak, baseURL = '/') => {
  const axiosInstance = axios.create({
    baseURL,
    headers: {
      Authorization: keycloak ? `Bearer ${keycloak.token}` : undefined,
    },
  });

  axiosInstance.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${keycloak?.token}`;
    return config;
  });

  return axiosInstance;
};

export default useAxiosInstance;
