import React, { useContext } from 'react';
import { LONG_DAY_DATE_FORMAT } from '../../../../constants';
import { ApplicationContext } from '../../../../context/ApplicationContext';

import { MovementUtil } from '../../utils';
import renderBlock from './helper/common';

const Voyage = ({ version }) => {
  const journey = MovementUtil.movementJourney(version);
  const flight = MovementUtil.movementFlight(version);
  const { refDataAirlineCodes } = useContext(ApplicationContext);
  return (
    <div className="task-details-container bottom-border-thin govuk-!-margin-bottom-2">
      <h3 className="govuk-heading-m govuk-!-margin-top-0">Voyage</h3>
      <div className="govuk-task-details-grid-column">
        {renderBlock('Departure from', [MovementUtil.departureLoc(journey), MovementUtil.formatLoc(MovementUtil.departureLoc(journey))])}
        {renderBlock('Departure time', [MovementUtil.formatDepartureTime(journey, LONG_DAY_DATE_FORMAT)])}
        {renderBlock('Arrival at', [MovementUtil.arrivalLoc(journey), MovementUtil.formatLoc(MovementUtil.arrivalLoc(journey))])}
        {renderBlock('Arrival time', [MovementUtil.formatArrivalTime(journey, LONG_DAY_DATE_FORMAT)])}
        {renderBlock('Scheduled flight time', [MovementUtil.formatFlightTime(journey)])}
        {renderBlock('Flight code', [MovementUtil.flightNumber(flight)])}
        {renderBlock('Operator', [MovementUtil.airlineName(MovementUtil.airlineOperator(flight), refDataAirlineCodes)])}
      </div>
    </div>
  );
};

export default Voyage;
