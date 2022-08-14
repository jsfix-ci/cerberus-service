import React from 'react';
import airports from '@nitro-land/airport-codes';
import lookup from 'country-code-lookup';
import { Tag } from '@ukhomeoffice/cop-react-components';

import {
  DATE_FORMATS,
  DEPARTURE_STATUS,
  STRINGS,
  ICON,
  MOVEMENT_DESCRIPTION,
  MOVEMENT_MODES,
  MOVEMENT_ROLE,
  TASK_STATUS,
  UNKNOWN_TIME_DATA,
} from '../constants';

import { calculateTimeDifference,
  getFormattedDate,
  isInPast,
  toDateTimeList,
  toRelativeTime } from '../Datetime/datetimeUtil';
import { getTotalNumberOfPersons } from '../Person/personUtil';
import { isNotNumber } from '../Number/numberUtil';
import Common from '../Common/common';

const getMovementMode = (targetTask) => {
  return targetTask?.movement?.mode || undefined;
};

const getIconDescription = (targetTask) => {
  return targetTask?.movement?.description || undefined;
};

const hasCarrierCounts = (suppliedPassengerCounts) => {
  const expected = ['oapCount', 'adultCount', 'childCount', 'infantCount'];
  let hayStack = [];
  suppliedPassengerCounts.forEach((countObj) => {
    if ((countObj.propName === 'oapCount' && countObj.content !== null)
      || (countObj.propName === 'adultCount' && countObj.content !== null)
      || (countObj.propName === 'childCount' && countObj.content !== null)
      || (countObj.propName === 'infantCount' && countObj.content !== null)) {
      hayStack.push(countObj.propName);
    }
  });
  return expected.every((needle) => hayStack.includes(needle));
};

const isValid = (obj) => {
  return obj !== null && obj !== undefined && obj !== '';
};

const hasVehicle = (vehicleRegistration) => {
  return vehicleRegistration !== null && vehicleRegistration !== undefined && vehicleRegistration !== '';
};

const hasVehicleMake = (vehicleMake) => {
  return vehicleMake !== null && vehicleMake !== undefined && vehicleMake !== '';
};

const hasVehicleModel = (vehicleModel) => {
  return vehicleModel !== null && vehicleModel !== undefined && vehicleModel !== '';
};

const hasTrailer = (vehicle) => {
  return vehicle?.trailer?.regNumber && vehicle?.trailer?.regNumber !== ''
    && vehicle?.trailer?.regNumber !== null && vehicle?.trailer?.regNumber !== undefined;
};

const hasDriver = (driverName) => {
  return driverName !== null && driverName !== undefined && driverName !== '';
};

const hasCheckinDate = (checkinDate) => {
  return checkinDate !== null && checkinDate !== undefined && checkinDate !== '';
};

const hasEta = (eta) => {
  return eta !== null && eta !== undefined && eta !== '';
};

const hasDepartureTime = (departureTime) => {
  return departureTime !== null && departureTime !== undefined && departureTime !== '';
};

const getNamedPassenger = (passenger) => {
  if (passenger?.contents) {
    let hasName = false;
    passenger.contents.map(({ propName, content }) => {
      if (propName === 'name') {
        hasName = !!content;
      }
    });
    return hasName && passenger;
  }
};

const isSinglePassenger = (passengers) => {
  const filteredPassengers = passengers.filter((passenger) => {
    if (passenger?.name) {
      return passenger;
    }
    return getNamedPassenger(passenger);
  });
  return filteredPassengers && filteredPassengers?.length === 1;
};

// Checks for presence of at least a valid passenger
const hasTaskVersionPassengers = (passengers) => {
  for (const passengerChildSets of passengers.childSets) {
    const passengerName = passengerChildSets.contents.find(({ propName }) => propName === 'name').content;
    if (passengerName) {
      return true;
    }
  }
  return false;
};

const isTaskDetailsPassenger = (passenger) => {
  let validPassenger = false;
  for (const passengerDataFieldObj of passenger.contents) {
    if (passengerDataFieldObj.content !== null) {
      validPassenger = true;
      break;
    }
  }
  return validPassenger;
};

const isVehiclePresent = (vehicle) => {
  return vehicle?.registrationNumber && vehicle?.registrationNumber !== ''
    && vehicle?.registrationNumber !== null && vehicle?.registrationNumber !== undefined;
};

