import React, { useContext } from 'react';
import { ApplicationContext } from '../../context/ApplicationContext';

import { buildVoyageSection,
  buildMovementInfoSection,
  buildTargetIndicatorsSection,
  buildTaskTitleSection } from './TaskListSectionBuilder';

const TaskListCard = ({
  view,
  targetTask,
  taskStatus,
  currentUser,
}) => {
  const { refDataAirlineCodes } = useContext(ApplicationContext);
  return (
    <div className="govuk-task-list-card">
      <div className="card-container">
        {buildTaskTitleSection(view, targetTask, currentUser, taskStatus)}
        {buildVoyageSection(view, targetTask, refDataAirlineCodes())}
        {buildMovementInfoSection(view, targetTask)}
        {buildTargetIndicatorsSection(view, targetTask)}
      </div>
    </div>
  );
};

export default TaskListCard;
