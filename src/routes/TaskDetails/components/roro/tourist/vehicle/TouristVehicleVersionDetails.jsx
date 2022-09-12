import React from 'react';

import TargetingIndicators from '../../shared/TargetingIndicators';
import Vehicle from '../../shared/Vehicle';
import Booking from '../../shared/Booking';
import Occupants from '../../shared/Occupants';

const TouristVehicleVersionDetails = ({ version }) => {
  return (
    <div className="govuk-task-details-grid govuk-!-padding-top-4">
      <div className="govuk-grid-column-one-third">
        <TargetingIndicators version={version} classModifiers={['bottom-border-thin']} />
        <Vehicle version={version} />
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

export default TouristVehicleVersionDetails;
