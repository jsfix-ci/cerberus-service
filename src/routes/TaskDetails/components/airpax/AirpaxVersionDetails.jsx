import React from 'react';

import Passenger from './Passenger';
import Document from './Document';
import Baggage from './Baggage';
import Booking from './Booking';
import Voyage from './Voyage';
import Itinerary from './Itinerary';
import CoTraveller from './CoTraveller';

const AirpaxVersionDetails = ({ version }) => {
  return (
    <>
      <div className="govuk-task-details-grid">
        <div className="govuk-grid-column-one-third">
          <Passenger version={version} />
          <Document version={version} />
          <Baggage version={version} />
        </div>
        <div className="govuk-grid-column-one-third vertical-dotted-line__first">
          <div className="govuk-task-details__col-2">
            <Booking version={version} />
          </div>
        </div>
        <div className="govuk-grid-column-one-third vertical-dotted-line__second">
          <div className="govuk-task-details__col-3">
            <Voyage version={version} />
            <Itinerary version={version} />
          </div>
        </div>
      </div>
      <div>
        <CoTraveller version={version} />
      </div>
    </>
  );
};

export default AirpaxVersionDetails;
