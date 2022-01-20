import { hasVehicle, hasTrailer } from './roroDataUtil';

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const formatTaskIconText = (roroData) => {
  let output = '';
  output += hasVehicle(roroData.vehicle?.registrationNumber) ? 'Vehicle' : '';
  output += (hasVehicle(roroData.vehicle?.registrationNumber) && hasTrailer(roroData.vehicle?.trailer?.regNumber)) ? ' with ' : '';
  output += hasTrailer(roroData?.vehicle?.trailer?.regNumber) ? 'Trailer' : '';
  return output;
};

export { capitalizeFirstLetter, formatTaskIconText };
