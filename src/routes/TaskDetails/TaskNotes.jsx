import React from 'react';
// Utils
import { useFormSubmit } from '../../utils/formioSupport';
// Components / Pages
import RenderForm from '../../components/RenderForm';

const TaskNotesForm = ({ businessKey, processInstanceId, ...props }) => {
  const submitForm = useFormSubmit();
  return (
    <RenderForm
      onSubmit={async (data, form) => {
        await submitForm(
          '/process-definition/key/noteSubmissionWrapper/submit-form',
          businessKey,
          form,
          { ...data.data, processInstanceId },
          'noteCerberus',
        );
      }}
      {...props}
    />
  );
};

const TaskNotes = ({ displayForm, businessKey, processInstanceId, activityLog }) => {
  return (
    <div className="govuk-grid-column-one-third">
      {displayForm && (
      <TaskNotesForm
        formName="noteCerberus"
        businessKey={businessKey}
        processInstanceId={processInstanceId}
      />
      )}

      <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible" />

      <h3 className="govuk-heading-m">Activity</h3>

      {activityLog.map((activity) => {
        return (
          <React.Fragment key={activity.id}>
            <p className="govuk-body-s govuk-!-margin-bottom-2">
              <span className="govuk-!-font-weight-bold">
                {new Date(activity.date).toLocaleDateString()}
              </span>
                    &nbsp;at <span className="govuk-!-font-weight-bold">{new Date(activity.date).toLocaleTimeString()}</span>
              {activity.user && <>&nbsp;by <a href={`mailto:${activity.user}`}>{activity.user}</a></>}
            </p>
            <p className="govuk-body">{activity.note}</p>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default TaskNotes;
