import React, { useContext } from 'react';
import { ApplicationContext } from '../../../../context/ApplicationContext';

import TitleSection from './TitleSection';
import MovementSection from './MovementSection';
import TargetIndicatorsSection from './TargetIndicatorsSection';
import VoyageSection from './VoyageSection';

const TaskListCard = ({ targetTask, taskStatus, currentUser, redirectPath }) => {
  const { refDataAirlineCodes } = useContext(ApplicationContext);
  return (
    <div className="govuk-task-list-card">
      <div className="card-container">
        <TitleSection
          targetTask={targetTask}
          taskStatus={taskStatus}
          currentUser={currentUser}
          redirectPath={redirectPath}
        />
        <VoyageSection targetTask={targetTask} refDataAirlineCodes={refDataAirlineCodes()} />
        <MovementSection targetTask={targetTask} />
        <TargetIndicatorsSection targetTask={targetTask} redirectPath={redirectPath} />
      </div>
    </div>
  );
};

export default TaskListCard;
