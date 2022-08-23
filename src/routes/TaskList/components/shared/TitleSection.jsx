import React from 'react';

import { MovementUtil, RisksUtil } from '../../../../utils';

import { TASK_STATUS } from '../../../../utils/constants';

import ClaimUnclaimTask from '../../../../components/Buttons/ClaimUnclaimTask';

const TitleSection = ({ targetTask, currentUser, taskStatus, redirectPath }) => {
  return (
    <section>
      <div>
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-two-thirds">
            <div className="task-title-container govuk-!-padding-top-2 govuk-!-padding-left-2">
              <h4 className="govuk-heading-s task-heading">
                {MovementUtil.businessKey(targetTask)}
              </h4>
            </div>
            <div className="govuk-grid-column govuk-!-padding-left-2">
              {RisksUtil.formatHighestThreat(targetTask)}
            </div>
            <div className="govuk-grid-column govuk-!-padding-left-2">
              {MovementUtil.updatedStatus(targetTask)}
              {MovementUtil.relistStatus(targetTask)}
              {taskStatus === TASK_STATUS.COMPLETE
                && MovementUtil.outcomeStatusTag(MovementUtil.outcome(targetTask))}
            </div>
          </div>
          <div className="govuk-grid-column-one-third govuk-!-padding-top-2 govuk-!-padding-right-3">
            <div className="claim-button-container">
              {(taskStatus !== TASK_STATUS.ISSUED && taskStatus !== TASK_STATUS.COMPLETE)
                && (
                  <ClaimUnclaimTask
                    currentUser={currentUser}
                    assignee={targetTask.assignee}
                    businessKey={MovementUtil.businessKey(targetTask)}
                    source={redirectPath}
                    buttonType="button"
                  />
                )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TitleSection;
