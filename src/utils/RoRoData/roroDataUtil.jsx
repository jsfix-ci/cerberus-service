import lookup from 'country-code-lookup';
import { DEFAULT_APPLIED_RORO_FILTER_STATE } from '../constants';
import { getNamedPassenger, isTaskDetailsPassenger, hasCheckinDate, hasDepartureTime } from '../Movement/movementUtil';

const getTaskDetailsTotalOccupants = (passengersMetadata) => {
  if (passengersMetadata) {
    const radix = 10;
    return parseInt(passengersMetadata.contents.find(({ propName }) => propName === 'totalOccupants').content, radix);
  }
  return 0;
};

const filterKnownPassengers = (passengers) => {
  return passengers.filter((passenger) => {
    if (passenger?.name) {
      return passenger;
    }
    return getNamedPassenger(passenger);
  });
};

// Driver if available, will now be included in the passengers list
// therefore making person at index 0 the primary traveller.
const generateTotalPassengers = (driver, passengers) => {
  let totalPassengers = [];
  if (driver && driver?.name && driver?.name !== '' && driver?.name !== null) {
    totalPassengers.push(driver);
  }
  if (passengers && passengers?.length > 0) {
    passengers.map((passenger) => {
      totalPassengers.push(passenger);
    });
  }
  return totalPassengers;
};

// Passengers data within roroData will be overwritten the new passeners count (task list page).
const modifyRoRoPassengersTaskList = (roroData) => {
  roroData.passengers = generateTotalPassengers(roroData.driver, roroData.passengers);
  return roroData;
};

/*
* This method would modify the country code using country-code-lookup npm module
*/
const modifyCountryCodeIfPresent = (bookingField) => {
  const countryCode = bookingField.contents?.find(({ propName }) => propName === 'country')?.content;
  if (countryCode) {
    if (countryCode.length > 2 || lookup.byIso(countryCode) === null) {
      return bookingField;
    }
    const countryName = lookup.byIso(countryCode) !== null ? lookup.byIso(countryCode).country : 'Unknown';
    bookingField.contents.find(({ propName }) => propName === 'country').content = `${countryName} (${countryCode})`;
  }
  return bookingField;
};

/*
* This method will add an object for the Driver
* into the passengers list (BE always nominating a driver
* even in scenarios when there is no vehicles).
*/
const modifyRoRoPassengersTaskDetails = (version) => {
  const newPassengersJsonNode = [];
  const driverNodeContents = version.find((fieldset) => fieldset.propName === 'driver').contents;
  const passengersChildsets = version.find((fieldset) => fieldset.propName === 'passengers').childSets;
  const driverData = [];
  driverNodeContents.map((driverContent) => {
    driverData.push(driverContent);
  });

  const driverToPassengerNode = {
    fieldSetName: '',
    hasChildSet: false,
    contents: driverData,
    type: 'null',
    propName: '',
  };

  newPassengersJsonNode.push(driverToPassengerNode);
  passengersChildsets.map((passengerChildset) => {
    if (isTaskDetailsPassenger(passengerChildset)) {
      newPassengersJsonNode.push(passengerChildset);
    }
  });
  version.find((fieldset) => fieldset.propName === 'passengers').childSets = newPassengersJsonNode;
  return version;
};

const extractTaskVersionsBookingField = (version, taskSummaryData) => {
  const bookingField = JSON.parse(JSON.stringify(version.find(({ propName }) => propName === 'booking')));
  const scheduledDepartureTime = taskSummaryData?.roro?.details?.departureTime;
  if (!hasCheckinDate(bookingField.contents.find(({ propName }) => propName === 'checkIn').content)) {
    return bookingField;
  }
  if (!hasDepartureTime(scheduledDepartureTime)) {
    return bookingField;
  }
  if (bookingField.contents.find(({ propName }) => propName === 'checkIn').type.includes('CHANGED')) {
    bookingField.contents.find(({ propName }) => propName === 'checkIn').type = 'BOOKING_DATETIME-CHANGED';
  } else {
    bookingField.contents.find(({ propName }) => propName === 'checkIn').type = 'BOOKING_DATETIME';
  }
  bookingField.contents.find(({ propName }) => propName === 'checkIn').content += `,${scheduledDepartureTime}`;
  return bookingField;
};

const toRoRoSelectorsValue = (value) => {
  if (!value || value === DEFAULT_APPLIED_RORO_FILTER_STATE.hasSelectors) {
    return null;
  }
  return JSON.parse(value);
};

const RoRoDataUtil = {
  extractTaskVersionsBookingField,
  filterKnownPassengers,
  getTaskDetailsTotalOccupants,
  modifyRoRoPassengersTaskList,
  modifyRoRoPassengersTaskDetails,
  modifyCountryCodeIfPresent,
  toRoRoSelectorsValue,
};

export default RoRoDataUtil;

export {
  extractTaskVersionsBookingField,
  filterKnownPassengers,
  getTaskDetailsTotalOccupants,
  modifyRoRoPassengersTaskList,
  modifyRoRoPassengersTaskDetails,
  modifyCountryCodeIfPresent,
  toRoRoSelectorsValue,
};
