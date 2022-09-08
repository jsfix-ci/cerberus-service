import React from 'react';

import TargetingIndicators from './TargetingIndicators';
import Vehicle from './Vehicle';
import Trailer from './Trailer';
import Goods from './Goods';
import Haulier from './Haulier';
import Account from './Account';
import Booking from './Booking';
import Occupants from './Occupants';

const AccompaniedVersionDetails = ({ version }) => {
  return (
    <div className="govuk-task-details-grid govuk-!-padding-top-4">
      <div className="govuk-grid-column-one-third">
        <TargetingIndicators version={version} />
        <Vehicle version={version} />
        <Trailer version={version} />
        <Goods version={version} />
      </div>
      <div className="govuk-grid-column-one-third vertical-dotted-line__first">
        <div className="govuk-task-details__col-2">
          <Haulier version={version} />
          <Account version={version} />
          <Booking version={version} />
        </div>
      </div>
      <div className="govuk-grid-column-one-third vertical-dotted-line__second">
        <div className="govuk-task-details__col-3">
          <Occupants version={version} />
        </div>
      </div>
    </div>
  );
};

export default AccompaniedVersionDetails;
