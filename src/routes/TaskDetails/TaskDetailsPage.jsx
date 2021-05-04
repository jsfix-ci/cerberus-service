import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';

import config from '../../config';
import { FORM_NAME_TARGET_INFORMATION_SHEET } from '../../constants';
import { useKeycloak } from '../../utils/keycloak';
import useAxiosInstance from '../../utils/axiosInstance';
import Button from '../../govuk/Button';
import LoadingSpinner from '../../forms/LoadingSpinner';
import ErrorSummary from '../../govuk/ErrorSummary';
import ClaimButton from '../../components/ClaimTaskButton';
import RenderForm from '../../components/RenderForm';
import Panel from '../../govuk/Panel';
import { useFormSubmit } from '../../utils/formioSupport';
import TaskSummary from './TaskSummary';

import '../__assets__/TaskDetailsPage.scss';
import TaskVersions from './TaskVersions';

// See Camunda docs for all operation types: https://docs.camunda.org/javadoc/camunda-bpm-platform/7.7/org/camunda/bpm/engine/history/UserOperationLogEntry.html
const OPERATION_TYPE_CLAIM = 'Claim';
const OPERATION_TYPE_ASSIGN = 'Assign';

const TaskManagementForm = ({ onCancel, taskId, taskData, actionTarget, ...props }) => {
  const submitForm = useFormSubmit();
  return (
    <RenderForm
      onCancel={() => onCancel(false)}
      preFillData={taskData}
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
  const { processInstanceId } = useParams();
  const [error, setError] = useState(null);
  const [taskVersions, setTaskVersions] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const keycloak = useKeycloak();
  const camundaClient = useAxiosInstance(keycloak, config.camundaApiUrl);
  const currentUser = keycloak.tokenParsed.email;
  const assignee = taskVersions?.[0]?.assignee;
  const currentUserIsOwner = assignee === currentUser;
  const [isCompleteFormOpen, setCompleteFormOpen] = useState();
  const [isDismissFormOpen, setDismissFormOpen] = useState();
  const [isIssueTargetFormOpen, setIssueTargetFormOpen] = useState();
  const source = axios.CancelToken.source();

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

  useEffect(() => {
    const loadTask = async () => {
      try {
        const [taskResponse, variableInstanceResponse, operationsHistoryResponse, taskHistoryResponse] = await Promise.all([
          camundaClient.get(
            '/task',
            { params: { processInstanceId } },
          ),
          camundaClient.get(
            '/history/variable-instance',
            { params: { processInstanceIdIn: processInstanceId, deserializeValues: false } },
          ),
          camundaClient.get(
            '/history/user-operation',
            { params: { processInstanceId, deserializeValues: false } },
          ),
          camundaClient.get(
            '/history/task',
            { params: { processInstanceId, deserializeValues: false } },
          ),
        ]);

        const parsedNotes = JSON.parse(variableInstanceResponse.data.find((processVar) => {
          return processVar.name === 'notes';
        }).value).map((note) => ({
          date: moment(note.timeStamp).format(),
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
            date: operation.timestamp,
            user: operation.userId,
            note: getNote(operation),
          };
        });
        const parsedTaskHistory = taskHistoryResponse.data.map((historyLog) => ({
          date: historyLog.startTime,
          user: historyLog.assignee,
          note: historyLog.name,
        }));
        setActivityLog([
          ...parsedOperationsHistory,
          ...parsedTaskHistory,
          ...parsedNotes,
        ].sort((a, b) => -a.date.localeCompare(b.date)));

        const parsedTaskVariables = variableInstanceResponse.data
          .filter((t) => t.type === 'Json')
          .reduce((acc, camundaVar) => {
            acc[camundaVar.name] = JSON.parse(camundaVar.value);
            return acc;
          }, {});
        setTaskVersions([{
          ...taskResponse.data[0],
          ...parsedTaskVariables,
        }]);
      } catch (e) {
        setError(e.response?.status === 404 ? "Task doesn't exist." : e.message);
        setTaskVersions([]);
      } finally {
        setLoading(false);
      }
    };

    loadTask();
    return () => {
      source.cancel('Cancelling request');
    };
  }, []);

  if (isLoading) {
    return <LoadingSpinner><br /><br /><br /></LoadingSpinner>;
  }

  const getAssignee = () => {
    if (!assignee) {
      return 'Unassigned';
    }
    if (currentUserIsOwner) {
      return 'Assigned to you';
    }
    return `Assigned to ${assignee}`;
  };
  const taskId = 'hello';

  return (
    <>
      {error && <ErrorSummary title={error} />}

      {taskVersions.length > 0 && (
        <>
          <div className="govuk-grid-row govuk-!-padding-bottom-9">
            <div className="govuk-grid-column-one-half">
              <span className="govuk-caption-xl">{taskVersions[0].taskSummary?.businessKey}</span>
              <h1 className="govuk-heading-xl govuk-!-margin-bottom-0">Task details</h1>
              <p className="govuk-body">
                {getAssignee()}
                <ClaimButton assignee={assignee} taskId={taskId} setError={setError} />
              </p>
            </div>

            <div className="govuk-grid-column-one-half task-actions--buttons">
              {currentUserIsOwner && (
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
              <TaskSummary taskSummaryData={taskVersions[0].taskSummary} />
              {isCompleteFormOpen && (
                <TaskManagementForm
                  formName="assessmentComplete"
                  onCancel={() => setCompleteFormOpen(false)}
                  taskId={taskVersions[0].id}
                  actionTarget={false}
                >
                  <TaskCompletedSuccessMessage message="Task has been completed" />
                </TaskManagementForm>
              )}
              {isDismissFormOpen && (
                <TaskManagementForm
                  formName="dismissTarget"
                  onCancel={() => setDismissFormOpen(false)}
                  taskId={taskVersions[0].id}
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
                    taskId={taskVersions[0].id}
                    taskData={taskVersions[0].targetInformationSheet}
                    actionTarget
                  >
                    <TaskCompletedSuccessMessage message="Target created successfully" />
                  </TaskManagementForm>
                </>
              )}
              {!isCompleteFormOpen && !isDismissFormOpen && !isIssueTargetFormOpen && (
                <TaskVersions taskVersions={taskVersions} />
              )}
            </div>

            <div className="govuk-grid-column-one-third">
              {currentUserIsOwner && (
                <TaskNotesForm
                  formName="noteCerberus"
                  businessKey={taskVersions[0].taskSummary?.businessKey}
                  processInstanceId={taskVersions.find((task) => !!task.processInstanceId).processInstanceId}
                />
              )}

              <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible" />

              <h3 className="govuk-heading-m">Activity</h3>

              {activityLog.map((activity) => (
                <React.Fragment key={activity.date}>
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
