const isDriverPresent = (driver) => {
  return driver?.name && driver?.name !== '' && driver?.name !== null;
};

const hasPassengers = (passengers) => {
  return passengers && passengers?.length > 0;
};

// Driver if available, will now be included in the passengers list
// therefore making person at index 0 the primary traveller.
const generateTotalPassengers = (driver, passengers) => {
  let totalPassengers = [];
  if (isDriverPresent(driver)) {
    totalPassengers.push(driver);
  }
  if (hasPassengers(passengers)) {
    passengers.map((passenger) => {
      totalPassengers.push(passenger);
    });
  }
  return totalPassengers;
};

export default generateTotalPassengers;
