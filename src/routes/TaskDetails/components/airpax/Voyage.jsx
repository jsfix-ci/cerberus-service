import React, { useContext } from 'react';
import { DATE_FORMATS } from '../../../../utils/constants';
import { ApplicationContext } from '../../../../context/ApplicationContext';

import { JourneyUtil, MovementUtil } from '../../../../utils';
import renderBlock from '../../helper/common';

const Voyage = ({ version }) => {
  const journey = JourneyUtil.get(version);
  const flight = MovementUtil.movementFlight(version);
  const { refDataAirlineCodes } = useContext(ApplicationContext);
  return (
    <div className="task-details-container bottom-border-thin govuk-!-margin-bottom-2">
      <h3 className="govuk-heading-m govuk-!-margin-top-0">Voyage</h3>
      <div className="govuk-task-details-grid-column">
        {renderBlock('Departure from', [JourneyUtil.departureLoc(journey), MovementUtil.formatLoc(JourneyUtil.departureLoc(journey))])}
        {renderBlock('Departure time', [JourneyUtil.formatDepartureTime(journey, DATE_FORMATS.LONG_DAY_DATE)])}
        {renderBlock('Arrival at', [JourneyUtil.arrivalLoc(journey), MovementUtil.formatLoc(JourneyUtil.arrivalLoc(journey))])}
        {renderBlock('Arrival time', [JourneyUtil.formatArrivalTime(journey, DATE_FORMATS.LONG_DAY_DATE)])}
        {renderBlock('Scheduled flight time', [JourneyUtil.formatFlightTime(journey)])}
        {renderBlock('Flight code', [MovementUtil.flightNumber(flight)])}
        {renderBlock('Operator', [MovementUtil.airlineName(MovementUtil.airlineOperator(flight), refDataAirlineCodes())])}
      </div>
    </div>
  );
};

export default Voyage;
