import React from 'react';

import { Panel, ButtonGroup, Button } from '@ukhomeoffice/cop-react-components';

import { PNR_USER_SESSION_ID, PNR_USER_DESCISION } from '../constants';

const getClassModifier = (storedUserSession) => {
  return storedUserSession.requested ? ['confirmation'] : [];
};

const getTitleMessage = (storedUserSession) => {
  if (storedUserSession.requested) {
    return PNR_USER_DESCISION.yes.text.title;
  }
  return PNR_USER_DESCISION.no.text.title;
};

const getOutcomeBody = (storedUserSession) => {
  if (storedUserSession.requested) {
    return (
      <div className="govuk-body">
        <p><strong>{PNR_USER_DESCISION.yes.text.title}</strong></p>
        <ul>
          <li>{PNR_USER_DESCISION.yes.text.body.message1}</li>
        </ul>
      </div>
    );
  }
  return undefined;
};

const OutcomeNotification = ({ setDisplayForm }) => {
  const storedUserSession = JSON.parse(localStorage.getItem(PNR_USER_SESSION_ID));
  return (
    <div className="govuk-width-container ">
      <main className="govuk-main-wrapper govuk-main-wrapper--auto-spacing" id="main-content" role="main">
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-two-thirds">
            {storedUserSession.requested && (
            <Panel
              title={getTitleMessage(storedUserSession)}
              classModifiers={getClassModifier(storedUserSession)}
            />
            )}
            {!storedUserSession.requested && (
            <h1 className="govuk-heading-l"><strong>{getTitleMessage(storedUserSession)}</strong></h1>
            )}
            {getOutcomeBody(storedUserSession)}
            <ButtonGroup>
              <Button onClick={() => setDisplayForm(false)}>
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
