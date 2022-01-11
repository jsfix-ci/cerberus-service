import generateTotalPassengers from './passengersGenerator';

// Passengers data within roroData will be overwritten the new passeners count.
const modify = (roroData) => {
  roroData.passengers = generateTotalPassengers(roroData.driver, roroData.passengers);
  return roroData;
};

export default modify;
