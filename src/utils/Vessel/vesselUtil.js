import { STRINGS } from '../constants';

const getVesselOperator = (vessel) => {
  if (!vessel) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return vessel?.operator || STRINGS.UNKNOWN_TEXT;
};

const getVesselName = (vessel) => {
  if (!vessel) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return vessel?.name || STRINGS.UNKNOWN_TEXT;
};

const getVessel = (targetTask) => {
  return targetTask?.movement?.vessel || undefined;
};

const VesselUtil = {
  get: getVessel,
  name: getVesselName,
  operator: getVesselOperator,
};

export default VesselUtil;
