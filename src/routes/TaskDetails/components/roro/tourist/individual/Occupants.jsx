import React from 'react';

import Occupant from './Occupant';
import OccupantCount from '../../OccupantCount';

import { DocumentUtil, MovementUtil, PersonUtil } from '../../../../../../utils';

const Occupants = ({ version }) => {
  const mode = MovementUtil.movementMode(version);
  const journey = MovementUtil.movementJourney(version);
  const departureTime = MovementUtil.departureTime(journey);
  const primaryTraveller = PersonUtil.get(version);
  const occupantCounts = MovementUtil.occupantCounts(version);

  return (
    <div className="task-details-container govuk-!-margin-bottom-2">
      <OccupantCount
        mode={mode}
        primaryTraveller={primaryTraveller}
        occupantCounts={occupantCounts}
        classModifiers={primaryTraveller ? ['govuk-!-padding-bottom-1'] : []}
      />
      <h3 className="govuk-heading-m govuk-!-margin-top-1">Primary traveller</h3>
      <Occupant
        person={primaryTraveller}
        document={DocumentUtil.get(primaryTraveller)}
        departureTime={departureTime}
        labelText="Name"
      />
    </div>
  );
};

export default Occupants;
