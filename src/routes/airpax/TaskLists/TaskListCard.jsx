import React from 'react';
import { TASK_STATUS_TARGET_ISSUED, TASK_STATUS_COMPLETED } from '../../../constants';
import { buildVoyageSection, buildMovementInfoSection, buildTargetIndicatorsSection } from './TaskListSectionBuilder';
import ClaimUnclaimTask from '../../../components/ClaimUnclaimTask';

const TaskListCard = ({
  targetTask,
  airlineCodes,
  taskStatus,
  currentUser,
}) => {
  return (
    <div className="govuk-task-list-card">
      <div className="claim-button-container">
        {(taskStatus !== TASK_STATUS_TARGET_ISSUED && taskStatus !== TASK_STATUS_COMPLETED)
            && (
              <ClaimUnclaimTask
                currentUser={currentUser}
                assignee={targetTask.assignee}
                businessKey={targetTask.id}
                source={`/airpax/tasks/${targetTask.id}`}
                buttonType="button"
              />
            )}
      </div>
      <div className="card-container">
        {buildVoyageSection(targetTask, airlineCodes)}
        {buildMovementInfoSection(targetTask)}
        {buildTargetIndicatorsSection(targetTask)}
      </div>
    </div>
  );
};

export default TaskListCard;
