import { Button, Tag } from '@ukhomeoffice/cop-react-components';
import { useLocation, useParams } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';

import axios from 'axios';

// Config
import config from '../../utils/config';
import { FORM_MESSAGES, TASK_STATUS } from '../../utils/constants';

import { ApplicationContext } from '../../context/ApplicationContext';
import { ViewContext } from '../../context/ViewContext';

// Utils
import { useAxiosInstance } from '../../utils/Axios/axiosInstance';
import { useKeycloak } from '../../context/Keycloak';
import { findAndUpdateTaskVersionDifferencesAirPax } from '../../utils/TaskVersion/taskVersionUtil';
import { Renderers } from '../../utils/Form/ReactForm';
import { escapeString } from '../../utils/String/stringUtil';
import { CommonUtil, StringUtil, TargetInformationUtil } from '../../utils';

// Components/Pages
import ActivityLog from '../../components/ActivityLog/ActivityLog';
import ClaimUnclaimTask from '../../components/Buttons/ClaimUnclaimTask';
import ErrorSummary from '../../components/ErrorSummary/ErrorSummary';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import TaskVersions from './components/shared/TaskVersions';
import TaskNotes from '../../components/TaskNotes/TaskNotes';
import RenderForm from '../../components/RenderForm/RenderForm';
import TaskOutcomeMessage from './components/shared/TaskOutcomeMessage';

// Services
import AxiosRequests from '../../api/axiosRequests';

// Styling
import './TaskDetailsPage.scss';

// JSON (Forms)
import dismissTask from '../../forms/dismissTaskCerberus';
import completeTask from '../../forms/completeTaskCerberus';
import getTisForm from '../../utils/Form/ReactForm/getTisForm';
import { VIEW } from '../../utils/Common/commonUtil';

