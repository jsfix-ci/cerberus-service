import React, { createContext, useRef } from 'react';

const ApplicationContext = createContext({});

/**
 * This context file contains is for holding state data that does not change
 * frequently and can be accessible throughout the app.
 */
const ApplicationContextProvider = ({ children }) => {
  const _refDataAirlineCodes = useRef([]);
  const _airPaxRefDataMode = useRef({});
  const _airPaxTisCache = useRef({});

  const refDataAirlineCodes = () => {
    return _refDataAirlineCodes.current;
  };

  const setRefDataAirlineCodes = (value) => {
    _refDataAirlineCodes.current = value;
  };

  const airPaxRefDataMode = () => {
    return _airPaxRefDataMode.current;
  };

  const setAirpaxRefDataMode = (value) => {
    _airPaxRefDataMode.current = value;
  };

  const airPaxTisCache = () => {
    return _airPaxTisCache.current;
  };

  const setAirpaxTisCache = (value) => {
    _airPaxTisCache.current = value;
  };

  return (
    <ApplicationContext.Provider value={{ refDataAirlineCodes,
      setRefDataAirlineCodes,
      airPaxRefDataMode,
      setAirpaxRefDataMode,
      airPaxTisCache,
      setAirpaxTisCache }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};

export { ApplicationContext, ApplicationContextProvider };
