import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import LinkButton from './LinkButton';
import { useAxiosInstance } from '../../utils/Axios/axiosInstance';
import config from '../../utils/config';
import { TASK_STATUS } from '../../utils/constants';
import { useKeycloak } from '../../context/Keycloak';

const ClaimTaskButton = ({ assignee, taskId, setError = () => {}, businessKey, TaskAssignedWarning = () => {}, ...props }) => {
  const history = useHistory();
  const [isAssignmentInProgress, setAssignmentProgress] = useState(false);
  const keycloak = useKeycloak();
  const camundaClient = useAxiosInstance(keycloak, config.camundaApiUrl);
  const currentUser = keycloak.tokenParsed.email;

  const CommonButton = (p) => (
    isAssignmentInProgress
      ? <span className="govuk-body">Please wait...</span>
      : <LinkButton type="button" {...p} />
  );

  const handleClaim = async () => {
    try {
      setAssignmentProgress(true);
      await camundaClient.post(`task/${taskId}/claim`, {
        userId: currentUser,
      });
      if (history.location.pathname !== `/tasks/${businessKey}`) {
        history.push(`/tasks/${businessKey}`);
      } else {
        history.go(0);
      }
    } catch (e) {
      setAssignmentProgress(false);
      history.push(`/tasks/${businessKey}/?alreadyAssigned=t`);
      return TaskAssignedWarning(assignee);
      // }
    }
  };

  const handleUnclaim = async () => {
    try {
      setAssignmentProgress(true);
      await camundaClient.post(`task/${taskId}/unclaim`, {
        userId: currentUser,
      });
      history.push(
        { pathname: '/tasks',
          search: `?tab=${TASK_STATUS.NEW}` },
      );
      window.scrollTo(0, 0);
    } catch (e) {
      setError(e.message);
      setAssignmentProgress(false);
    }
  };

  if (assignee === currentUser) {
    return <CommonButton onClick={handleUnclaim} {...props}>Unclaim task</CommonButton>;
  }
  if (!assignee) {
    return <CommonButton onClick={handleClaim} {...props}>Claim</CommonButton>;
  }
  if (assignee !== currentUser) {
    return <span className="govuk-body task-list--email">{`Assigned to ${assignee}`}</span>;
  }
  return null;
};

export default ClaimTaskButton;
