import React from 'react';

import { buildVoyageSection,
  buildMovementInfoSection,
  buildTargetIndicatorsSection,
  buildTaskTitleSection } from './TaskListSectionBuilder';

const TaskListCard = ({
  targetTask,
  airlineCodes,
  taskStatus,
  currentUser,
}) => {
  return (
    <div className="govuk-task-list-card">
      <div className="card-container">
        {buildTaskTitleSection(targetTask, currentUser, taskStatus)}
        {buildVoyageSection(targetTask, airlineCodes)}
        {buildMovementInfoSection(targetTask)}
        {buildTargetIndicatorsSection(targetTask)}
      </div>
    </div>
  );
};

export default TaskListCard;
