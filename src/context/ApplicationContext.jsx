import React, { useState, createContext } from 'react';

const ApplicationContext = createContext({});

/**
 * This context file contains is for holding state data that does not change
 * frequently and can be accessible throughout the app.
 */
const ApplicationContextProvider = ({ children }) => {
  const [refDataAirlineCodes, setRefDataAirlineCodes] = useState([]);
  const [airPaxRefDataMode, setAirpaxRefDataMode] = useState({});

  return (
    <ApplicationContext.Provider value={{ refDataAirlineCodes, setRefDataAirlineCodes, airPaxRefDataMode, setAirpaxRefDataMode }}>
      {children}
    </ApplicationContext.Provider>
  );
};

export { ApplicationContext, ApplicationContextProvider };
