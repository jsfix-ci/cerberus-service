import React from 'react';

import { ICON, ICON_MAPPING, MOVEMENT_MODES } from '../../../utils/constants';

import AirpaxVersionDetails from '../components/airpax/AirpaxVersionDetails';
import AccompaniedVersionDetails from '../components/roro/AccompaniedVersionDetails';
import TouristIndividualVersionDetails from '../components/roro/tourist/individual/TouristIndividualVersionDetails';
import TouristGroupVersionDetails from '../components/roro/tourist/group/TouristGroupVersionDetails';
import TouristVehicleVersionDetails from '../components/roro/TouristVehicleVersionDetails';
import UnaccompaniedVersionDetails from '../components/roro/UnaccompaniedVersionDetails';

import { MovementUtil } from '../../../utils';

const getVersionDetails = (mode, version) => {
  switch (mode) {
    case MOVEMENT_MODES.AIR_PASSENGER: {
      return <AirpaxVersionDetails version={version} />;
    }
    case MOVEMENT_MODES.ACCOMPANIED_FREIGHT: {
      return <AccompaniedVersionDetails version={version} />;
    }
    case MOVEMENT_MODES.UNACCOMPANIED_FREIGHT: {
      return <UnaccompaniedVersionDetails version={version} />;
    }
    case MOVEMENT_MODES.TOURIST: {
      const iconDescription = MovementUtil.iconDescription(version);
      const iconFromDescription = ICON_MAPPING[mode]?.[iconDescription];
      if (iconFromDescription === ICON.INDIVIDUAL) {
        return <TouristIndividualVersionDetails version={version} />;
      }
      if (iconFromDescription === ICON.GROUP) {
        return <TouristGroupVersionDetails version={version} />;
      }
      return <TouristVehicleVersionDetails version={version} />;
    }
    default: {
      return null;
    }
  }
};

export default getVersionDetails;
