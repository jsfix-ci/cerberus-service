import React from 'react';

import AirpaxTaskSummary from '../components/airpax/AirpaxTaskSummary';
import RoRoTaskSummary from '../components/roro/RoRoTaskSummary';

import { MOVEMENT_MODES } from '../../../utils/constants';

const getVoyageComponent = (mode, version, refDataAirlineCodes) => {
  switch (mode) {
    case MOVEMENT_MODES.AIR_PASSENGER: {
      return <AirpaxTaskSummary refDataAirlineCodes={refDataAirlineCodes} version={version} />;
    }
    case MOVEMENT_MODES.TOURIST:
    case MOVEMENT_MODES.UNACCOMPANIED_FREIGHT:
    case MOVEMENT_MODES.ACCOMPANIED_FREIGHT: {
      return <RoRoTaskSummary version={version} />;
    }
    default: {
      return null;
    }
  }
};

export default getVoyageComponent;
