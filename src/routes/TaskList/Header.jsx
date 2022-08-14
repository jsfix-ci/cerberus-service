import { Link } from 'react-router-dom';
import React from 'react';
import { TASK_LIST_PATHS, STRINGS, VIEW } from '../../utils/constants';

const Header = ({ view, selectTabIndex, selectTaskManagementTabIndex }) => {
  const getHeadingByView = () => {
    if (view === VIEW.RORO) {
      return STRINGS.RORO_HEADER;
    }
    if (view === VIEW.RORO_V2) {
      return STRINGS.RORO_HEADER_V2;
    }
    if (view === VIEW.AIRPAX) {
      return STRINGS.AIRPAX_HEADER;
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
            to={TASK_LIST_PATHS.RORO_V2[0]}
          >
            RoRo V2 tasks
          </Link>
          <Link
            className="airpax-task-link"
            onClick={() => {
              selectTabIndex(0);
              selectTaskManagementTabIndex(0);
            }}
            to={TASK_LIST_PATHS.AIRPAX[0]}
          >
            Airpax tasks
          </Link>
        </>
      );
    }
    if (view === VIEW.RORO_V2) {
      return (
        <>
          <Link
            className="roro-task-link"
            onClick={() => {
              selectTabIndex(0);
              selectTaskManagementTabIndex(0);
            }}
            to={TASK_LIST_PATHS.RORO[0]}
          >
            RoRo tasks
          </Link>
          <Link
            className="airpax-task-link"
            onClick={() => {
              selectTabIndex(0);
              selectTaskManagementTabIndex(0);
            }}
            to={TASK_LIST_PATHS.AIRPAX[0]}
          >
            Airpax tasks
          </Link>
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
            to={TASK_LIST_PATHS.RORO[0]}
          >
            RoRo tasks
          </Link>
          <Link
            className="roro-task-link"
            onClick={() => {
              selectTabIndex(0);
              selectTaskManagementTabIndex(0);
            }}
            to={TASK_LIST_PATHS.RORO_V2[0]}
          >
            RoRo V2 tasks
          </Link>
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
