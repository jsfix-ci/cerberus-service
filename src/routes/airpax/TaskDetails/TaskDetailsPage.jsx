import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// Utils
import { useKeycloak } from '../../../utils/keycloak';
// Components/Pages
import ActivityLog from '../../../components/ActivityLog';

const TaskDetailsPage = () => {
  const { businessKey } = useParams();
  const keycloak = useKeycloak();
  const currentUser = keycloak.tokenParsed.email;
  const [assignee, setAssignee] = useState();

  // TEMP VALUES FOR TESTING
  const TaskData = {
    id: 'DEV-20220414-001',
    notes: [
      {
        content: 'task created',
        timestamp: '2022-04-14T08:18:09.888175Z',
        userId: 'rules-based-targeting',
      },
      {
        content: 'a note that existed previously',
        timestamp: '2021-10-01T01:15:35Z',
        userId: 'jane.doe@digital.homeoffice.gov.uk',
      },
      {
        content: "joe's test note",
        timestamp: '2021-12-11T05:10:59Z',
        userId: 'joe.bloggs@digital.homeoffice.gov.uk',
      },
      {
        content: 'really long note more words more words more words more words more words more words more words more words more words more words more words more words more words more words more words more words more words more words more words  more words  more words  more word',
        timestamp: '2021-10-01T01:15:35Z',
        userId: 'jane.doe@digital.homeoffice.gov.uk',
      },
      {
        content: "joe's test note",
        timestamp: '2021-12-11T05:10:59Z',
        userId: 'joe.bloggs@digital.homeoffice.gov.uk',
      },
    ],
  };

  // TEMP SET STATES FOR TESTING
  useEffect(() => {
    // setAssignee(TaskData?.assignee); // Test if no assignee : no form
    // setAssignee('notthisuser'); // Test if assignee not current user : no form
    setAssignee(currentUser); // Test if assignee is current user : yes form
  }, [TaskData]);

  // TEMP NOTES FORM FOR TESTING
  const AddANoteForm = () => {
    return (
      <div>
        <div className="govuk-form-group formio-component formio-component-form formio-component-label-hidden">
          <div className="govuk-form-group form-group has-feedback formio-component formio-component-textarea formio-component-note  required">
            <label htmlFor="tempNotesForm" className="field-required govuk-label">
              Add a new note
            </label>
            <div className="govuk-error-message" />
            <div>
              <textarea id="tempNotesForm" rows="3" spellCheck="true" className="form-control govuk-textarea" type="text" name="tempNotesForm" />
            </div>
          </div>
          <div className="govuk-form-group form-group has-feedback formio-component formio-component-button formio-component-submit  form-group" id="e613luh">
            <button lang="en" type="submit" name="data[submit]" className="govuk-button" disabled="disabled">
              Save
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="govuk-grid-row govuk-task-detail-header govuk-!-padding-bottom-9">
        <div className="govuk-grid-column-one-half">
          <span className="govuk-caption-xl">{businessKey}</span>
          <h3 className="govuk-heading-xl govuk-!-margin-bottom-0">Overview</h3>
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          Versions go here
        </div>
        <div className="govuk-grid-column-one-third">
          {assignee && <AddANoteForm />}
          <ActivityLog
            activityLog={TaskData.notes}
          />
        </div>
      </div>

    </>
  );
};

export default TaskDetailsPage;
