import React from 'react';

const ActivityLog = ({ activityLog }) => {
  return (
    <>
      <h3 className="govuk-heading-m task-details-notes-heading">Task activity</h3>
      { activityLog.map((activity, i) => {
        return (
          <div key={i}>
            <div className="activity-body-container">
              <p className="govuk-body-s govuk-!-margin-bottom-2">
                <span className="govuk-!-font-weight-bold">
                  {new Date(activity.timestamp).toLocaleDateString()}
                </span>
                &nbsp;at <span className="govuk-!-font-weight-bold">{new Date(activity.timestamp).toLocaleTimeString()}</span>
                {activity.userId && <>&nbsp;by <a href={`mailto:${activity.userId}`}>{activity.userId}</a></>}
              </p>
              <p className="govuk-body">{activity.content}</p>
            </div>
            <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible" />
          </div>
        );
      })}
    </>
  );
};
export default ActivityLog;
