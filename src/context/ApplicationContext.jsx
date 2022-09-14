import React, { createContext, useRef } from 'react';

const ApplicationContext = createContext({});

/**
 * This context file contains is for holding state data that does not change
 * frequently and can be accessible throughout the app.
 */
const ApplicationContextProvider = ({ children }) => {
  const _refDataAirlineCodes = useRef([]);
  const _tisCache = useRef({});

  const refDataAirlineCodes = () => {
    return _refDataAirlineCodes.current;
  };

  const setRefDataAirlineCodes = (value) => {
    _refDataAirlineCodes.current = value;
  };

  const tisCache = () => {
    return _tisCache.current;
  };

  const setTisCache = (value) => {
    _tisCache.current = value;
  };

  return (
    <ApplicationContext.Provider value={{ refDataAirlineCodes,
      setRefDataAirlineCodes,
      tisCache,
      setTisCache }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};

export { ApplicationContext, ApplicationContextProvider };
