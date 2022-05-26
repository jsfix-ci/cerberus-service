import React from 'react';

import { Panel, ButtonGroup, Button } from '@ukhomeoffice/cop-react-components';

import { PNR_USER_SESSION_ID } from '../constants';

const getClassModifier = (pnrRequested) => {
  return pnrRequested ? ['confirmation'] : [];
};

const getTitleMessage = (pnrData, pnrRequested) => {
  if (pnrRequested) {
    return pnrData.confirmation.approve.text.title;
  }
  return pnrData.confirmation.reject.text.title;
};

// const getStatusMessageBody = (submissionStatus) => {
//   if (submissionStatus === PNR_APPROVED) {
//     return (
//       <>
//         <p><strong>What happens next</strong></p>
//         You are now able to access PNR data for the following 8 hours.
//         <br />
//         <br />
//         After that period has lapsed you will need to request access again.
//       </>
//     );
//   }
//   return (
//     <>
//       <p><strong>What happens next</strong></p>
//       You will not be able to access PNR data. Please try again.
//     </>
//   );
// };

const OutcomeNotification = ({ pnrData, setShowForm }) => {
  const storedUserSession = JSON.parse(localStorage.getItem(PNR_USER_SESSION_ID));
  return (
    <>
      {storedUserSession.requested && (
      <Panel
        title={getTitleMessage(pnrData, storedUserSession.requested)}
        classModifiers={getClassModifier(storedUserSession.requested)}
      />
      )}
      {!storedUserSession.requested && (
      <Panel
        title={getTitleMessage(pnrData, storedUserSession.requested)}
        classModifiers={getClassModifier(storedUserSession.requested)}
      />
      )}
      <ButtonGroup>
        <Button name={pnrData.id} onClick={() => setShowForm(false)}>
          Continue
        </Button>
      </ButtonGroup>
      {/* <p>{getStatusMessageBody(submissionStatus)}</p> */}
    </>
  );
};

export default OutcomeNotification;
