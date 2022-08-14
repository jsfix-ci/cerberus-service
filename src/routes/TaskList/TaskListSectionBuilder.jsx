import React from 'react';
import { Link } from 'react-router-dom';

// Utils
import { RisksUtil } from '../../utils';

import { TASK_LIST_PATHS, VIEW } from '../../utils/constants';

// Component
import { MovementSection, TitleSection, VoyageSection } from './section';

const buildTaskTitleSection = (view, targetTask, currentUser, taskStatus) => {
  return (
    <TitleSection
      view={view}
      targetTask={targetTask}
      currentUser={currentUser}
      taskStatus={taskStatus}
    />
  );
};

const buildVoyageSection = (view, targetTask, refDataAirlineCodes) => {
  return (
    <VoyageSection
      view={view}
      targetTask={targetTask}
      refDataAirlineCodes={refDataAirlineCodes}
    />
  );
};

const buildMovementInfoSection = (view, targetTask) => {
  return (
    <section className="task-list--movement-info-section">
      <div className="govuk-grid-row">
        <MovementSection view={view} targetTask={targetTask} />
      </div>
    </section>
  );
};

const buildTargetIndicatorsSection = (view, targetTask) => {
  const targetingIndicators = RisksUtil.getIndicators(RisksUtil.getRisks(targetTask));

  const getViewDetailsURL = (_view, _targetTask) => {
    if (_view === VIEW.AIRPAX) {
      return `${TASK_LIST_PATHS.AIRPAX[0]}/${_targetTask.id}`;
    }
    if (_view === VIEW.RORO_V2) {
      return `${TASK_LIST_PATHS.RORO_V2[0]}/${_targetTask.id}`;
    }
  };

  return (
    <section className="task-list--target-indicator-section">
      <div className="govuk-grid-row">
        <div className="govuk-grid-item">
          <div className="govuk-grid-column">
            <ul className="govuk-list task-labels govuk-!-margin-top-2">
              <li className="task-labels-item">
                <strong className="govuk-!-font-weight-bold govuk-!-font-size-16">
                  Risk Score: {targetingIndicators.score}
                </strong>
              </li>
            </ul>
          </div>
          <div className="govuk-grid-column">
            <ul className="govuk-list task-labels govuk-!-margin-top-0">
              <li className="task-labels-item">
                {RisksUtil.format(targetingIndicators)}
              </li>
            </ul>
          </div>
        </div>
        <div className="govuk-grid-item task-link-container">
          <div>
            <Link
              className="govuk-link govuk-link--no-visited-state govuk-!-font-weight-bold"
              to={getViewDetailsURL(view, targetTask)}
            >
              View details
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export { buildTaskTitleSection, buildVoyageSection, buildMovementInfoSection, buildTargetIndicatorsSection };
