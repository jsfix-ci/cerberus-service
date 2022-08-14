/**
 * React implementation of GOV.UK Design System Tabs
 * Demo: https://design-system.service.gov.uk/components/tabs/
 * Code: https://github.com/alphagov/govuk-frontend/blob/master/package/govuk/components/tabs/README.md
 */

import React, { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { TASK_STATUS, TASK_LIST_PATHS } from '../../utils/constants';
import { TaskSelectedTabContext } from '../../context/TaskSelectedTabContext';

const Tabs = ({
  id, idPrefix, className, title, items, onTabClick, tabIndex, ...attributes
}) => {
  const location = useLocation();
  const isTaskListPage = TASK_LIST_PATHS.ALL_TASK_LIST.includes(location.pathname);
  const { selectedTabIndex, selectTabIndex, selectTaskManagementTabIndex } = useContext(TaskSelectedTabContext);
  const indexToUse = isTaskListPage ? (selectedTabIndex || 0) : 0;
  const [currentTabIndex, setCurrentTabIndex] = useState(indexToUse);
  const currentTab = items[currentTabIndex];
  const currentTabId = currentTab.id || `${idPrefix}-${currentTabIndex}`;
  const panelIsReactElement = typeof currentTab.panel === 'string' || Array.isArray(currentTab.panel) || React.isValidElement(currentTab.panel);
  const panelAttributes = panelIsReactElement ? {} : currentTab.panel.attributes;
  const panelContents = panelIsReactElement ? currentTab.panel : currentTab.panel.children;
  const forceTabIndex = location.search?.split('tab=')[1] === TASK_STATUS.NEW;

  useEffect(() => {
    if (forceTabIndex) {
      setCurrentTabIndex(0);
    }
  }, [forceTabIndex]);

  return (
    <div
      id={id}
      className={classNames('govuk-tabs', className)}
      {...attributes}
    >
      {title && <h2 className="govuk-tabs__title">{title}</h2>}

      {items.length > 0 && (
      <>
        <ul className="govuk-tabs__list">
          {items.map((item, index) => {
            const itemId = item.id || `${idPrefix}-${index}`;
            return (
              <li
                key={item.id}
                className={classNames('govuk-tabs__list-item', { 'govuk-tabs__list-item--selected': index === currentTabIndex })}
              >
                <a
                  className="govuk-tabs__tab"
                  onClick={(e) => {
                    e.preventDefault();
                    selectTabIndex(index);
                    setCurrentTabIndex(index);
                    if (isTaskListPage) {
                      selectTaskManagementTabIndex(index);
                    }
                    if (onTabClick) {
                      onTabClick(item, index);
                    }
                  }}
                  href={`#${itemId}`}
                  {...item.attributes}
                  name={item.label}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
        <div
          key={currentTabId}
          className="govuk-tabs__panel"
          id={currentTabId}
          {...panelAttributes}
        >
          {panelContents}
        </div>
      </>
      )}
    </div>
  );
};

export default Tabs;
