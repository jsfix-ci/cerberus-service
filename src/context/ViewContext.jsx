import React, { createContext, useRef } from 'react';

const ViewContext = createContext({});

const ViewProvider = ({ children }) => {
  const view = useRef('');

  const setView = (_view) => {
    view.current = _view;
  };

  const getView = () => {
    return view.current;
  };

  return (
    <ViewContext.Provider value={{ getView, setView }}>
      {children}
    </ViewContext.Provider>
  );
};

export { ViewContext, ViewProvider };
