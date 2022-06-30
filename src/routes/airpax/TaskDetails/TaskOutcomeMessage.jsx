import React from 'react';
import { Button, Panel } from '@ukhomeoffice/cop-react-components';

const TaskOutcomeMessage = ({ message, onFinish, setRefreshNotesForm }) => {
  setRefreshNotesForm(true);
  return (
    <>
      <Panel title={message} />
      <p className="govuk-body">We have sent your request to the relevant team.</p>
      <h2 className="govuk-heading-m">What happens next</h2>
      <p className="govuk-body">The task is now paused pending a response.</p>
      <Button
        className="govuk-button"
        onClick={() => {
          onFinish();
        }}
      >
        Finish
      </Button>
    </>
  );
};

export default TaskOutcomeMessage;
