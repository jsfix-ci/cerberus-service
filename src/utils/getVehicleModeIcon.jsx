import { RORO_ACCOMPANIED_ICON, RORO_TOURIST, RORO_TOURIST_CAR_ICON, RORO_TOURIST_GROUP_ICON, RORO_TOURIST_INDIVIDUAL_ICON, RORO_UNACCOMPANIED_FREIGHT, RORO_UNACCOMPANIED_ICON, RORO_VAN_ICON } from '../constants';

const isVehiclePresent = (vehicle) => {
  return vehicle.registrationNumber && vehicle.registrationNumber !== '';
};

const isIndividualPassenger = (passengers) => {
  return passengers && passengers.length === 1;
};

const getTouristIcon = (vehicle, passengers) => {
  if (isVehiclePresent(vehicle)) {
    return RORO_TOURIST_CAR_ICON;
  }

  if (isIndividualPassenger(passengers)) {
    return RORO_TOURIST_INDIVIDUAL_ICON;
  }

  return RORO_TOURIST_GROUP_ICON;
};

const hasTrailer = (vehicle) => {
  return vehicle.trailer?.regNumber && !vehicle.trailer?.regNumber !== '';
};

const getMovementModeIcon = (movementMode, vehicle, passengers) => {
  if (movementMode === RORO_UNACCOMPANIED_FREIGHT.toUpperCase()) {
    return RORO_UNACCOMPANIED_ICON;
  }

  if (movementMode === RORO_TOURIST.toUpperCase()) {
    return getTouristIcon(vehicle, passengers);
  }

  if (isVehiclePresent(vehicle) && hasTrailer(vehicle)) {
    return RORO_ACCOMPANIED_ICON;
  }

  if (isVehiclePresent(vehicle) && !hasTrailer(vehicle)) {
    return RORO_VAN_ICON;
  }

  return RORO_TOURIST_CAR_ICON;
};

export default getMovementModeIcon;
