import React from 'react';

import { LONG_DAY_DATE_FORMAT, LONG_DATE_FORMAT, ARRIVAL_TEXT } from '../../../../constants';
import { MovementUtil } from '../../utils';

const Itinerary = ({ version }) => {
  const itinerary = MovementUtil.movementItinerary(MovementUtil.movementJourney(version));
  return (
    <div className="task-details-container">
      <h3 className="title-heading airpax-title-heading">Itinerary</h3>
      <div className="thin-border" />
      {itinerary && itinerary.map((it, index) => {
        return (
          <div key={index} className={`${index !== itinerary.length - 1 && 'thin-border'} govuk-!-margin-top-1`}>
            {index !== 0 && index <= itinerary.length - 1 && MovementUtil.itinRelativeTime(index, it, itinerary)}
            <div className="font__bold">
              {MovementUtil.itinFlightNumber(it)} <span className="dot__light" />&nbsp;
              {MovementUtil.departureLoc(it)} <span className="right-arrow">&#8594;</span>&nbsp;
              {MovementUtil.arrivalLoc(it)} <span className="dot__light" />&nbsp;
              {MovementUtil.formatDepartureTime(it, LONG_DAY_DATE_FORMAT)}
            </div>
            <div className="font__light">
              {MovementUtil.itinDepartureCountryCode(it)} <span className="right-arrow">&#8594;</span>&nbsp;
              {MovementUtil.itinArrivalCountryCode(it)} <span className="dot__light" />&nbsp;
              {ARRIVAL_TEXT} {MovementUtil.formatArrivalTime(it, LONG_DATE_FORMAT)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Itinerary;
