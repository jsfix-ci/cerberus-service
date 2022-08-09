import React, { createContext, useState } from 'react';

const ApplicationContext = createContext({});

/**
 * This context file contains is for holding state data that does not change
 * frequently and can be accessible throughout the app.
 */
const ApplicationContextProvider = ({ children }) => {
  const [refDataAirlineCodes, setRefDataAirlineCodes] = useState([]);
  const [airPaxRefDataMode, setAirpaxRefDataMode] = useState({});
  const [airPaxTisCache, setAirPaxTisCache] = useState({});

  return (
    <ApplicationContext.Provider value={{ refDataAirlineCodes,
      setRefDataAirlineCodes,
      airPaxRefDataMode,
      setAirpaxRefDataMode,
      airPaxTisCache,
      setAirPaxTisCache }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};

export { ApplicationContext, ApplicationContextProvider };
