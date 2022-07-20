import React, { useState, createContext } from 'react';

// Setting default value of TaskSelectedTabContext as empty object to avoid undefined error
const TaskSelectedTabContext = createContext({});

const TaskSelectedTabProvider = ({ children }) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [taskManagementTabIndex, setTaskManagementTabIndex] = useState(0);

  const selectTabIndex = (tabIndex) => setSelectedTabIndex(tabIndex);
  const selectTaskManagementTabIndex = (tabIndex) => setTaskManagementTabIndex(tabIndex);

  return (
    <TaskSelectedTabContext.Provider
      value={{ selectedTabIndex, selectTabIndex, taskManagementTabIndex, selectTaskManagementTabIndex }}
    >
      {children}
    </TaskSelectedTabContext.Provider>
  );
};

export { TaskSelectedTabContext, TaskSelectedTabProvider };