const TaskDetailsPage = () => {
  const { businessKey } = useParams();
  const keycloak = useKeycloak();
  const location = useLocation();
  const source = axios.CancelToken.source();
  const apiClient = useAxiosInstance(keycloak, config.taskApiUrl);
  const currentUser = keycloak.tokenParsed.email;
  const [error, setError] = useState(null);
  const [assignee, setAssignee] = useState(null);
  const [formattedTaskStatus, setFormattedTaskStatus] = useState(null);
  const [taskData, setTaskData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [isSubmitted, setSubmitted] = useState(false);
  const [isCompleteFormOpen, setCompleteFormOpen] = useState(false);
  const [isDismissTaskFormOpen, setDismissTaskFormOpen] = useState(false);
  const [isIssueTargetFormOpen, setIssueTargetFormOpen] = useState(false);
  const [refreshNotesForm, setRefreshNotesForm] = useState(false);
  const [showActionButtons, setShowActionButtons] = useState(true);
  const {
    airPaxRefDataMode,
    airPaxTisCache,
    setAirpaxTisCache,
  } = useContext(ApplicationContext);
  const {
    setView,
    getView,
  } = useContext(ViewContext);

  const onCancelConfirmation = (onCancel) => {
    // eslint-disable-next-line no-alert
    if (confirm(FORM_MESSAGES.ON_CANCELLATION)) {
      onCancel();
    }
  };

  const setActionButtons = (_issueTargetFormOpen, _dismissTaskFormOpen, _completeFormOpen, _showActionButtons) => {
    setIssueTargetFormOpen(_issueTargetFormOpen);
    setDismissTaskFormOpen(_dismissTaskFormOpen);
    setCompleteFormOpen(_completeFormOpen);
    setShowActionButtons(_showActionButtons);
  };

  const getPrefillData = async () => {
    try {
      const data = await AxiosRequests.informationSheet(apiClient, businessKey);
      setAirpaxTisCache(TargetInformationUtil.prefillPayload(data));
    } catch (e) {
      setError(e.message);
      setAirpaxTisCache({});
    }
  };

  const getTaskData = async () => {
    try {
      const data = await AxiosRequests.taskData(apiClient, businessKey);
      const { differencesCounts } = findAndUpdateTaskVersionDifferencesAirPax(data.versions);
      setTaskData({
        ...data,
        taskVersionDifferencesCounts: differencesCounts,
      });
    } catch (e) {
      setTaskData(null);
      setError(e.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    setView(CommonUtil.viewByPath(CommonUtil.taskListPath(location.pathname)));
  }, []);

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
      AxiosRequests.cancel(source);
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
                        source={CommonUtil.taskListPath(location.pathname)}
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
                        {/* TODO: Remove the conditional check below once the TIS form is complete */}
                        {getView() !== VIEW.RORO_V2 ? (
                          <Button
                            className="govuk-!-margin-right-1"
                            onClick={() => {
                              setActionButtons(true, false, false, false);
                            }}
                          >
                            Issue target
                          </Button>
                        ) : null}
                        <Button
                          className="govuk-button--secondary govuk-!-margin-right-1"
                          onClick={() => {
                            setActionButtons(false, false, true, false);
                          }}
                        >
                          Assessment complete
                        </Button>
                        <Button
                          className="govuk-button--warning"
                          onClick={() => {
                            setActionButtons(false, true, false, false);
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
                  form={getTisForm(getView())}
                  preFillData={airPaxTisCache()}
                  onSubmit={
                    async ({ data }) => {
                      try {
                        await AxiosRequests.submitTis(apiClient,
                          TargetInformationUtil.submissionPayload(taskData, data, keycloak, airPaxRefDataMode()));
                        data?.meta?.documents.forEach((document) => delete document.file);
                        setAirpaxTisCache({});
                        setSubmitted(true);
                        if (error) {
                          setError(null);
                        }
                      } catch (e) {
                        setAirpaxTisCache(TargetInformationUtil.convertToPrefill(data));
                        setError(e.response?.status === 404 ? 'Task doesn\'t exist.' : e.message);
                      }
                    }
                  }
                  onCancel={() => onCancelConfirmation(() => {
                    setShowActionButtons(true);
                    setIssueTargetFormOpen(false);
                  })}
                  renderer={Renderers.REACT}
                  setError={setError}
                />
              )}
              {isIssueTargetFormOpen && isSubmitted && (
                <TaskOutcomeMessage
                  message="Target created successfully"
                  onFinish={() => setIssueTargetFormOpen(false)}
                  setRefreshNotesForm={setRefreshNotesForm}
                />
              )}
              {isCompleteFormOpen && !isSubmitted && (
                <RenderForm
                  preFillData={{ businessKey }}
                  onSubmit={
                    async ({ data: {
                      addANote,
                      form,
                      otherReasonForCompletion,
                      reasonForCompletion,
                    } }) => {
                      await AxiosRequests.completeTask(apiClient, businessKey, {
                        reason: reasonForCompletion,
                        otherReasonDetail: otherReasonForCompletion,
                        note: escapeString(addANote),
                        userId: form.submittedBy,
                      });
                      setSubmitted(true);
                    }
                  }
                  onCancel={() => onCancelConfirmation(() => {
                    setShowActionButtons(true);
                    setCompleteFormOpen(false);
                  })}
                  form={completeTask}
                  renderer={Renderers.REACT}
                  setError={setError}
                />
              )}
              {isCompleteFormOpen && isSubmitted && (
                <TaskOutcomeMessage
                  message="Task has been completed"
                  onFinish={() => setCompleteFormOpen(false)}
                  setRefreshNotesForm={setRefreshNotesForm}
                />
              )}
              {isDismissTaskFormOpen && !isSubmitted && (
                <RenderForm
                  preFillData={{ businessKey }}
                  onSubmit={
                    async ({ data: {
                      addANote,
                      form,
                      otherReasonToDismiss,
                      reasonForDismissing,
                    } }) => {
                      await AxiosRequests.dismissTask(apiClient, businessKey, {
                        reason: reasonForDismissing,
                        otherReasonDetail: otherReasonToDismiss,
                        note: escapeString(addANote),
                        userId: form.submittedBy,
                      });
                      setSubmitted(true);
                    }
                  }
                  onCancel={() => onCancelConfirmation(() => {
                    setShowActionButtons(true);
                    setDismissTaskFormOpen(false);
                  })}
                  form={dismissTask}
                  renderer={Renderers.REACT}
                  setError={setError}
                />
              )}
              {isDismissTaskFormOpen && isSubmitted && (
                <TaskOutcomeMessage
                  message="Task has been dismissed"
                  onFinish={() => setDismissTaskFormOpen(false)}
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
