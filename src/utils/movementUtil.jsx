import React from 'react';
import airports from '@nitro-land/airport-codes';
import lookup from 'country-code-lookup';
import { Tag } from '@ukhomeoffice/cop-react-components';

import { UNKNOWN_TEXT,
  LONG_DATE_FORMAT,
  MOVEMENT_DESCRIPTION_INDIVIDUAL,
  MOVEMENT_DESCRIPTION_GROUP,
  MOVEMENT_ROLE_AIR_PASSENGER,
  MOVEMENT_ROLE_AIR_CREW,
  UNKNOWN_TIME_DATA,
  LATER_TEXT,
  DEPARTURE_STATUS,
  TASK_STATUS_RELISTED,
  TASK_STATUS_UPDATED,
  BEFORE_TRAVEL_TEXT } from '../constants';

import DateTimeUtil from './datetimeUtil';
import { getTotalNumberOfPersons } from './personUtil';

import { isNotNumber } from './roroDataUtil';
import Common from './common';

const getMovementDirection = (journey) => {
  return journey?.direction || undefined;
};

const toVoyageText = (dateTime, isTaskDetails = false, prefix = '') => {
  const time = DateTimeUtil.relativeTime(dateTime);
  const isPastDate = DateTimeUtil.isPast(dateTime);
  if (isPastDate !== UNKNOWN_TEXT) {
    if (!isTaskDetails) {
      if (isPastDate) {
        return `arrived ${time}`.trim();
      }
      return `arriving in ${time.replace(BEFORE_TRAVEL_TEXT, '')}`.trim();
    }
    if (isPastDate) {
      return `arrived at ${prefix} ${time}`.trim();
    }
    return `arrival at ${prefix} in ${time.replace(BEFORE_TRAVEL_TEXT, '')}`.trim();
  }
  return UNKNOWN_TEXT;
};

const getRelistedStatus = (targetTask) => {
  if (targetTask?.relisted) {
    return (
      <p className="govuk-body govuk-tag govuk-tag--relistedTarget">{TASK_STATUS_RELISTED}</p>
    );
  }
};

const getUpdatedStatus = (targetTask) => {
  // Any of the two sides of the conditional needs to equate to true
  if (targetTask?.versions?.length > 1 || targetTask?.latestVersionNumber > 1) {
    return (
      <p className="govuk-body govuk-tag govuk-tag--updatedTarget">{TASK_STATUS_UPDATED}</p>
    );
  }
};

const getItineraryFlightNumber = (itinerary) => {
  if (!itinerary?.id) {
    return UNKNOWN_TEXT;
  }
  return itinerary.id;
};

const hasItinerary = (journey) => {
  return !!journey?.itinerary;
};

const getMovementItinerary = (journey) => {
  if (hasItinerary(journey)) {
    return journey.itinerary;
  }
  return null;
};

const getFlightTimeObject = (milliseconds) => {
  if (!milliseconds && milliseconds !== 0) {
    return UNKNOWN_TIME_DATA;
  }

  if (isNotNumber(milliseconds)) {
    return UNKNOWN_TIME_DATA;
  }

  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds %= 60;
  minutes %= 60;

  return { h: hours, m: minutes, s: seconds };
};

const getJourneyDuration = (journey) => {
  if (!journey?.duration) {
    return UNKNOWN_TEXT;
  }
  return journey.duration;
};

const toFormattedFlightTime = (journey) => {
  const duration = getJourneyDuration(journey);
  if (duration === UNKNOWN_TEXT) {
    return UNKNOWN_TEXT;
  }
  const time = getFlightTimeObject(duration);
  if (!time.h && !time.m) {
    return UNKNOWN_TEXT;
  }
  return `${time.h}h ${time.m}m`;
};

const getByIataCode = (iataCode) => {
  return airports.findWhere({ iata: iataCode });
};

const getCityByIataCode = (iataCode) => {
  if (!iataCode) {
    return UNKNOWN_TEXT;
  }
  const city = getByIataCode(iataCode)?.get('city');
  if (!city) {
    return UNKNOWN_TEXT;
  }
  return city;
};

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

