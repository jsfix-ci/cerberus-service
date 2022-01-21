import { RORO_TOURIST } from '../constants';
import { hasVehicle, hasTrailer } from './roroDataUtil';

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const formatMovementModeIconText = (roroData, movementMode) => {
  let output = '';
  if (movementMode === RORO_TOURIST) {
    output += hasVehicle(roroData.vehicle?.registrationNumber) ? 'Vehicle' : '';
  } else {
    output += hasVehicle(roroData.vehicle?.registrationNumber) ? 'Vehicle' : '';
    output += (hasVehicle(roroData.vehicle?.registrationNumber) && hasTrailer(roroData.vehicle?.trailer?.regNumber))
      ? ' with ' : '';
    output += hasTrailer(roroData?.vehicle?.trailer?.regNumber) ? 'Trailer' : '';
  }
  return output;
};

export { capitalizeFirstLetter, formatMovementModeIconText };
