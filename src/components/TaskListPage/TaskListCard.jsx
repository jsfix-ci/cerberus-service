import React from 'react';
import { buildSecondSection, buildThirdSection, buildFourthSection } from './airpax/TaskListSectionBuilder';

const TaskListCard = ({ targetTask }) => {
  return (
    <div className="govuk-task-list-card" key={targetTask.id}>
      <div className="card-container">
        {buildSecondSection(targetTask)}
        {buildThirdSection(targetTask)}
        {buildFourthSection(targetTask)}
      </div>
    </div>
  );
};

export default TaskListCard;
