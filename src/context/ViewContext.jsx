import React, { createContext, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { TASK_LIST_PATHS } from '../utils/constants';

const ViewContext = createContext({});

const ViewProvider = ({ children }) => {
  const location = useLocation();
  const view = useRef('');

  const setView = (_view) => {
    view.current = _view;
  };

  const getView = () => {
    return view.current;
  };

  const getViewByPath = (path) => {
    switch (path) {
      case TASK_LIST_PATHS.RORO: {
        setView('RORO');
        break;
      }
      case TASK_LIST_PATHS.AIRPAX: {
        setView('AIRPAX');
        break;
      }
      case TASK_LIST_PATHS.RORO_V2: {
        setView('RORO_V2');
        break;
      }
      default: {
        setView('NONE');
        break;
      }
    }
  };

  useEffect(() => {
    console.log('VIEW CONTEXT - USE EFFECT TRIGGERED');
    getViewByPath(location.pathname);
  }, [location.pathname]);

  return (
    <ViewContext.Provider value={getView}>
      {children}
    </ViewContext.Provider>
  );
};

export { ViewContext, ViewProvider };
