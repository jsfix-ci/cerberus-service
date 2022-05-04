import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// Config
import config from '../../../config';
import { TASK_STATUS_TARGET_ISSUED, TASK_STATUS_COMPLETED } from '../../../constants';
// Utils
import useAxiosInstance from '../../../utils/axiosInstance';
import { useKeycloak } from '../../../utils/keycloak';
import { findAndUpdateTaskVersionDifferencesAirPax } from '../../../utils/findAndUpdateTaskVersionDifferences';
import { formatTaskStatusToCamelCase } from '../../../utils/formatTaskStatus';

// Components/Pages
import ActivityLog from '../../../components/ActivityLog';
import ClaimUnclaimTask from '../../../components/ClaimUnclaimTask';
import LoadingSpinner from '../../../components/LoadingSpinner';
import TaskVersions from './TaskVersions';

// Styling
import '../__assets__/TaskDetailsPage.scss';

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

  // TEMP VALUES FOR TESTING UNTIL API ACTIVE
  const tempData = {
    data: {
      // paste mock data here
    },
  };

  const getTaskData = async () => {
    let response;
    try {
      response = await apiClient.get(`/targeting-tasks/${businessKey}`);
      setTaskData(response.data);
    } catch {
      // until API is ready we set the temp data in the catch
      // this will be changed to the error handling
      response = tempData;

      // findAndUpdateTaskVersionDifferences is a mutable function
      const { differencesCounts } = findAndUpdateTaskVersionDifferencesAirPax(response.data.versions);
      setTaskData({
        ...response.data, taskVersionDifferencesCounts: differencesCounts,
      });
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
    getTaskData(businessKey);
    getAirlineCodes();
  }, [businessKey]);

  // TEMP NOTES FORM FOR TESTING
  const AddANoteForm = () => {
    return (
      <div>
        Add a new note
      </div>
    );
  };

  if (isLoading) {
    return <LoadingSpinner><br /><br /><br /></LoadingSpinner>;
  }

  return (
    <>
      <div className="govuk-grid-row govuk-task-detail-header govuk-!-padding-bottom-9">
        <div className="govuk-grid-column-one-half">
          <span className="govuk-caption-xl">{businessKey}</span>
          <h3 className="govuk-heading-xl govuk-!-margin-bottom-0">Overview</h3>
          {(formattedTaskStatus !== TASK_STATUS_TARGET_ISSUED && formattedTaskStatus !== TASK_STATUS_COMPLETED)
            && (
            <ClaimUnclaimTask
              assignee={taskData.assignee}
              currentUser={currentUser}
              businessKey={businessKey}
              source={`/airpax/tasks/${businessKey}`}
              buttonType="textLink"
            />
            )}
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          {taskData && (
            <TaskVersions
              taskVersions={taskData.versions}
              businessKey={businessKey}
              taskVersionDifferencesCounts={taskData.taskVersionDifferencesCounts}
              airlineCodes={refDataAirlineCodes}
            />
          )}
        </div>
        <div className="govuk-grid-column-one-third">
          {currentUser === assignee && <AddANoteForm />}
          <ActivityLog
            activityLog={taskData?.notes}
          />
        </div>
      </div>

    </>
  );
};

export default TaskDetailsPage;
