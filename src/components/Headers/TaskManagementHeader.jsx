import { Link } from 'react-router-dom';
import React from 'react';

const TaskManagementHeader = ({ headerText, links = [], selectTabIndex, selectTaskManagementTabIndex }) => {
  return (
    <div className="heading-container govuk-!-margin-bottom-8">
      <h1 className="govuk-heading-xl govuk-!-margin-bottom-0 govuk-!-padding-right-1">
        {`Task management (${headerText})`}
      </h1>
      {
        links.map((link) => {
          if (link.show) {
            return (
              <Link
                key={link.url}
                className="task-link"
                onClick={() => {
                  selectTabIndex(0);
                  selectTaskManagementTabIndex(0);
                }}
                to={link.url}
              >
                {link.label}
              </Link>
            );
          }
        })
      }
    </div>
  );
};

export default TaskManagementHeader;
