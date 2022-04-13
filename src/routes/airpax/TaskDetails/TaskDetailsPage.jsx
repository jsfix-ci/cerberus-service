import React from 'react';
import { useParams } from 'react-router-dom';
// Utils
import { useKeycloak } from '../../../utils/keycloak';
// Components/Pages
import TaskNotes from '../../../components/v2/TaskNotes';

const TaskDetailsPage = () => {
  const { businessKey } = useParams();
  const keycloak = useKeycloak();
  const currentUser = keycloak.tokenParsed.email;

  // TEMP VALUES FOR TESTING
  const assignee = currentUser;
  const refreshNotesForm = false;

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
        <TaskNotes
          formName="noteCerberus"
          displayForm={assignee === currentUser}
          // businessKey={targetData.taskSummaryBasedOnTIS?.parentBusinessKey?.businessKey}
          // processInstanceId={processInstanceId}
          refreshNotes={refreshNotesForm}
        />
      </div>

    </>
  );
};

export default TaskDetailsPage;