const getSeatNumber = (flight, taskDetails = false) => {
  const seatPrefix = 'seat';
  if (!flight?.seatNumber) {
    return !taskDetails ? `${seatPrefix} ${UNKNOWN_TEXT}` : UNKNOWN_TEXT;
  }
  return !taskDetails ? `${seatPrefix} ${flight.seatNumber}` : flight.seatNumber;
};

const hasFlight = (targetTask) => {
  return !!targetTask?.movement?.flight;
};

const getFlight = (targetTask) => {
  if (hasFlight(targetTask)) {
    return targetTask.movement.flight;
  }
  return null;
};

const hasJourney = (targetTask) => {
  return !!targetTask?.movement?.journey;
};

const getJourney = (targetTask) => {
  if (hasJourney(targetTask)) {
    return targetTask.movement.journey;
  }
  return null;
};

const getDepartureTime = (journey) => {
  return journey?.departure?.time;
};

const getArrivalTime = (journey) => {
  return journey?.arrival?.time;
};

const toFormattedDepartureDateTime = (journey, dateFormat = LONG_DATE_FORMAT) => {
  if (!journey?.departure?.time) {
    return UNKNOWN_TEXT;
  }
  return DateTimeUtil.format(journey.departure.time, dateFormat);
};

const toFormattedArrivalDateTime = (journey, dateFormat = LONG_DATE_FORMAT) => {
  if (!journey?.arrival?.time) {
    return UNKNOWN_TEXT;
  }
  return DateTimeUtil.format(journey.arrival.time, dateFormat);
};

