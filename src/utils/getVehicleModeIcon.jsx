import { RORO_TOURIST, RORO_TOURIST_CAR_ICON, RORO_TOURIST_GROUP_ICON, RORO_TOURIST_INDIVIDUAL_ICON } from '../constants';

const getMovementModeIcon = (movementMode, vehicle, passengers) => {
  if (movementMode === RORO_TOURIST.toUpperCase()) {
    if (vehicle.registrationNumber && vehicle.registrationNumber !== '') return RORO_TOURIST_CAR_ICON;
    if (passengers && passengers.length === 1) return RORO_TOURIST_INDIVIDUAL_ICON;
    if (passengers && passengers.length > 1) return RORO_TOURIST_GROUP_ICON;
  }
  if (vehicle.registrationNumber && !vehicle.trailer.regNumber) return 'c-icon-van';
  if (vehicle.registrationNumber && vehicle.trailer.regNumber) return 'c-icon-hgv';
  return RORO_TOURIST_CAR_ICON;
};

export default getMovementModeIcon;
