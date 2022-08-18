import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
// Config
import config from '../config';
// Utils
import { FORM_NAMES, MOVEMENT_VARIANT } from '../constants';
import useAxiosInstance from '../utils/axiosInstance';
import { useFormSubmit } from '../utils/formioSupport';
import hyperlinkify from '../utils/hyperlinkify';
import { Renderers } from '../utils/Form';
import { useKeycloak } from '../utils/keycloak';
import { escapeJSON } from '../utils/stringConversion';

// Components / Pages
import RenderForm from './RenderForm';
// JSON
import noteCerberus from '../cop-forms/noteCerberus';

// See Camunda docs for all operation types:
// https://docs.camunda.org/javadoc/camunda-bpm-platform/7.7/org/camunda/bpm/engine/history/UserOperationLogEntry.html
const OPERATION_TYPE_CLAIM = 'Claim';
const OPERATION_TYPE_ASSIGN = 'Assign';

const RoRoTaskNotes = ({ keycloak, displayForm, businessKey, processInstanceId, refreshNotes, setError }) => {
  const camundaClient = useAxiosInstance(keycloak, config.camundaApiUrl);
  const [activityLog, setActivityLog] = useState([]);
  const submitForm = useFormSubmit();

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
        return null;
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

  useEffect(() => {
    getNotes();
  }, [processInstanceId, refreshNotes]);

  return (
    <>
      {displayForm && (
        <RenderForm
          preFillData={{ businessKey }}
          onSubmit={
            async (data, form) => {
              data.data.note = escapeJSON(data.data.note);
              await submitForm(
                '/process-definition/key/noteSubmissionWrapper/submit-form',
                businessKey,
                form,
                { ...data.data, processInstanceId },
                FORM_NAMES.NOTE_CERBERUS,
              );
              getNotes();
            }
          }
          form={noteCerberus}
          renderer={Renderers.REACT}
          setError={setError}
        />
      )}

      <h3 className="govuk-heading-m task-details-notes-heading">Task activity</h3>

      {activityLog.map((activity) => {
        if (activity.note !== null) {
          return (
            <div key={activity.id}>
              <div className="activity-body-container">
                <p className="govuk-body-s govuk-!-margin-bottom-2">
                  <span className="govuk-!-font-weight-bold">
                    {new Date(activity.date).toLocaleDateString()}
                  </span>
                &nbsp;at <span className="govuk-!-font-weight-bold">{new Date(activity.date).toLocaleTimeString()}</span>
                  {activity.user && <>&nbsp;by <a href={`mailto:${activity.user}`}>{activity.user}</a></>}
                </p>
                <p className="govuk-body">{hyperlinkify(activity.note)}</p>
              </div>
              <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible" />
            </div>
          );
        }
      })}
    </>
  );
};

const AirpaxTaskNotes = ({ keycloak, displayForm, businessKey, setRefreshNotesForm, setError }) => {
  const apiClient = useAxiosInstance(keycloak, config.taskApiUrl);
  return (
    <>
      {displayForm && (
        <RenderForm
          preFillData={{ businessKey }}
          onSubmit={
            async (data) => {
              data.data.note = escapeJSON(data.data.note);
              await apiClient.post(`/targeting-tasks/${businessKey}/notes`, [{
                content: data.data.note,
                userId: data.data.form.submittedBy,
              }]);
              setRefreshNotesForm();
            }
          }
          form={noteCerberus}
          renderer={Renderers.REACT}
          setError={setError}
        />
      )}
    </>
  );
};

const TaskNotes = ({ noteVariant,
  displayForm,
  businessKey,
  processInstanceId,
  refreshNotes,
  setRefreshNotesForm,
  setError }) => {
  const keycloak = useKeycloak();

  if (noteVariant === MOVEMENT_VARIANT.RORO) {
    return (
      <RoRoTaskNotes
        setError={setError}
        keycloak={keycloak}
        displayForm={displayForm}
        businessKey={businessKey}
        processInstanceId={processInstanceId}
        refreshNotes={refreshNotes}
      />
    );
  }

  return (
    <AirpaxTaskNotes
      setError={setError}
      keycloak={keycloak}
      displayForm={displayForm}
      businessKey={businessKey}
      setRefreshNotesForm={setRefreshNotesForm}
    />
  );
};

export default TaskNotes;
