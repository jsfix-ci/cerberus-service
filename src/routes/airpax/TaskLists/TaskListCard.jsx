import React, { useContext } from 'react';
import { ApplicationContext } from '../../../context/ApplicationContext';

import { buildVoyageSection,
  buildMovementInfoSection,
  buildTargetIndicatorsSection,
  buildTaskTitleSection } from './TaskListSectionBuilder';

const TaskListCard = ({
  targetTask,
  taskStatus,
  currentUser,
}) => {
  const { refDataAirlineCodes } = useContext(ApplicationContext);
  return (
    <div className="govuk-task-list-card">
      <div className="card-container">
        {buildTaskTitleSection(targetTask, currentUser, taskStatus)}
        {buildVoyageSection(targetTask, refDataAirlineCodes)}
        {buildMovementInfoSection(targetTask)}
        {buildTargetIndicatorsSection(targetTask)}
      </div>
    </div>
  );
};

export default TaskListCard;
