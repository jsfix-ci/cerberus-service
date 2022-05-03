import React from 'react';
import { LONG_DAY_DATE_FORMAT } from '../../../../constants';

import { MovementUtil } from '../../utils';
import renderBlock from './helper/common';

const Voyage = ({ version, airlineCodes }) => {
  const journey = MovementUtil.movementJourney(version);
  const flight = MovementUtil.movementFlight(version);
  return (
    <div className="task-details-container">
      <h3 className="title-heading airpax-title-heading">Voyage</h3>
      <div className="govuk-task-details-grid-column">
        {renderBlock('Departure from', [MovementUtil.departureLoc(journey), MovementUtil.formatLoc(MovementUtil.departureLoc(journey))])}
        {renderBlock('Departure time', [MovementUtil.formatDepartureTime(journey, LONG_DAY_DATE_FORMAT)])}
        {renderBlock('Arrival at', [MovementUtil.arrivalLoc(journey), MovementUtil.formatLoc(MovementUtil.arrivalLoc(journey))])}
        {renderBlock('Arrival time', [MovementUtil.formatArrivalTime(journey, LONG_DAY_DATE_FORMAT)])}
        {renderBlock('Distance', ['DUB'])}
        {renderBlock('Scheduled flight time', ['DUB', 'Dublin, Ireland'])}
        {renderBlock('Flight code', ['DUB'])}
        {renderBlock('Operator', [MovementUtil.airlineName(MovementUtil.airlineOperator(flight), airlineCodes)])}
      </div>
    </div>
  );
};

export default Voyage;
