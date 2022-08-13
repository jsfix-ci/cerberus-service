import React, { createContext, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { PATHS, VIEW } from '../utils/constants';

const ViewContext = createContext({});

/**
 * This context file contains is for holding state data that does not change
 * frequently and can be accessible throughout the app.
 */
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

export default ViewProvider;

export { ViewContext };
