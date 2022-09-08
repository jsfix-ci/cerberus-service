import { DATE_FORMATS, STRINGS, UNKNOWN_TIME_DATA } from '../constants';

import { getFormattedDate } from '../Datetime/datetimeUtil';
import { isNotNumber } from '../Number/numberUtil';

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

const toFormattedDepartureDateTime = (journey, dateFormat = DATE_FORMATS.LONG) => {
  if (!journey?.departure?.time) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return getFormattedDate(journey.departure.time, dateFormat);
};

const toFormattedArrivalDateTime = (journey, dateFormat = DATE_FORMATS.LONG) => {
  if (!journey?.arrival?.time) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return getFormattedDate(journey.arrival.time, dateFormat);
};

const getJourneyDuration = (journey) => {
  if (!journey?.duration) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return journey.duration;
};

const toFormattedFlightTime = (journey) => {
  const duration = getJourneyDuration(journey);
  if (duration === STRINGS.UNKNOWN_TEXT) {
    return STRINGS.UNKNOWN_TEXT;
  }
  const time = getFlightTimeObject(duration);
  if (!time.h && !time.m) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return `${time.h}h ${time.m}m`;
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

const getDepartureTime = (journey) => {
  return journey?.departure?.time;
};

const getArrivalTime = (journey) => {
  return journey?.arrival?.time;
};

const getDepartureLocation = (journey) => {
  if (!journey?.departure?.location) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return journey.departure.location;
};

const getArrivalLocation = (journey) => {
  if (!journey?.arrival?.location) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return journey.arrival.location;
};

const getMovementDirection = (journey) => {
  return journey?.direction || undefined;
};

const getRoute = (journey) => {
  return journey?.route;
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

const JourneyUtil = {
  arrivalLoc: getArrivalLocation,
  arrivalTime: getArrivalTime,
  departureLoc: getDepartureLocation,
  departureTime: getDepartureTime,
  direction: getMovementDirection,
  formatDepartureTime: toFormattedDepartureDateTime,
  formatArrivalTime: toFormattedArrivalDateTime,
  flightDuration: getJourneyDuration,
  flightTimeObject: getFlightTimeObject,
  formatFlightTime: toFormattedFlightTime,
  get: getJourney,
  movementRoute: getRoute,
  movementItinerary: getMovementItinerary,
};

export default JourneyUtil;

export {
  getRoute,
  getJourney,
  getDepartureTime,
  getArrivalTime,
  toFormattedDepartureDateTime,
  toFormattedArrivalDateTime,
  getDepartureLocation,
  getArrivalLocation,
  getJourneyDuration,
  toFormattedFlightTime,
  getFlightTimeObject,
  getMovementDirection,
};