const getTouristIcon = (vehicle, passengers) => {
  if (isVehiclePresent(vehicle)) {
    return ICON.CAR;
  }

  if (!isVehiclePresent(vehicle) && isSinglePassenger(passengers)) {
    return ICON.INDIVIDUAL;
  }

  return ICON.GROUP;
};

const getMovementModeIcon = (movementMode, vehicle, passengers) => {
  if (movementMode === MOVEMENT_MODES.TOURIST.toUpperCase()) {
    return getTouristIcon(vehicle, passengers);
  }

  if (!isVehiclePresent(vehicle) && hasTrailer(vehicle)) {
    return ICON.TRAILER;
  }

  if (isVehiclePresent(vehicle) && !hasTrailer(vehicle)) {
    return ICON.VAN;
  }

  if (isVehiclePresent(vehicle) && hasTrailer(vehicle)) {
    return ICON.HGV;
  }

  return ICON.NONE;
};

const getMovementDirection = (journey) => {
  return journey?.direction || undefined;
};

const toVoyageText = (dateTime, isTaskDetails = false, prefix = '') => {
  const time = toRelativeTime(dateTime);
  const isPastDate = isInPast(dateTime);
  if (isPastDate !== STRINGS.UNKNOWN_TEXT) {
    if (!isTaskDetails) {
      if (isPastDate) {
        return `arrived ${time}`.trim();
      }
      return `arriving in ${time.replace(STRINGS.BEFORE_TRAVEL_TEXT, '')}`.trim();
    }
    if (isPastDate) {
      return `arrived at ${prefix} ${time}`.trim();
    }
    return `arrival at ${prefix} in ${time.replace(STRINGS.BEFORE_TRAVEL_TEXT, '')}`.trim();
  }
  return STRINGS.UNKNOWN_TEXT;
};

const getRelistedStatus = (targetTask) => {
  if (targetTask?.relisted) {
    return (
      <p className="govuk-body govuk-tag govuk-tag--relistedTarget">{TASK_STATUS.RELISTED}</p>
    );
  }
};

const getUpdatedStatus = (targetTask) => {
  // Any of the two sides of the conditional needs to equate to true
  if (targetTask?.versions?.length > 1 || targetTask?.latestVersionNumber > 1) {
    return (
      <p className="govuk-body govuk-tag govuk-tag--updatedTarget">{TASK_STATUS.UPDATED}</p>
    );
  }
};

