import React from 'react';

import TargetingIndicators from '../../shared/TargetingIndicators';
import Booking from '../../shared/Booking';
import GroupOccupants from './GroupOccupants';
import Document from '../../shared/Document';
import PrimaryTraveller from './PrimaryTraveller';

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
          <GroupOccupants version={version} />
        </div>
      </div>
    </div>
  );
};

export default TouristVersionDetails;
