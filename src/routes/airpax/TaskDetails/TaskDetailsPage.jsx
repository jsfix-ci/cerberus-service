import { Button, Tag } from '@ukhomeoffice/cop-react-components';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// Config
import config from '../../../config';
import { TASK_STATUS_NEW,
  TASK_STATUS_TARGET_ISSUED,
  TASK_STATUS_COMPLETED,
  TASK_STATUS_IN_PROGRESS,
  MOVEMENT_VARIANT,
  FORM_MESSAGES }
from '../../../constants';

import { ApplicationContext } from '../../../context/ApplicationContext';

// Utils
import useAxiosInstance from '../../../utils/axiosInstance';
import { useKeycloak } from '../../../utils/keycloak';
import { findAndUpdateTaskVersionDifferencesAirPax } from '../../../utils/findAndUpdateTaskVersionDifferences';
import { formatTaskStatusToCamelCase } from '../../../utils/formatTaskStatus';
import { Renderers } from '../../../utils/Form';
import { escapeJSON } from '../../../utils/stringConversion';
import { TargetInformationUtil } from '../../../utils';

// Components/Pages
import ActivityLog from '../../../components/ActivityLog';
import ClaimUnclaimTask from '../../../components/ClaimUnclaimTask';
import ErrorSummary from '../../../govuk/ErrorSummary';
import LoadingSpinner from '../../../components/LoadingSpinner';
import TaskVersions from './TaskVersions';
import TaskNotes from '../../../components/TaskNotes';
import RenderForm from '../../../components/RenderForm';
import TaskOutcomeMessage from './TaskOutcomeMessage';

// Styling
import '../__assets__/TaskDetailsPage.scss';

// JSON
import airpaxTis from '../../../cop-forms/airpaxTisCerberus';
import dismissTask from '../../../cop-forms/dismissTaskCerberus';
import completeTask from '../../../cop-forms/completeTaskCerberus';

