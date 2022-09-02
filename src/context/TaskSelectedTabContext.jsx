import React, { useState, createContext } from 'react';

const TaskSelectedTabContext = createContext({});

const TaskSelectedTabProvider = ({ children }) => {
  const [taskManagementTabIndex, setTaskManagementTabIndex] = useState(0);

  const selectTaskManagementTabIndex = (tabIndex) => setTaskManagementTabIndex(tabIndex);

  return (
    <TaskSelectedTabContext.Provider
      value={{ taskManagementTabIndex, selectTaskManagementTabIndex }}
    >
      {children}
    </TaskSelectedTabContext.Provider>
  );
};

export { TaskSelectedTabContext, TaskSelectedTabProvider };
