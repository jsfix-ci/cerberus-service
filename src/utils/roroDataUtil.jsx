import generateTotalPassengers from './passengersGenerator';

// Passengers data within roroData will be overwritten the new passeners count.
const modify = (roroData) => {
  const modifiedPassengers = generateTotalPassengers(roroData.driver, roroData.passengers);
  roroData.passengers = modifiedPassengers;
  return roroData;
};

export default modify;
