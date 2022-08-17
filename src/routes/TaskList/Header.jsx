import { Link } from 'react-router-dom';
import React from 'react';
import { TASK_LIST_PATHS, STRINGS, VIEW } from '../../utils/constants';
import config from '../../utils/config';

const Header = ({ view, selectTabIndex, selectTaskManagementTabIndex }) => {
  const getHeadingByView = () => {
    if (view === VIEW.RORO) {
      return STRINGS.TASK_MANAGEMENT_INLINE_HEADERS.RORO_V2;
    }
    if (view === VIEW.AIRPAX) {
      return STRINGS.TASK_MANAGEMENT_INLINE_HEADERS.AIRPAX;
    }
  };

  const getLinkByView = () => {
    if (view === VIEW.RORO) {
      return (
        <>
          <Link
            className="roro-task-link"
            onClick={() => {
              selectTabIndex(0);
              selectTaskManagementTabIndex(0);
            }}
            to={TASK_LIST_PATHS.RORO}
          >
            {STRINGS.TASK_LINK_HEADERS.RORO_V1}
          </Link>
          {config.copTargetingApiEnabled && (
            <Link
              className="airpax-task-link"
              onClick={() => {
                selectTabIndex(0);
                selectTaskManagementTabIndex(0);
              }}
              to={TASK_LIST_PATHS.AIRPAX}
            >
              {STRINGS.TASK_LINK_HEADERS.AIRPAX}
            </Link>
          )}
        </>
      );
    }
    if (view === VIEW.AIRPAX) {
      return (
        <>
          <Link
            className="roro-task-link"
            onClick={() => {
              selectTabIndex(0);
              selectTaskManagementTabIndex(0);
            }}
            to={TASK_LIST_PATHS.RORO}
          >
            {STRINGS.TASK_LINK_HEADERS.RORO_V1}
          </Link>
          {config.roroV2ViewEnabled && (
            <Link
              className="roro-task-link"
              onClick={() => {
                selectTabIndex(0);
                selectTaskManagementTabIndex(0);
              }}
              to={TASK_LIST_PATHS.RORO_V2}
            >
              {STRINGS.TASK_LINK_HEADERS.RORO_V2}
            </Link>
          )}
        </>
      );
    }
  };

  return (
    <div className="heading-container govuk-!-margin-bottom-8">
      <h1 className="govuk-heading-xl govuk-!-margin-bottom-0 govuk-!-padding-right-1">
        {`Task management (${getHeadingByView()})`}
      </h1>
      {getLinkByView()}
    </div>
  );
};

export default Header;
