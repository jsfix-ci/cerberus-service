const isDriverPresent = (driver) => {
  return driver?.name && driver?.name !== '' && driver?.name !== null;
};

const hasPassengers = (passengers) => {
  return passengers && passengers?.length > 0;
};

// Driver if available, will now be included in the passengers list
// therefore making person at index 0 the primary traveller.
const generateTotalPassengers = (driver, passengers) => {
  let newPassengersArray = [];
  if (isDriverPresent(driver)) {
    newPassengersArray.push(driver);
  }
  if (hasPassengers(passengers)) {
    passengers.map((passenger) => {
      newPassengersArray.push(passenger);
    });
  }
  return newPassengersArray;
};

export default generateTotalPassengers;
