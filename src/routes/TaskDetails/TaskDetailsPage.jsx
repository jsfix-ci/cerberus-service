import { Button, Tag } from '@ukhomeoffice/cop-react-components';
import { useLocation, useParams } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';

import axios from 'axios';

// Config
import config from '../../utils/config';
import { FORM_MESSAGES,
  MODE,
  TASK_STATUS } from '../../utils/constants';

import { ApplicationContext } from '../../context/ApplicationContext';

// Utils
import { useAxiosInstance } from '../../utils/Axios/axiosInstance';
import { useKeycloak } from '../../context/Keycloak';
import { findAndUpdateTaskVersionDifferencesAirPax } from '../../utils/TaskVersion/taskVersionUtil';
import { Renderers } from '../../utils/Form/ReactForm';
import { escapeString } from '../../utils/String/stringUtil';
import { StringUtil, TargetInformationUtil } from '../../utils';

// Components/Pages
import ActivityLog from '../../components/ActivityLog/ActivityLog';
import ClaimUnclaimTask from '../../components/Buttons/ClaimUnclaimTask';
import ErrorSummary from '../../components/ErrorSummary/ErrorSummary';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import TaskVersions from './TaskVersions';
import TaskNotes from '../../components/TaskNotes/TaskNotes';
import RenderForm from '../../components/RenderForm/RenderForm';
import TaskOutcomeMessage from './TaskOutcomeMessage';

// Styling
import './TaskDetailsPage.scss';

// JSON
import airpaxTis from '../../forms/airpaxTisCerberus';
import dismissTask from '../../forms/dismissTaskCerberus';
import completeTask from '../../forms/completeTaskCerberus';

const TaskDetailsPage = () => {
  const { businessKey } = useParams();
  const keycloak = useKeycloak();
  const location = useLocation();
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

  const getSourcePathURL = () => {
    const regex = new RegExp(/(.*)\/.*/);
    return location.pathname.match(regex)[1];
  };

  const cancelAxiosRequests = () => {
    source.cancel('Cancelling request');
  };

  const onCancelConfirmation = (onCancel) => {
    // eslint-disable-next-line no-alert
    if (confirm(FORM_MESSAGES.ON_CANCELLATION)) {
      onCancel();
    }
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
      setTaskData(null);
      setError(e.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (taskData && (!assignee || !formattedTaskStatus)) {
      setAssignee(taskData.assignee);
      setFormattedTaskStatus(StringUtil.format.camelCase(taskData.status));
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
      {taskData && (
      <>
        <div className="govuk-grid-row govuk-task-detail-header govuk-!-padding-bottom-9">
          <div className="govuk-grid-column-one-half">
            <span className="govuk-caption-xl">{businessKey}</span>
            <h3 className="govuk-heading-xl govuk-!-margin-bottom-0">Overview</h3>
            {!isSubmitted && (formattedTaskStatus !== TASK_STATUS.ISSUED && formattedTaskStatus !== TASK_STATUS.COMPLETE)
              && (
                <>
                  {formattedTaskStatus.toUpperCase() === TASK_STATUS.NEW.toUpperCase()
                    && <Tag className="govuk-tag govuk-tag--newTarget" text={TASK_STATUS.NEW} />}
                  <p className="govuk-body">
                    <ClaimUnclaimTask
                      assignee={taskData.assignee}
                      currentUser={currentUser}
                      businessKey={businessKey}
                      source={getSourcePathURL()}
                      buttonType="textLink"
                    />
                  </p>
                </>
              )}
          </div>
          <div className="govuk-grid-column-one-half task-actions--buttons">
            {!isSubmitted && assignee === currentUser
              && formattedTaskStatus.toUpperCase() === TASK_STATUS.IN_PROGRESS.toUpperCase() && (
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
                        note: escapeString(data.addANote),
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
                        note: escapeString(data.addANote),
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
                    noteVariant={MODE.AIRPAX}
                    displayForm={assignee === currentUser
                      && !isIssueTargetFormOpen && !isCompleteFormOpen && !isDismissTaskFormOpen
                      && TASK_STATUS.IN_PROGRESS === formattedTaskStatus}
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
      )}
    </>
  );
};

export default TaskDetailsPage;
