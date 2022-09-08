import React from 'react';

import AirpaxVersionDetails from '../components/airpax/AirpaxVersionDetails';

import { MOVEMENT_MODES } from '../../../utils/constants';
import AccompaniedVersionDetails from '../components/roro/AccompaniedVersionDetails';

const getVersionDetails = (mode, version) => {
  switch (mode) {
    case MOVEMENT_MODES.AIR_PASSENGER: {
      return <AirpaxVersionDetails version={version} />;
    }
    case MOVEMENT_MODES.ACCOMPANIED_FREIGHT: {
      return <AccompaniedVersionDetails version={version} />;
    }
    case MOVEMENT_MODES.UNACCOMPANIED_FREIGHT: {
      break;
    }
    case MOVEMENT_MODES.TOURIST: {
      break;
    }
    default: {
      return null;
    }
  }
};

export default getVersionDetails;
