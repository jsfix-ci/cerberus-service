const isDriverPresent = (driver) => {
  return driver?.name && driver?.name !== '' && driver?.name !== null;
};

const hasPassengers = (passengers) => {
  return passengers && passengers?.length > 0;
};

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