const getItineraryFlightNumber = (itinerary) => {
  if (!itinerary?.id) {
    return STRINGS.UNKNOWN_TEXT;
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

const getByIataCode = (iataCode) => {
  return airports.findWhere({ iata: iataCode });
};

const getCityByIataCode = (iataCode) => {
  if (!iataCode) {
    return STRINGS.UNKNOWN_TEXT;
  }
  const city = getByIataCode(iataCode)?.get('city');
  if (!city) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return city;
};

const getRoute = (journey) => {
  return journey?.route;
};

const toRoute = (route) => {
  if (!route) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return route.map((r, index) => {
    return (<span key={index}>{r} {index < route.length - 1 && <>&#8594;</>} </span>);
  });
};

const getSeatNumber = (flight, taskDetails = false) => {
  const seatPrefix = 'seat';
  if (!flight?.seatNumber) {
    return !taskDetails ? `${seatPrefix} ${STRINGS.UNKNOWN_TEXT}` : STRINGS.UNKNOWN_TEXT;
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

const toFormattedLocation = (location) => {
  if (!location) {
    return STRINGS.UNKNOWN_TEXT;
  }
  const airport = getByIataCode(location);
  return airport ? `${airport.get('city')}, ${airport.get('country')}` : STRINGS.UNKNOWN_TEXT;
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

/**
 * If country code is not provided, it will use the arrival location
 * to extract the arrival country code.
 */
const getItineraryArrivalCountryCode = (itinerary) => {
  if (!itinerary?.arrival?.country) {
    const arrivalLoc = getArrivalLocation(itinerary);
    if (!arrivalLoc) {
      return STRINGS.UNKNOWN_TEXT;
    }
    const arrivalCountry = getByIataCode(arrivalLoc)?.get('country');
    if (!arrivalCountry) {
      return STRINGS.UNKNOWN_TEXT;
    }
    if (lookup.byCountry(arrivalCountry) !== null) {
      return lookup.byCountry(arrivalCountry).iso3;
    }
    return STRINGS.UNKNOWN_TEXT;
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
      return STRINGS.UNKNOWN_TEXT;
    }
    const departureCountry = getByIataCode(departureLoc)?.get('country');
    if (!departureCountry) {
      return STRINGS.UNKNOWN_TEXT;
    }
    if (lookup.byCountry(departureCountry) !== null) {
      return lookup.byCountry(departureCountry).iso3;
    }
    return STRINGS.UNKNOWN_TEXT;
  }
  return Common.iso3Code(itinerary.departure.country);
};

const getFlightNumber = (flight) => {
  if (!flight?.number) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return flight.number;
};

const getAirlineOperator = (flight) => {
  if (!flight?.operator) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return flight.operator;
};

const getDepartureStatus = (targetTask, taskDetails = false) => {
  const departureStatus = targetTask?.movement?.flight?.departureStatus;
  if (departureStatus) {
    return (
      <>
        {taskDetails && <span>{DEPARTURE_STATUS[departureStatus].description || STRINGS.UNKNOWN_TEXT} </span>}
        <Tag className={` airpax-status airpax-status__${DEPARTURE_STATUS[departureStatus].classname}`}>
          {DEPARTURE_STATUS[departureStatus].code}
        </Tag>
      </>
    );
  }
  return (
    <>
      {taskDetails && <span>{STRINGS.UNKNOWN_TEXT}</span>}
    </>
  );
};

const getMovementTypeText = (targetTask) => {
  const personRole = targetTask?.movement?.person?.role;
  if (!personRole) {
    return STRINGS.UNKNOWN_TEXT;
  }
  if (personRole === MOVEMENT_ROLE.PASSENGER) {
    return 'Passenger';
  }
  return 'Crew';
};

const toDescriptionText = (targetTask) => {
  const movementDescription = targetTask?.movement?.description;
  const movementRole = targetTask?.movement?.person?.role;
  if (movementRole === MOVEMENT_ROLE.PASSENGER) {
    if (movementDescription === MOVEMENT_DESCRIPTION.INDIVIDUAL) {
      return 'Single passenger';
    }
    if (movementDescription === MOVEMENT_DESCRIPTION.GROUP) {
      return `In group of ${getTotalNumberOfPersons(targetTask)}`;
    }
  }
  if (movementRole === MOVEMENT_ROLE.AIR_CREW) {
    return 'Crew member';
  }
  return STRINGS.UNKNOWN_TEXT;
};

const toAirlineName = (airlineCode, refDataAirlineCodes) => {
  if (!airlineCode || !refDataAirlineCodes.length) {
    return STRINGS.UNKNOWN_TEXT;
  }
  const airlineData = refDataAirlineCodes.find(({ twolettercode }) => twolettercode === airlineCode);
  if (!airlineData) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return airlineData.name;
};

const toItineraryRelativeTime = (index, itinerary, itineraries) => {
  const previousLegArrivalTime = getArrivalTime(itineraries[index - 1]);
  const nextLegDepartureTime = getDepartureTime(itinerary);
  return (
    <div className="font__light">
      {calculateTimeDifference(
        toDateTimeList(previousLegArrivalTime, nextLegDepartureTime), undefined, STRINGS.LATER_TEXT,
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
  movementMode: getMovementMode,
  iconDescription: getIconDescription,
  modeIcon: getMovementModeIcon,
  movementItinerary: getMovementItinerary,
  itinFlightNumber: getItineraryFlightNumber,
  itinDepartureCountryCode: getItineraryDepartureCountryCode,
  itinArrivalCountryCode: getItineraryArrivalCountryCode,
  itinRelativeTime: toItineraryRelativeTime,
  relistStatus: getRelistedStatus,
  updatedStatus: getUpdatedStatus,
  iataToCity: getCityByIataCode,
  voyageText: toVoyageText,
  getNamedPassenger,
  hasCarrierCounts,
  hasCheckinDate,
  hasDepartureTime,
  hasDriver,
  hasEta,
  hasTaskVersionPassengers,
  hasTrailer,
  hasVehicle,
  hasVehicleMake,
  hasVehicleModel,
  isSinglePassenger,
  isTaskDetailsPassenger,
  isValid,
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
  getNamedPassenger,
  hasCarrierCounts,
  hasCheckinDate,
  hasDepartureTime,
  hasDriver,
  hasEta,
  hasTaskVersionPassengers,
  hasTrailer,
  hasVehicle,
  hasVehicleMake,
  hasVehicleModel,
  isSinglePassenger,
  isTaskDetailsPassenger,
  isValid,
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
  getMovementModeIcon,
};
