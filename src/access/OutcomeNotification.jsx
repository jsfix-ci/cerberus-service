import React from 'react';

import { Panel, ButtonGroup, Button } from '@ukhomeoffice/cop-react-components';

import { PNR_USER_SESSION_ID } from '../constants';

const getClassModifier = (pnrRequested) => {
  return pnrRequested ? ['confirmation'] : [];
};

const getTitleMessage = (pnrResource, pnrRequested) => {
  if (pnrRequested) {
    return pnrResource.confirmation.approve.text.title;
  }
  return pnrResource.confirmation.reject.text.title;
};

const getOutcomeBody = (pnrResource, storedUserSession) => {
  const pnrText = pnrResource.confirmation;
  const approvalMessage = pnrText.approve.text.body;
  if (storedUserSession.requested) {
    return (
      <>
        <p><strong>{approvalMessage.title}</strong></p>
        <ul>
          <li>{approvalMessage.firstLine}</li>
          <li>{approvalMessage.secondLine}</li>
        </ul>
      </>
    );
  }
  return (
    <>
      <p><strong>What happens next</strong></p>
      You will not be able to access PNR data. Please try again.
    </>
  );
};

const OutcomeNotification = ({ pnrResource, setShowForm }) => {
  const storedUserSession = JSON.parse(localStorage.getItem(PNR_USER_SESSION_ID));
  return (
    <div className="govuk-width-container ">
      <main className="govuk-main-wrapper govuk-main-wrapper--auto-spacing" id="main-content" role="main">
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-two-thirds">
            {storedUserSession.requested && (
            <Panel
              title={getTitleMessage(pnrResource, storedUserSession.requested)}
              classModifiers={getClassModifier(storedUserSession.requested)}
            />
            )}
            {!storedUserSession.requested && (
            <Panel
              title={getTitleMessage(pnrResource, storedUserSession.requested)}
              classModifiers={getClassModifier(storedUserSession.requested)}
            />
            )}
            <p>{getOutcomeBody(pnrResource, storedUserSession)}</p>
            <ButtonGroup>
              <Button name={pnrResource.id} onClick={() => setShowForm(false)}>
                Continue
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </main>
    </div>

  );
};

export default OutcomeNotification;
