import React from 'react';
import airports from '@nitro-land/airport-codes';
import lookup from 'country-code-lookup';
import { Tag } from '@ukhomeoffice/cop-react-components';

import {
  DEPARTURE_STATUS,
  STRINGS,
  ICON,
  MOVEMENT_DESCRIPTION,
  MOVEMENT_MODES,
  MOVEMENT_ROLE,
  TASK_STATUS,
  TASK_OUTCOME,
} from '../constants';

import { calculateTimeDifference,
  isInPast,
  toDateTimeList,
  toRelativeTime } from '../Datetime/datetimeUtil';
import { getTotalNumberOfPersons } from '../Person/personUtil';
import CommonUtil from '../Common/commonUtil';
import JourneyUtil from '../Journey/journeyUtil';

const getOccupantCounts = (targetTask) => {
  return targetTask?.movement?.occupants || undefined;
};

const getOutcomeTagBlock = (outcome) => {
  let outcomeText;
  let outcomeClass = 'genericOutcome';
  switch (outcome) {
    case TASK_OUTCOME.POSITIVE:
      outcomeText = 'Positive Exam';
      outcomeClass = 'positiveOutcome';
      break;
    case TASK_OUTCOME.NEGATIVE:
      outcomeText = 'Negative Exam';
      break;
    case TASK_OUTCOME.NO_SHOW:
      outcomeText = 'No Show';
      break;
    case TASK_OUTCOME.MISSED:
      outcomeText = 'Missed Target';
      break;
    case TASK_OUTCOME.INSUFFICIENT_RESOURCES:
      outcomeText = 'Insufficient Resources';
      break;
    case TASK_OUTCOME.TARGET_WITHDRAWN:
      outcomeText = 'Target Withdrawn';
      break;
    default:
      break;
  }
  return (
    outcomeText && (
      <p className={`govuk-body govuk-tag govuk-tag--${outcomeClass}`}>
        {outcomeText}
      </p>
    )
  );
};

const getOutcomeFrontlineArrests = (outcome) => {
  if (!outcome) {
    return false;
  }
  return outcome?.arrests;
};

const getOutcomeFrontlineOfficer = (outcome) => {
  if (!outcome) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return outcome?.frontlineOfficer || STRINGS.UNKNOWN_TEXT;
};

const getOutcomeStatusTag = (outcome) => {
  if (!outcome) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return getOutcomeTagBlock(TASK_OUTCOME[outcome?.status]) || STRINGS.UNKNOWN_TEXT;
};

const getOutcome = (targetTask) => {
  return targetTask?.outcome || undefined;
};

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

const toFormattedLocation = (location) => {
  if (!location) {
    return STRINGS.UNKNOWN_TEXT;
  }
  const airport = getByIataCode(location);
  return airport ? `${airport.get('city')}, ${airport.get('country')}` : STRINGS.UNKNOWN_TEXT;
};

/**
 * If country code is not provided, it will use the arrival location
 * to extract the arrival country code.
 */
const getItineraryArrivalCountryCode = (itinerary) => {
  if (!itinerary?.arrival?.country) {
    const arrivalLoc = JourneyUtil.arrivalLoc(itinerary);
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
  return CommonUtil.iso3Code(itinerary.arrival.country);
};

/**
 * If country code is not provided, it will use the departure location
 * to extract the arrival country code.
 */
const getItineraryDepartureCountryCode = (itinerary) => {
  if (!itinerary?.departure?.country) {
    const departureLoc = JourneyUtil.departureLoc(itinerary);
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
  return CommonUtil.iso3Code(itinerary.departure.country);
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
  const previousLegArrivalTime = JourneyUtil.arrivalTime((itineraries[index - 1]));
  const nextLegDepartureTime = JourneyUtil.departureTime((itinerary));
  return (
    <div className="font__light">
      {calculateTimeDifference(
        toDateTimeList(previousLegArrivalTime, nextLegDepartureTime), undefined, STRINGS.LATER_TEXT,
      )}
    </div>
  );
};

const getBusinessKey = (targetTask) => {
  return targetTask?.id || STRINGS.UNKNOWN_TEXT;
};

const MovementUtil = {
  businessKey: getBusinessKey,
  outcome: getOutcome,
  outcomeStatusTag: getOutcomeStatusTag,
  outcomeFLO: getOutcomeFrontlineOfficer,
  outcomeFLOArrests: getOutcomeFrontlineArrests,
  convertMovementRoute: toRoute,
  seatNumber: getSeatNumber,
  movementFlight: getFlight,
  flightNumber: getFlightNumber,
  airlineOperator: getAirlineOperator,
  status: getDepartureStatus,
  movementType: getMovementTypeText,
  description: toDescriptionText,
  airlineName: toAirlineName,
  formatLoc: toFormattedLocation,
  movementMode: getMovementMode,
  iconDescription: getIconDescription,
  modeIcon: getMovementModeIcon,
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
  occupantCounts: getOccupantCounts, // TODO
};

export default MovementUtil;

export {
  toRoute,
  getBusinessKey,
  getSeatNumber,
  getFlight,
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
  getFlightNumber,
  getAirlineOperator,
  getDepartureStatus,
  getMovementTypeText,
  toDescriptionText,
  toAirlineName,
  toFormattedLocation,
  getItineraryFlightNumber,
  getItineraryDepartureCountryCode,
  getItineraryArrivalCountryCode,
  toItineraryRelativeTime,
  getRelistedStatus,
  getUpdatedStatus,
  getCityByIataCode,
  toVoyageText,
  getMovementModeIcon,
};
