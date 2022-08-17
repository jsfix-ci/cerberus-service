import React, { useState, createContext } from 'react';

import { LOCAL_STORAGE_KEYS } from '../utils/constants';

const PnrAccessContext = createContext({});

const PnrAccessProvider = ({ children }) => {
  const storedUserSession = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.PNR_USER_SESSION_ID));
  const [canViewPnrData, setCanViewPnrData] = useState(storedUserSession?.requested);

  const setViewPnrData = (viewData) => setCanViewPnrData(viewData);

  return (
    <PnrAccessContext.Provider value={{ canViewPnrData, setViewPnrData }}>
      {children}
    </PnrAccessContext.Provider>
  );
};

export { PnrAccessContext, PnrAccessProvider };
