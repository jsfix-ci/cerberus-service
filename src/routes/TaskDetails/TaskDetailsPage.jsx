import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import qs from 'qs';
import { v4 as uuidv4 } from 'uuid';
// Config
import { FORM_NAME_TARGET_INFORMATION_SHEET, TASK_STATUS_NEW } from '../../constants';
import config from '../../config';
// Utils
import useAxiosInstance from '../../utils/axiosInstance';
import { useKeycloak } from '../../utils/keycloak';
import { useFormSubmit } from '../../utils/formioSupport';
// Components/Pages
import ClaimButton from '../../components/ClaimTaskButton';
import RenderForm from '../../components/RenderForm';
import LoadingSpinner from '../../forms/LoadingSpinner';
import TaskSummary from './TaskSummary';
import TaskVersions from './TaskVersions';
// Styling
import Button from '../../govuk/Button';
import ErrorSummary from '../../govuk/ErrorSummary';
import Panel from '../../govuk/Panel';
import '../__assets__/TaskDetailsPage.scss';

// See Camunda docs for all operation types:
// https://docs.camunda.org/javadoc/camunda-bpm-platform/7.7/org/camunda/bpm/engine/history/UserOperationLogEntry.html
const OPERATION_TYPE_CLAIM = 'Claim';
const OPERATION_TYPE_ASSIGN = 'Assign';

const TaskManagementForm = ({ onCancel, taskId, processInstanceData, actionTarget, ...props }) => {
  const submitForm = useFormSubmit();
  return (
    <RenderForm
      onCancel={() => onCancel(false)}
      preFillData={processInstanceData}
      onSubmit={async (data, form) => {
        await submitForm(
          `/task/${taskId}/submit-form`,
          data.data.businessKey,
          form,
          { ...data.data, actionTarget },
          FORM_NAME_TARGET_INFORMATION_SHEET,
        );
      }}
      {...props}
    />
  );
};

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

