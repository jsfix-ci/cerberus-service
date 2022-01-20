const hasTaskVersionPassengers = (passengers) => {
  let hasValidPassengers = false;
  for (const passengerChildSets of passengers.childSets) {
    for (const passenger of passengerChildSets.contents) {
      if (passenger.content !== null) {
        hasValidPassengers = true;
        break;
      }
    }
  }
  return hasValidPassengers;
};

const modifyRoRoPassengerTaskDetails = (passenger) => {
  let hasValidPassenger = false;
  for (const passengerDataFieldObj of passenger.contents) {
    if (passengerDataFieldObj.content !== null) {
      hasValidPassenger = true;
      break;
    }
  }
  return hasValidPassenger;
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
    if (modifyRoRoPassengerTaskDetails(passengerChildset)) {
      newPassengersJsonNode.push(passengerChildset);
    }
  });
  version.find((fieldset) => fieldset.propName === 'passengers').childSets = newPassengersJsonNode;
  return version;
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

const hasTrailer = (trailerRegistration) => {
  return trailerRegistration !== null && trailerRegistration !== undefined && trailerRegistration !== '';
};

const hasDriver = (driverName) => {
  return driverName !== null && driverName !== undefined && driverName !== '';
};

export { modifyRoRoPassengersTaskList,
  modifyRoRoPassengersTaskDetails,
  hasTaskVersionPassengers,
  hasVehicle,
  hasVehicleMake,
  hasVehicleModel,
  hasTrailer,
  hasDriver };
