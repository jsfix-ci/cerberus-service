import React from 'react';

import TargetingIndicators from './TargetingIndicators';
import Booking from './Booking';
import Occupants from './tourist/group/Occupants';
import Document from './Document';
import PrimaryTraveller from './tourist/group/PrimaryTraveller';

const TouristVersionDetails = ({ version }) => {
  return (
    <div className="govuk-task-details-grid govuk-!-padding-top-4">
      <div className="govuk-grid-column-one-third">
        <TargetingIndicators version={version} classModifiers={['bottom-border-thin']} />
        <PrimaryTraveller version={version} classModifiers={['bottom-border-thin']} />
        <Document version={version} />
      </div>
      <div className="govuk-grid-column-one-third vertical-dotted-line__first">
        <div className="govuk-task-details__col-2">
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

export default TouristVersionDetails;
