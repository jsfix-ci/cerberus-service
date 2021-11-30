import React, { useState, createContext } from 'react';

const TaskSelectedTabContext = createContext();

const TaskSelectedTabProvider = ({ children }) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const selectTabIndex = (tabIndex) => setSelectedTabIndex(tabIndex);
  return (
    <TaskSelectedTabContext.Provider value={{ selectedTabIndex, selectTabIndex }}>
      {children}
    </TaskSelectedTabContext.Provider>
  );
};

export { TaskSelectedTabContext, TaskSelectedTabProvider };