const toFormattedLocation = (location) => {
  if (!location) {
    return UNKNOWN_TEXT;
  }
  const airport = getByIataCode(location);
  return airport ? `${airport.get('city')}, ${airport.get('country')}` : UNKNOWN_TEXT;
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

/**
 * If country code is not provided, it will use the arrival location
 * to extract the arrival country code.
 */
const getItineraryArrivalCountryCode = (itinerary) => {
  if (!itinerary?.arrival?.country) {
    const arrivalLoc = getArrivalLocation(itinerary);
    if (!arrivalLoc) {
      return UNKNOWN_TEXT;
    }
    const arrivalCountry = getByIataCode(arrivalLoc)?.get('country');
    if (!arrivalCountry) {
      return UNKNOWN_TEXT;
    }
    if (lookup.byCountry(arrivalCountry) !== null) {
      return lookup.byCountry(arrivalCountry).iso3;
    }
    return UNKNOWN_TEXT;
  }
  return Common.iso3Code(itinerary.arrival.country);
};

/**
 * If country code is not provided, it will use the departure location
 * to extract the arrival country code.
 */
const getItineraryDepartureCountryCode = (itinerary) => {
  if (!itinerary?.departure?.country) {
    const departureLoc = getDepartureLocation(itinerary);
    if (!departureLoc) {
      return UNKNOWN_TEXT;
    }
    const departureCountry = getByIataCode(departureLoc)?.get('country');
    if (!departureCountry) {
      return UNKNOWN_TEXT;
    }
    if (lookup.byCountry(departureCountry) !== null) {
      return lookup.byCountry(departureCountry).iso3;
    }
    return UNKNOWN_TEXT;
  }
  return Common.iso3Code(itinerary.departure.country);
};

const getFlightNumber = (flight) => {
  if (!flight?.number) {
    return UNKNOWN_TEXT;
  }
  return flight.number;
};

const getAirlineOperator = (flight) => {
  if (!flight?.operator) {
    return UNKNOWN_TEXT;
  }
  return flight.operator;
};

const getDepartureStatus = (targetTask, taskDetails = false) => {
  const departureStatus = targetTask?.movement?.flight?.departureStatus;
  if (departureStatus) {
    return (
      <>
        {taskDetails && <span>{DEPARTURE_STATUS[departureStatus].description || UNKNOWN_TEXT} </span>}
        <Tag className={` airpax-status airpax-status__${DEPARTURE_STATUS[departureStatus].classname}`}>
          {DEPARTURE_STATUS[departureStatus].code}
        </Tag>
      </>
    );
  }
  return (
    <>
      {taskDetails && <span>{UNKNOWN_TEXT}</span>}
    </>
  );
};

const getMovementTypeText = (targetTask) => {
  const personRole = targetTask?.movement?.person?.role;
  if (!personRole) {
    return UNKNOWN_TEXT;
  }
  if (personRole === MOVEMENT_ROLE_AIR_PASSENGER) {
    return 'Passenger';
  }
  return 'Crew';
};

const toDescriptionText = (targetTask) => {
  const movementDescription = targetTask?.movement?.description;
  const movementRole = targetTask?.movement?.person?.role;
  if (movementRole === MOVEMENT_ROLE_AIR_PASSENGER) {
    if (movementDescription === MOVEMENT_DESCRIPTION_INDIVIDUAL) {
      return 'Single passenger';
    }
    if (movementDescription === MOVEMENT_DESCRIPTION_GROUP) {
      return `In group of ${getTotalNumberOfPersons(targetTask)}`;
    }
  }
  if (movementRole === MOVEMENT_ROLE_AIR_CREW) {
    return 'Crew member';
  }
  return UNKNOWN_TEXT;
};

const toAirlineName = (airlineCode, refDataAirlineCodes) => {
  if (!airlineCode || !refDataAirlineCodes.length) {
    return UNKNOWN_TEXT;
  }
  const airlineData = refDataAirlineCodes.find(({ twolettercode }) => twolettercode === airlineCode);
  if (!airlineData) {
    return UNKNOWN_TEXT;
  }
  return airlineData.name;
};

const toItineraryRelativeTime = (index, itinerary, itineraries) => {
  const previousLegArrivalTime = getArrivalTime(itineraries[index - 1]);
  const nextLegDepartureTime = getDepartureTime(itinerary);
  return (
    <div className="font__light">
      {DateTimeUtil.calculateTimeDifference(
        DateTimeUtil.toList(previousLegArrivalTime, nextLegDepartureTime), undefined, LATER_TEXT,
      )}
    </div>
  );
};

const MovementUtil = {
  movementRoute: getRoute,
  convertMovementRoute: toRoute,
  seatNumber: getSeatNumber,
  movementFlight: getFlight,
  movementJourney: getJourney,
  departureTime: getDepartureTime,
  direction: getMovementDirection,
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
  formatLoc: toFormattedLocation,
  flightDuration: getJourneyDuration,
  flightTimeObject: getFlightTimeObject,
  formatFlightTime: toFormattedFlightTime,
  movementItinerary: getMovementItinerary,
  itinFlightNumber: getItineraryFlightNumber,
  itinDepartureCountryCode: getItineraryDepartureCountryCode,
  itinArrivalCountryCode: getItineraryArrivalCountryCode,
  itinRelativeTime: toItineraryRelativeTime,
  relistStatus: getRelistedStatus,
  updatedStatus: getUpdatedStatus,
  iataToCity: getCityByIataCode,
  voyageText: toVoyageText,
};

export default MovementUtil;

export {
  getRoute,
  toRoute,
  getSeatNumber,
  getFlight,
  getJourney,
  getDepartureTime,
  getArrivalTime,
  toFormattedDepartureDateTime,
  toFormattedArrivalDateTime,
  getDepartureLocation,
  getArrivalLocation,
  getFlightNumber,
  getAirlineOperator,
  getDepartureStatus,
  getMovementTypeText,
  toDescriptionText,
  toAirlineName,
  toFormattedLocation,
  getJourneyDuration,
  toFormattedFlightTime,
  getFlightTimeObject,
  getItineraryFlightNumber,
  getItineraryDepartureCountryCode,
  getItineraryArrivalCountryCode,
  toItineraryRelativeTime,
  getRelistedStatus,
  getUpdatedStatus,
  getCityByIataCode,
  toVoyageText,
  getMovementDirection,
};
