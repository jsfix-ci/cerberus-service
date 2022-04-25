import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const ClaimUnclaimTask = ({ assignee, currentUser, businessKey, source, buttonType }) => {
  const history = useHistory();
  const isAssignedTo = assignee === currentUser ? 'you' : assignee;
  const [isAssignmentInProgress, setIsAssignmentInProgress] = useState(false);
  const [isAlreadyAssignedWarning, setAlreadyAssignedWarning] = useState(false);

  const CommonButton = (p) => {
    const linkClass = buttonType === 'textLink' ? 'link-button' : 'link-button govuk-!-font-weight-bold govuk-button';
    return (
      isAssignmentInProgress
        ? <span className="govuk-body">Please wait...</span>
        : <button className={linkClass} type="button" {...p} />
    );
  };

  const handleClaim = async () => {
    try {
      setIsAssignmentInProgress(true);
      console.log('await claimTask post', businessKey);
      history.push(source);
    } catch {
      console.log('claimTask post fails as already assigned');
      setAlreadyAssignedWarning(true);
    } finally {
      setIsAssignmentInProgress(false);
    }
  };

  const handleUnclaim = async () => {
    try {
      setIsAssignmentInProgress(true);
      console.log('await unclaimTask post', businessKey);
      history.push(source);
    } catch {
      console.log('unclaim post fails');
      setIsAssignmentInProgress(false);
    } finally {
      setIsAssignmentInProgress(false);
    }
  };

  if (isAlreadyAssignedWarning) {
    return (
      <div className="govuk-warning-text">
        <span className="govuk-warning-text__icon" aria-hidden="true">!</span>
        <strong className="govuk-warning-text__text">
          <span className="govuk-warning-text__assistive">Warning</span>
          {`Task already assigned to ${assignee}`}
        </strong>
      </div>
    );
  } if (!assignee && !isAlreadyAssignedWarning) {
    return <span className="govuk-body task-list--email">Task not assigned <CommonButton onClick={handleClaim}>Claim</CommonButton></span>;
  }
  return <span className="govuk-body task-list--email">{`Assigned to ${isAssignedTo}`} <CommonButton onClick={handleUnclaim}>Unclaim task</CommonButton></span>;
};

export default ClaimUnclaimTask;