const TaskDetailsPage = () => {
  const { businessKey } = useParams();
  const keycloak = useKeycloak();
  const camundaClient = useAxiosInstance(keycloak, config.camundaApiUrl);
  const currentUser = keycloak.tokenParsed.email;
  const source = axios.CancelToken.source();

  const [activityLog, setActivityLog] = useState([]);
  const [assignee, setAssignee] = useState();
  const [error, setError] = useState(null);
  const [processInstanceId, setProcessInstanceId] = useState();
  const [processInstanceData, setProcessInstanceData] = useState({});
  const [targetStatus, setTargetStatus] = useState();
  const [targetData, setTargetData] = useState([]);
  const [warning, setWarning] = useState();

  const [isCompleteFormOpen, setCompleteFormOpen] = useState();
  const [isDismissFormOpen, setDismissFormOpen] = useState();
  const [isIssueTargetFormOpen, setIssueTargetFormOpen] = useState();
  const [isLoading, setLoading] = useState(true);

  const loadTask = async () => {
    try {
      /*
        * Using just the /history/process-instance endpoint here would work however
        * in time, this would result in a slower response as the history table is a
        * super set of the process-instance table. As a result, an api call is made to
        * the subset first to check if there are in flight process instances with the
        * given business key (which would be New, In Progress and Target Issued targets).
        * If this returns an empty array, there are no in flight processes, therefore it
        * is a finished process instance and requires a history/process-instance call
        */
      const decodedBusinessKey = decodeURIComponent(businessKey);
      let processInstanceResponse = await camundaClient.get(
        '/process-instance',
        {
          params: {
            businessKey: decodedBusinessKey,
            processDefinitionKeyNotIn: 'raiseMovement,noteSubmissionWrapper',
          },
        },
      );
      if (processInstanceResponse.data.length < 1) {
        processInstanceResponse = await camundaClient.get(
          '/history/process-instance',
          {
            params: {
              processInstanceBusinessKey: decodedBusinessKey,
              processDefinitionKeyNotIn: 'raiseMovement,noteSubmissionWrapper',
            },
          },
        );
      }
      const { data: [processInstance] } = processInstanceResponse;

      const [
        taskResponse,
        variableInstanceResponse,
        operationsHistoryResponse,
        taskHistoryResponse,
      ] = await Promise.all([
        camundaClient.get(
          '/task',
          { params: { processInstanceId: processInstance.id } },
        ), // taskResponse
        camundaClient.get(
          '/history/variable-instance',
          { params: { processInstanceIdIn: processInstance.id, deserializeValues: false } },
        ), // variableInstanceResponse
        camundaClient.get(
          '/history/user-operation',
          { params: { processInstanceId: processInstance.id, deserializeValues: false } },
        ), // operationsHistoryResponse
        camundaClient.get(
          '/history/task',
          { params: { processInstanceId: processInstance.id, deserializeValues: false } },
        ), // taskHistoryResponse
      ]);

      /*
        * ** TASK STATUS AND ASSIGNEE
        * There are various actions a user can take on a target
        * based on it's processState and it's assignee
        * We set these here so we can then use them to determine
        * whether to show the action buttons, the claim/unclaim/assigned text/buttons
        * and the notes form
        */
      const processState = (variableInstanceResponse.data.find((processVar) => {
        return processVar.name === 'processState';
      }));
      setProcessInstanceId(processInstance.id);
      setTargetStatus(processState?.value);
      setAssignee(taskResponse?.data[0]?.assignee);

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

      /*
        * ** TARGET DATA
        * This takes the objects of type JSON from the /history/variable-instance data
        * and collates them into an object of objects
        * so we can map/use them as they are the core information about the target
        */
      const parsedTaskVariables = variableInstanceResponse.data
        .filter((t) => t.type === 'Json')
        .reduce((acc, camundaVar) => {
          acc[camundaVar.name] = JSON.parse(camundaVar.value);
          return acc;
        }, {});

      setProcessInstanceData(taskResponse.data.length === 0 ? {} : taskResponse.data[0]);
      setTargetData([{
        ...parsedTaskVariables,
      }]);
    } catch (e) {
      setError(e.response?.status === 404 ? "Task doesn't exist." : e.message);
      setTargetData([]);
    } finally {
      setLoading(false);
    }
  };

  const TaskCompletedSuccessMessage = ({ message }) => {
    return (
      <>
        <Panel title={message} />
        <p className="govuk-body">We have sent your request to the relevant team.</p>
        <h2 className="govuk-heading-m">What happens next</h2>
        <p className="govuk-body">The task is now paused pending a response.</p>
        <Button
          className="govuk-button"
          onClick={() => {
            setIssueTargetFormOpen(false);
            setCompleteFormOpen(false);
            setDismissFormOpen(false);
          }}
        >
          Finish
        </Button>
      </>
    );
  };

  const TaskAssignedWarning = () => {
    const assignedState = qs.parse(location.search, { ignoreQueryPrefix: true });
    if (assignedState.alreadyAssigned === 't') {
      setWarning(true);
      loadTask();
    } else {
      setWarning(false);
    }
  };

  useEffect(() => {
    setWarning(false);
    TaskAssignedWarning();
    loadTask();
    return () => {
      source.cancel('Cancelling request');
    };
  }, []);

  if (isLoading) {
    return <LoadingSpinner><br /><br /><br /></LoadingSpinner>;
  }

  /*
   * TaskListPage and TaskDetailsPage both use the
   * ClaimButton logic to display claim/unclaim button
   * And to display who the task is assigned to
   * if it's already assigned (ie assignee !== currentUser)
   * TaskDetaisPage needs extra text in the two scenarios
   * listed below
  */
  const getAssignee = () => {
    if (!assignee) {
      return 'Unassigned ';
    }
    if (assignee === currentUser) {
      return 'Assigned to you ';
    }
  };

  return (
    <>
      {error && <ErrorSummary title={error} />}
      {warning && (
        <div className="govuk-warning-text">
          <span className="govuk-warning-text__icon" aria-hidden="true">!</span>
          <strong className="govuk-warning-text__text">
            <span className="govuk-warning-text__assistive">Warning</span>
            {`Task already assigned to ${assignee}`}
          </strong>
        </div>
      )}

      {targetData.length > 0 && (
        <>
          <div className="govuk-grid-row govuk-!-padding-bottom-9">
            <div className="govuk-grid-column-one-half">
              <span className="govuk-caption-xl">{businessKey}</span>
              <h1 className="govuk-heading-xl govuk-!-margin-bottom-0">Task details</h1>
              {targetStatus.toUpperCase() === TASK_STATUS_NEW.toUpperCase() && (
                <p className="govuk-body">
                  {getAssignee()}
                  <ClaimButton
                    assignee={assignee}
                    taskId={processInstanceData.id}
                    setError={setError}
                    businessKey={businessKey}
                    TaskAssignedWarning={() => TaskAssignedWarning()}
                  />
                </p>
              )}
            </div>
            <div className="govuk-grid-column-one-half task-actions--buttons">
              {assignee === currentUser && targetStatus.toUpperCase() === TASK_STATUS_NEW.toUpperCase() && processInstanceData.taskDefinitionKey === 'developTarget' && (
                <>
                  <Button
                    className="govuk-!-margin-right-1"
                    onClick={() => {
                      setIssueTargetFormOpen(true);
                      setCompleteFormOpen(false);
                      setDismissFormOpen(false);
                    }}
                  >
                    Issue target
                  </Button>
                  <Button
                    className="govuk-button--secondary govuk-!-margin-right-1"
                    onClick={() => {
                      setIssueTargetFormOpen(false);
                      setCompleteFormOpen(true);
                      setDismissFormOpen(false);
                    }}
                  >
                    Assessment complete
                  </Button>
                  <Button
                    className="govuk-button--warning"
                    onClick={() => {
                      setIssueTargetFormOpen(false);
                      setCompleteFormOpen(false);
                      setDismissFormOpen(true);
                    }}
                  >
                    Dismiss
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="govuk-grid-row">
            <div className="govuk-grid-column-two-thirds">
              <TaskSummary taskSummaryData={targetData[0].taskSummaryBasedOnTIS} />
              {isCompleteFormOpen && (
                <TaskManagementForm
                  formName="assessmentComplete"
                  onCancel={() => setCompleteFormOpen(false)}
                  taskId={processInstanceData.id}
                  actionTarget={false}
                >
                  <TaskCompletedSuccessMessage message="Task has been completed" />
                </TaskManagementForm>
              )}
              {isDismissFormOpen && (
                <TaskManagementForm
                  formName="dismissTarget"
                  onCancel={() => setDismissFormOpen(false)}
                  taskId={processInstanceData.id}
                  actionTarget={false}
                >
                  <TaskCompletedSuccessMessage message="Task has been dismissed" />
                </TaskManagementForm>
              )}
              {isIssueTargetFormOpen && (
                <>
                  <div className="govuk-warning-text">
                    <span className="govuk-warning-text__icon" aria-hidden="true">!</span>
                    <strong className="govuk-warning-text__text">
                      <span className="govuk-warning-text__assistive">Warning</span>
                      Check the details before issuing target
                    </strong>
                  </div>
                  <TaskManagementForm
                    formName="targetInformationSheet"
                    onCancel={() => setIssueTargetFormOpen(false)}
                    taskId={processInstanceData.id}
                    processInstanceData={targetData[0].targetInformationSheet}
                    actionTarget
                  >
                    <TaskCompletedSuccessMessage message="Target created successfully" />
                  </TaskManagementForm>
                </>
              )}
              {!isCompleteFormOpen && !isDismissFormOpen && !isIssueTargetFormOpen && (
                <TaskVersions taskVersions={targetData[0].taskDetails} businessKey={targetData[0].taskSummaryBasedOnTIS?.parentBusinessKey?.businessKey} />
              )}
            </div>

            <div className="govuk-grid-column-one-third">
              {assignee === currentUser && (
                <TaskNotesForm
                  formName="noteCerberus"
                  businessKey={targetData[0].taskSummaryBasedOnTIS?.parentBusinessKey?.businessKey}
                  processInstanceId={processInstanceId}
                />
              )}

              <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible" />

              <h3 className="govuk-heading-m">Activity</h3>

              {activityLog.map((activity) => (
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
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default TaskDetailsPage;