const TaskDetailsPage = () => {
  const { businessKey } = useParams();
  const keycloak = useKeycloak();
  const source = axios.CancelToken.source();
  const apiClient = useAxiosInstance(keycloak, config.taskApiUrl);
  const { airPaxRefDataMode, airPaxTisCache, setAirpaxTisCache } = useContext(ApplicationContext);
  const currentUser = keycloak.tokenParsed.email;
  const [error, setError] = useState(null);
  const [assignee, setAssignee] = useState();
  const [formattedTaskStatus, setFormattedTaskStatus] = useState();
  const [taskData, setTaskData] = useState();
  const [isLoading, setLoading] = useState(true);
  const [isSubmitted, setSubmitted] = useState();
  const [isCompleteFormOpen, setCompleteFormOpen] = useState();
  const [isDismissTaskFormOpen, setDismissTaskFormOpen] = useState();
  const [isIssueTargetFormOpen, setIssueTargetFormOpen] = useState();
  const [refreshNotesForm, setRefreshNotesForm] = useState(false);
  const [showActionButtons, setShowActionButtons] = useState(true);

  const cancelAxiosRequests = () => {
    source.cancel('Cancelling request');
  };

  const getPrefillData = async () => {
    try {
      const response = await apiClient.get(`/targeting-tasks/${businessKey}/information-sheets`);
      setAirpaxTisCache(TargetInformationUtil.prefillPayload(response.data));
    } catch (e) {
      setError(e.message);
      setAirpaxTisCache({});
    }
  };

  const getTaskData = async () => {
    try {
      const response = await apiClient.get(`/targeting-tasks/${businessKey}`);
      const { differencesCounts } = findAndUpdateTaskVersionDifferencesAirPax(response.data.versions);
      setTaskData({
        ...response.data, taskVersionDifferencesCounts: differencesCounts,
      });
    } catch (e) {
      setError(e.message);
      setTaskData({});
    }
  };

  useEffect(() => {
    if (taskData && (!assignee || !formattedTaskStatus)) {
      setAssignee(taskData.assignee);
      setFormattedTaskStatus(formatTaskStatusToCamelCase(taskData.status));
      setLoading(false);
    }
  }, [taskData, setAssignee, setLoading]);

  useEffect(() => {
    getTaskData();
    if (airPaxTisCache()?.id !== businessKey) {
      getPrefillData();
    }
    return () => {
      cancelAxiosRequests();
    };
  }, [businessKey, refreshNotesForm]);

  const onCancelConfirmation = (onCancel) => {
    // eslint-disable-next-line no-alert
    if (confirm(FORM_MESSAGES.ON_CANCELLATION)) {
      onCancel();
    }
  };

  if (isLoading) {
    return <LoadingSpinner><br /><br /><br /></LoadingSpinner>;
  }

  return (
    <>
      {error && (
      <ErrorSummary
        title="There is a problem"
        errorList={[
          { children: error },
        ]}
      />
      )}
      <div className="govuk-grid-row govuk-task-detail-header govuk-!-padding-bottom-9">
        <div className="govuk-grid-column-one-half">
          <span className="govuk-caption-xl">{businessKey}</span>
          <h3 className="govuk-heading-xl govuk-!-margin-bottom-0">Overview</h3>
          {!isSubmitted && (formattedTaskStatus !== TASK_STATUS_TARGET_ISSUED && formattedTaskStatus !== TASK_STATUS_COMPLETED)
            && (
              <>
                {formattedTaskStatus.toUpperCase() === TASK_STATUS_NEW.toUpperCase()
                && <Tag className="govuk-tag govuk-tag--newTarget" text={TASK_STATUS_NEW} />}
                <p className="govuk-body">
                  <ClaimUnclaimTask
                    assignee={taskData.assignee}
                    currentUser={currentUser}
                    businessKey={businessKey}
                    source={`/airpax/tasks/${businessKey}`}
                    buttonType="textLink"
                  />
                </p>
              </>
            )}
        </div>
        <div className="govuk-grid-column-one-half task-actions--buttons">
          {!isSubmitted && assignee === currentUser
          && formattedTaskStatus.toUpperCase() === TASK_STATUS_IN_PROGRESS.toUpperCase() && (
          <>
            {showActionButtons && (
            <>
              <Button
                className="govuk-!-margin-right-1"
                onClick={() => {
                  setIssueTargetFormOpen(true);
                  setDismissTaskFormOpen(false);
                  setCompleteFormOpen(false);
                  setShowActionButtons(false);
                }}
              >
                Issue target
              </Button>
              <Button
                className="govuk-button--secondary govuk-!-margin-right-1"
                onClick={() => {
                  setCompleteFormOpen(true);
                  setDismissTaskFormOpen(false);
                  setIssueTargetFormOpen(false);
                  setShowActionButtons(false);
                }}
              >
                Assessment complete
              </Button>
              <Button
                className="govuk-button--warning"
                onClick={() => {
                  setDismissTaskFormOpen(true);
                  setCompleteFormOpen(false);
                  setIssueTargetFormOpen(false);
                  setShowActionButtons(false);
                }}
              >
                Dismiss
              </Button>
            </>
            )}
          </>
          )}
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          {isIssueTargetFormOpen && !isSubmitted && (
          <RenderForm
            cacheTisFormData
            form={airpaxTis}
            preFillData={airPaxTisCache()}
            onSubmit={
              async ({ data }) => {
                try {
                  await apiClient.post('/targets',
                    TargetInformationUtil.submissionPayload(taskData, data, keycloak, airPaxRefDataMode()));
                  data?.meta?.documents.forEach((document) => delete document.file);
                  setAirpaxTisCache({});
                  setSubmitted(true);
                  if (error) {
                    setError(null);
                  }
                } catch (e) {
                  setAirpaxTisCache(TargetInformationUtil.convertToPrefill(data));
                  setError(e.response?.status === 404 ? "Task doesn't exist." : e.message);
                }
              }
            }
            onCancel={() => onCancelConfirmation(() => {
              setShowActionButtons(true);
              setIssueTargetFormOpen();
            })}
            renderer={Renderers.REACT}
            setError={setError}
          />
          )}
          {isIssueTargetFormOpen && isSubmitted && (
          <TaskOutcomeMessage
            message="Target created successfully"
            onFinish={() => setIssueTargetFormOpen()}
            setRefreshNotesForm={setRefreshNotesForm}
          />
          )}
          {isCompleteFormOpen && !isSubmitted && (
          <RenderForm
            preFillData={{ businessKey }}
            onSubmit={
              async ({ data }) => {
                await apiClient.post(`/targeting-tasks/${businessKey}/completions`, {
                  reason: data.reasonForCompletion,
                  otherReasonDetail: data.otherReasonForCompletion,
                  note: escapeJSON(data.addANote),
                  userId: data.form.submittedBy,
                });
                setSubmitted(true);
              }
            }
            onCancel={() => onCancelConfirmation(() => {
              setShowActionButtons(true);
              setCompleteFormOpen();
            })}
            form={completeTask}
            renderer={Renderers.REACT}
            setError={setError}
          />
          )}
          {isCompleteFormOpen && isSubmitted && (
          <TaskOutcomeMessage
            message="Task has been completed"
            onFinish={() => setCompleteFormOpen()}
            setRefreshNotesForm={setRefreshNotesForm}
          />
          )}
          {isDismissTaskFormOpen && !isSubmitted && (
            <RenderForm
              preFillData={{ businessKey }}
              onSubmit={
                async ({ data }) => {
                  await apiClient.post(`/targeting-tasks/${businessKey}/dismissals`, {
                    reason: data.reasonForDismissing,
                    otherReasonDetail: data.otherReasonToDismiss,
                    note: escapeJSON(data.addANote),
                    userId: data.form.submittedBy,
                  });
                  setSubmitted(true);
                }
              }
              onCancel={() => onCancelConfirmation(() => {
                setShowActionButtons(true);
                setDismissTaskFormOpen();
              })}
              form={dismissTask}
              renderer={Renderers.REACT}
              setError={setError}
            />
          )}
          {isDismissTaskFormOpen && isSubmitted && (
            <TaskOutcomeMessage
              message="Task has been dismissed"
              onFinish={() => setDismissTaskFormOpen()}
              setRefreshNotesForm={setRefreshNotesForm}
            />
          )}
          {!isIssueTargetFormOpen && !isCompleteFormOpen && !isDismissTaskFormOpen && taskData && (
            <TaskVersions
              taskVersions={taskData.versions}
              businessKey={businessKey}
              taskVersionDifferencesCounts={taskData.taskVersionDifferencesCounts}
            />
          )}
        </div>
        <div className="govuk-grid-column-one-third">
          {!isSubmitted && currentUser === assignee
            && (
            <TaskNotes
              noteVariant={MOVEMENT_VARIANT.AIRPAX}
              displayForm={assignee === currentUser
                && !isIssueTargetFormOpen && !isCompleteFormOpen && !isDismissTaskFormOpen}
              businessKey={businessKey}
              setRefreshNotesForm={() => setRefreshNotesForm(!refreshNotesForm)}
              setError={setError}
            />
            )}
          <ActivityLog
            activityLog={taskData?.notes}
          />
        </div>
      </div>
    </>
  );
};

export default TaskDetailsPage;
