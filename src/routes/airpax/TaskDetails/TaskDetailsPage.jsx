import { Tag } from '@ukhomeoffice/cop-react-components';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Config
import config from '../../../config';
import { TASK_STATUS_NEW,
  TASK_STATUS_TARGET_ISSUED,
  TASK_STATUS_COMPLETED,
  TASK_STATUS_IN_PROGRESS,
  MOVEMENT_VARIANT } from '../../../constants';

// Utils
import useAxiosInstance from '../../../utils/axiosInstance';
import { useKeycloak } from '../../../utils/keycloak';
import { findAndUpdateTaskVersionDifferencesAirPax } from '../../../utils/findAndUpdateTaskVersionDifferences';
import { formatTaskStatusToCamelCase } from '../../../utils/formatTaskStatus';
import { Renderers } from '../../../utils/Form';
import { escapeJSON } from '../../../utils/stringConversion';
import { TargetInformationUtil } from '../utils';

// Components/Pages
import ActivityLog from '../../../components/ActivityLog';
import ClaimUnclaimTask from '../../../components/ClaimUnclaimTask';
import LoadingSpinner from '../../../components/LoadingSpinner';
import TaskVersions from './TaskVersions';
import TaskNotes from '../../../components/TaskNotes';

// Styling
import Button from '../../../govuk/Button';
import RenderForm from '../../../components/RenderForm';
import TaskOutcomeMessage from './TaskOutcomeMessage';

// Styling
import '../__assets__/TaskDetailsPage.scss';

// JSON
import dismissTask from '../../../cop-forms/dismissTaskCerberus';

const TaskDetailsPage = () => {
  const { businessKey } = useParams();
  const keycloak = useKeycloak();
  const apiClient = useAxiosInstance(keycloak, config.taskApiUrl);
  const refDataClient = useAxiosInstance(keycloak, config.refdataApiUrl);
  const currentUser = keycloak.tokenParsed.email;
  const [assignee, setAssignee] = useState();
  const [formattedTaskStatus, setFormattedTaskStatus] = useState();
  const [taskData, setTaskData] = useState();
  const [refDataAirlineCodes, setRefDataAirlineCodes] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const [isSubmitted, setSubmitted] = useState();
  const [isDismissTaskFormOpen, setDismissTaskFormOpen] = useState();
  const [isIssueTargetFormOpen, setIssueTargetFormOpen] = useState();
  const [refreshNotesForm, setRefreshNotesForm] = useState(false);
  const [preFillData, setPrefillData] = useState({});

  const getPrefillData = async () => {
    let response;
    try {
      response = await apiClient.get(`/targeting-tasks/${businessKey}/information-sheets`);
      setPrefillData(TargetInformationUtil.transform(response.data));
    } catch (e) {
      setTaskData({});
    }
  };

  const getTaskData = async () => {
    let response;
    try {
      response = await apiClient.get(`/targeting-tasks/${businessKey}`);
      const { differencesCounts } = findAndUpdateTaskVersionDifferencesAirPax(response.data.versions);
      setTaskData({
        ...response.data, taskVersionDifferencesCounts: differencesCounts,
      });
    } catch (e) {
      setTaskData({});
    }
  };

  const getAirlineCodes = async () => {
    let response;
    try {
      response = await refDataClient.get('/v2/entities/carrierlist', {
        params: {
          mode: 'dataOnly',
        },
      });
      setRefDataAirlineCodes(response.data.data);
    } catch (e) {
      setRefDataAirlineCodes([]);
    }
  };

  useEffect(() => {
    if (taskData) {
      setAssignee(taskData.assignee);
      setFormattedTaskStatus(formatTaskStatusToCamelCase(taskData.status));
      setLoading(false);
    }
  }, [taskData, setAssignee, setLoading]);

  useEffect(() => {
    getTaskData();
    getPrefillData();
    getAirlineCodes();
  }, [businessKey]);

  useEffect(() => {
    getTaskData();
  }, [refreshNotesForm]);

  if (isLoading) {
    return <LoadingSpinner><br /><br /><br /></LoadingSpinner>;
  }

  return (
    <>
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
          {!isSubmitted && assignee === currentUser && formattedTaskStatus.toUpperCase() === TASK_STATUS_IN_PROGRESS.toUpperCase() && (
          <>
            <Button
              className="govuk-!-margin-right-1"
              onClick={() => {
                setIssueTargetFormOpen(true);
                setDismissTaskFormOpen(false);
              }}
            >
              Issue target
            </Button>
            <Button
              className="govuk-button--secondary govuk-!-margin-right-1"
            >
              Assessment complete
            </Button>
            <Button
              className="govuk-button--warning"
              onClick={() => {
                setDismissTaskFormOpen(true);
                setIssueTargetFormOpen(false);
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
              onCancel={() => setDismissTaskFormOpen()}
              form={dismissTask}
              renderer={Renderers.REACT}
            />
          )}
          {isDismissTaskFormOpen && isSubmitted && (
            <TaskOutcomeMessage
              message="Task has been dismissed"
              onFinish={() => setDismissTaskFormOpen()}
              setRefreshNotesForm={setRefreshNotesForm}
            />
          )}
          {isIssueTargetFormOpen && !isSubmitted && (
          <RenderForm
            formName="cerberus-airpax-target-information-sheet"
            preFillData={preFillData}
            onSubmit={
              async ({ data }) => {
                console.log('Issue Target Data JSON', data);
              }
            }
            renderer={Renderers.REACT}
          />
          )}
          {isIssueTargetFormOpen && isSubmitted && (
          <TaskOutcomeMessage
            message="Target created successfully"
            onFinish={() => setIssueTargetFormOpen()}
            setRefreshNotesForm={setRefreshNotesForm}
          />
          )}
          {!isDismissTaskFormOpen && !isIssueTargetFormOpen && taskData && (
            <TaskVersions
              taskVersions={taskData.versions}
              businessKey={businessKey}
              taskVersionDifferencesCounts={taskData.taskVersionDifferencesCounts}
              airlineCodes={refDataAirlineCodes}
            />
          )}
        </div>
        <div className="govuk-grid-column-one-third">
          {!isSubmitted && currentUser === assignee
            && (
            <TaskNotes
              noteVariant={MOVEMENT_VARIANT.AIRPAX}
              displayForm={assignee === currentUser}
              businessKey={businessKey}
              setRefreshNotesForm={() => setRefreshNotesForm(!refreshNotesForm)}
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
