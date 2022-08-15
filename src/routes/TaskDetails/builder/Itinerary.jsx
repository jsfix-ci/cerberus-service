import React from 'react';

import { DATE_FORMATS, STRINGS } from '../../../utils/constants';
import { MovementUtil } from '../../../utils';

const Itinerary = ({ version }) => {
  const itinerary = MovementUtil.movementItinerary(MovementUtil.movementJourney(version));
  return (
    <div className="task-details-container">
      <h3 className="govuk-heading-m govuk-!-margin-top-0">Itinerary</h3>
      <div className="bottom-border-thin" />
      {itinerary && itinerary.map((it, index) => {
        return (
          <div
            key={index}
            className={`${index !== itinerary.length - 1 && 'bottom-border-thin'} govuk-!-margin-top-1 govuk-!-padding-bottom-1`}
          >
            {index !== 0 && index <= itinerary.length - 1 && MovementUtil.itinRelativeTime(index, it, itinerary)}
            <div className="font__bold">
              {MovementUtil.itinFlightNumber(it)} <span className="dot__light" />&nbsp;
              {MovementUtil.departureLoc(it)} <span className="right-arrow">&#8594;</span>&nbsp;
              {MovementUtil.arrivalLoc(it)} <span className="dot__light" />&nbsp;
              {MovementUtil.formatDepartureTime(it, DATE_FORMATS.LONG_DAY_DATE)}
            </div>
            <div className="font__light">
              {MovementUtil.itinDepartureCountryCode(it)} <span className="right-arrow">&#8594;</span>&nbsp;
              {MovementUtil.itinArrivalCountryCode(it)} <span className="dot__light" />&nbsp;
              {STRINGS.ARRIVAL_TEXT} {MovementUtil.formatArrivalTime(it, DATE_FORMATS.LONG)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Itinerary;
