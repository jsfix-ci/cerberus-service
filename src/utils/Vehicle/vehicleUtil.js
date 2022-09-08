import { STRINGS } from '../constants';

const getVehicleType = (vehicle) => {
  if (!vehicle) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return vehicle?.type || STRINGS.UNKNOWN_TEXT;
};

const getVehicleNationality = (vehicle) => {
  if (!vehicle) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return vehicle?.nationality || STRINGS.UNKNOWN_TEXT;
};

const getVehicleColour = (vehicle) => {
  if (!vehicle) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return vehicle?.colour || STRINGS.UNKNOWN_TEXT;
};

const getVehicleRegistration = (vehicle) => {
  if (!vehicle) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return vehicle?.registration || STRINGS.UNKNOWN_TEXT;
};

const getVehicleModel = (vehicle) => {
  if (!vehicle) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return vehicle?.model || STRINGS.UNKNOWN_TEXT;
};

const getVehicleMake = (vehicle) => {
  if (!vehicle) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return vehicle?.make || STRINGS.UNKNOWN_TEXT;
};

const getVehicle = (targetTask) => {
  return targetTask?.movement?.vehicle || undefined;
};

const VehicleUtil = {
  get: getVehicle,
  colour: getVehicleColour,
  make: getVehicleMake,
  model: getVehicleModel,
  nationality: getVehicleNationality, // TODO
  type: getVehicleType, // TODO
  registration: getVehicleRegistration,
};

export default VehicleUtil;

export {
  getVehicle,
  getVehicleColour,
  getVehicleMake,
  getVehicleModel,
  getVehicleRegistration,
};
