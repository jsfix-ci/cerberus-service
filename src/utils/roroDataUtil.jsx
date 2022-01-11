import generateTotalPassengers from './passengersGenerator';

const modify = (roroData) => {
  const modifiedPassengers = generateTotalPassengers(roroData.driver, roroData.passengers);
  roroData.passengers = modifiedPassengers;
  return roroData;
};

export default modify;
