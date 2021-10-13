import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
// Config
import config from '../../config';
// Utils
import useAxiosInstance from '../../utils/axiosInstance';
import { useKeycloak } from '../../utils/keycloak';
import { useFormSubmit } from '../../utils/formioSupport';
// Components / Pages
import RenderForm from '../../components/RenderForm';

// See Camunda docs for all operation types:
// https://docs.camunda.org/javadoc/camunda-bpm-platform/7.7/org/camunda/bpm/engine/history/UserOperationLogEntry.html
const OPERATION_TYPE_CLAIM = 'Claim';
const OPERATION_TYPE_ASSIGN = 'Assign';

const TaskNotes = ({ displayForm, businessKey, processInstanceId }) => {
  const keycloak = useKeycloak();
  const camundaClient = useAxiosInstance(keycloak, config.camundaApiUrl);
  const [activityLog, setActivityLog] = useState([]);

  const getNotes = async () => {
    const [
      variableInstanceResponse,
      operationsHistoryResponse,
      taskHistoryResponse,
    ] = await Promise.all([
      camundaClient.get(
        '/history/variable-instance',
        { params: { processInstanceIdIn: processInstanceId, deserializeValues: false } },
      ), // variableInstanceResponse
      camundaClient.get(
        '/history/user-operation',
        { params: { processInstanceId, deserializeValues: false } },
      ), // operationsHistoryResponse
      camundaClient.get(
        '/history/task',
        { params: { processInstanceId, deserializeValues: false } },
      ), // taskHistoryResponse
    ]);

    /*
      * ** ACTIVITY LOG & NOTES
      * There are three places that activity/notes can be logged in
      * history/variable-instance (parsedNotes) including notes entered via the notes form,
      * history/user-operation (parsedOperationsHistory),
      * history/task (parsedTaskHistory)
    */
    const parsedNotes = JSON.parse(variableInstanceResponse.data.find((processVar) => {
      return processVar.name === 'notes';
    }).value).map((note) => ({
      id: uuidv4(),
      date: dayjs(note.timeStamp).format(),
      user: note.userId,
      note: note.note,
    }));

    const parsedOperationsHistory = operationsHistoryResponse.data.map((operation) => {
      const getNote = () => {
        if ([OPERATION_TYPE_CLAIM, OPERATION_TYPE_ASSIGN].includes(operation.operationType)) {
          return operation.newValue ? 'User has claimed the task' : 'User has unclaimed the task';
        }
        return `Property ${operation.property} changed from ${operation.orgValue || 'none'} to ${operation.newValue || 'none'}`;
      };
      return {
        id: uuidv4(),
        date: dayjs(operation.timestamp).format(),
        user: operation.userId,
        note: getNote(operation),
      };
    });

    const parsedTaskHistory = taskHistoryResponse.data.map((historyLog) => ({
      id: uuidv4(),
      date: dayjs(historyLog.startTime).format(),
      user: historyLog.assignee,
      note: historyLog.name,
    }));

    setActivityLog([
      ...parsedOperationsHistory,
      ...parsedTaskHistory,
      ...parsedNotes,
    ].sort((a, b) => -a.date.localeCompare(b.date)));
  };

  const TaskNotesForm = ({ ...props }) => {
    const submitForm = useFormSubmit();
    return (
      <RenderForm
        onSubmit={
        async (data, form) => {
          await submitForm(
            '/process-definition/key/noteSubmissionWrapper/submit-form',
            businessKey,
            form,
            { ...data.data, processInstanceId },
            'noteCerberus',
          );
          getNotes();
        }
      }
        {...props}
      />
    );
  };

  useEffect(() => {
    getNotes();
  }, []);

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
