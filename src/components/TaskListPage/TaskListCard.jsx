import React from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { buildVoyageSection, buildMovementInfoSection, buildTargetIndicatorsSection } from './airpax/TaskListSectionBuilder';

const TaskListCard = ({ targetTask }) => {
  dayjs.extend(utc);
  dayjs.extend(timezone);

  return (
    <div className="govuk-task-list-card">
      <div className="card-container">
        {buildVoyageSection(targetTask)}
        {buildMovementInfoSection(targetTask)}
        {buildTargetIndicatorsSection(targetTask)}
      </div>
    </div>
  );
};

export default TaskListCard;
