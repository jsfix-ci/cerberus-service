import React, { useState, createContext } from 'react';

// Setting default value of TaskSelectedTabContext as empty object to avoid undefined error
const TaskSelectedTabContext = createContext({});

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
