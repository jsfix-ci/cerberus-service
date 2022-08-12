import React, { useState, createContext } from 'react';

import { PNR_USER_SESSION_ID } from '../utils/constants';

const PnrAccessContext = createContext({});

const PnrAccessProvider = ({ children }) => {
  const storedUserSession = JSON.parse(localStorage.getItem(PNR_USER_SESSION_ID));
  const [canViewPnrData, setCanViewPnrData] = useState(storedUserSession?.requested);

  const setViewPnrData = (viewData) => setCanViewPnrData(viewData);

  return (
    <PnrAccessContext.Provider value={{ canViewPnrData, setViewPnrData }}>
      {children}
    </PnrAccessContext.Provider>
  );
};

export { PnrAccessContext, PnrAccessProvider };
