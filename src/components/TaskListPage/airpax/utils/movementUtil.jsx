import React from 'react';
import airlines from 'airline-codes';

import { UNKNOWN_TEXT, LONG_DATE_FORMAT, MOVEMENT_DESCRIPTION_INDIVIDUAL, MOVEMENT_DESCRIPTION_GROUP,
  MOVEMENT_MODE_AIR_PASSENGER, MOVEMENT_MODE_AIR_CREW } from '../../../../constants';

import { getFormattedDate } from './datetimeUtil';
import { getTotalNumberOfPersons } from './personUtil';

const getRoute = (journey) => {
  return journey?.route;
};

const toRoute = (route) => {
  if (!route) {
    return UNKNOWN_TEXT;
  }
  return route.map((r, index) => {
    return (<span key={index}>{r} {index < route.length - 1 && <>&#8594;</>} </span>);
  });
};

const getSeatNumber = (flight) => {
  const seatPrefix = 'seat';
  if (!flight?.seatNumber) {
    return `${seatPrefix} ${UNKNOWN_TEXT}`;
  }
  return `${seatPrefix} ${flight.seatNumber}`;
};

const getFlight = (targetTask) => {
  return targetTask.movement.flight;
};

const hasFlight = (targetTask) => {
  return !!targetTask.movement.flight;
};

const getJourney = (targetTask) => {
  return targetTask.movement.journey;
};

const hasJourney = (targetTask) => {
  return !!targetTask?.movement?.journey;
};

const getDepartureTime = (journey) => {
  return journey?.departure?.time;
};

const getArrivalTime = (journey) => {
  return journey?.arrival?.time;
};

const toFormattedDepartureDateTime = (journey) => {
  if (!journey?.departure?.time) {
    return UNKNOWN_TEXT;
  }
  return getFormattedDate(journey.departure.time, LONG_DATE_FORMAT);
};

const toFormattedArrivalDateTime = (journey) => {
  if (!journey?.arrival?.time) {
    return UNKNOWN_TEXT;
  }
  return getFormattedDate(journey.arrival.time, LONG_DATE_FORMAT);
};

const getDepartureLocation = (journey) => {
  if (!journey?.departure?.location) {
    return UNKNOWN_TEXT;
  }
  return journey.departure.location;
};

const getArrivalLocation = (journey) => {
  if (!journey?.arrival?.location) {
    return UNKNOWN_TEXT;
  }
  return journey.arrival.location;
};

const getFlightNumber = (flight) => {
  if (!flight?.number) {
    return UNKNOWN_TEXT;
  }
  return flight.number;
};

const getAirlineOperator = (flight) => {
  return flight.operator;
};

const getDepartureStatus = (targetTask) => {
  const departureStatus = targetTask?.movement?.flight?.departureStatus;
  let departureStatusClass;
  switch (departureStatus) {
    case 'DC':
      departureStatusClass = 'departureConfirmed';
      break;
    case 'BP':
      departureStatusClass = 'bookedPassenger';
      break;
    case 'CI':
      departureStatusClass = 'checkedIn';
      break;
    case 'DX':
      departureStatusClass = 'departureException';
      break;
    default:
      break;
  }
  return (
    departureStatus && (
    <span className={`govuk-body govuk-tag govuk-tag--${departureStatusClass}`}>
      {departureStatus}
    </span>
    )
  );
};

const getMovementTypeText = (targetTask) => {
  const movementType = targetTask?.movement?.mode;
  if (!movementType) {
    return UNKNOWN_TEXT;
  }
  if (movementType === MOVEMENT_MODE_AIR_PASSENGER) {
    return 'Passenger';
  }
  return 'Crew';
};

const toDescriptionText = (targetTask) => {
  const movementDescription = targetTask?.movement?.description;
  const movementType = targetTask?.movement?.mode;
  let descriptionText;
  if (movementType === MOVEMENT_MODE_AIR_PASSENGER) {
    switch (movementDescription) {
      case MOVEMENT_DESCRIPTION_INDIVIDUAL: {
        descriptionText = 'Single passenger';
        break;
      }
      case MOVEMENT_DESCRIPTION_GROUP: {
        descriptionText = `In group of ${getTotalNumberOfPersons(targetTask)}`;
        break;
      }
      default: {
        return '';
      }
    }
    if (movementType === MOVEMENT_MODE_AIR_CREW) {
      descriptionText = 'Crew member';
    }
  }
  return descriptionText;
};

const toAirlineName = (airlineCode) => {
  if (!airlineCode) {
    return UNKNOWN_TEXT;
  }
  return airlines.findWhere({ iata: airlineCode }).get('name');
};

const MovementUtil = {
  movementRoute: getRoute,
  convertMovementRoute: toRoute,
  seatNumber: getSeatNumber,
  hasMovementFlight: hasFlight,
  movementFlight: getFlight,
  hasMovementJourney: hasJourney,
  movementJourney: getJourney,
  departureTime: getDepartureTime,
  arrivalTime: getArrivalTime,
  formatDepartureTime: toFormattedDepartureDateTime,
  formatArrivalTime: toFormattedArrivalDateTime,
  departureLoc: getDepartureLocation,
  arrivalLoc: getArrivalLocation,
  flightNumber: getFlightNumber,
  airlineOperator: getAirlineOperator,
  status: getDepartureStatus,
  movementType: getMovementTypeText,
  description: toDescriptionText,
  airlineName: toAirlineName,
};

export default MovementUtil;

export { getRoute, toRoute, getSeatNumber, getFlight, hasFlight, getJourney, hasJourney, getDepartureTime,
  getArrivalTime, toFormattedDepartureDateTime, toFormattedArrivalDateTime, getDepartureLocation, getArrivalLocation,
  getFlightNumber, getAirlineOperator, getDepartureStatus, getMovementTypeText, toDescriptionText, toAirlineName };
