import React from 'react';

import TargetingIndicators from '../../TargetingIndicators';
import Booking from '../../Booking';
import PrimaryTraveller from './PrimaryTraveller';
import OccupantCount from '../../OccupantCount';

import { MovementUtil, PersonUtil } from '../../../../../../utils';

const TouristVersionDetails = ({ version }) => {
  const mode = MovementUtil.movementMode(version);
  const primaryTraveller = PersonUtil.get(version);
  const occupantCounts = MovementUtil.occupantCounts(version);
  return (
    <div className="govuk-task-details-grid govuk-!-padding-top-4">
      <div className="govuk-grid-column-one-third">
        <TargetingIndicators version={version} />
      </div>
      <div className="govuk-grid-column-one-third vertical-dotted-line__first">
        <div className="govuk-task-details__col-2">
          <Booking version={version} />
        </div>
      </div>
      <div className="govuk-grid-column-one-third vertical-dotted-line__second">
        <div className="govuk-task-details__col-3">
          <OccupantCount
            mode={mode}
            primaryTraveller={primaryTraveller}
            occupantCounts={occupantCounts}
            classModifiers={primaryTraveller ? ['govuk-!-padding-bottom-1'] : []}
          />
          <PrimaryTraveller version={version} />
        </div>
      </div>
    </div>
  );
};

export default TouristVersionDetails;
