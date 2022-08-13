import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { PATHS, VIEW } from '../utils/constants';

const ViewContext = createContext({});

const ViewProvider = ({ children }) => {
  const _view = useRef('');
  const location = useLocation();

  const getView = () => {
    return _view.current;
  };

  const setView = (value) => {
    _view.current = value;
  };

  useEffect(() => {
    const determineViewByLocation = (_location) => {
      if (PATHS.RORO_PATHS.includes(_location)) {
        setView(VIEW.RORO);
      }
      if (PATHS.AIRPAX_PATHS.includes(_location)) {
        setView(VIEW.AIRPAX);
      }
      if (!PATHS.AIRPAX_PATHS.includes(_location) && !PATHS.RORO_PATHS.includes((_location))) {
        setView(VIEW.NONE);
      }
    };

    determineViewByLocation(location?.pathname);
  }, [location?.pathname]);

  return (
    <ViewContext.Provider value={{ getView }}>
      {children}
    </ViewContext.Provider>
  );
};

const useView = () => useContext(ViewContext);

export { useView, ViewContext, ViewProvider };
