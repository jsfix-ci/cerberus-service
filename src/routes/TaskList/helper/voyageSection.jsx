import React from 'react';

import { MOVEMENT_MODES } from '../../../utils/constants';

import AirpaxVoyageSection from '../components/airpax/VoyageSection';
import RoRoVoyageSection from '../components/roro/VoyageSection';

import { JourneyUtil, MovementUtil, PersonUtil, TrailerUtil, VehicleUtil, VesselUtil } from '../../../utils';

const getVoyageComponent = (mode, targetTask, refDataAirlineCodes) => {
  const journey = JourneyUtil.get(targetTask);
  const arrivalTime = JourneyUtil.arrivalTime(journey);
  const flight = MovementUtil.movementFlight(targetTask);
  const vessel = VesselUtil.get(targetTask);
  const vehicle = VehicleUtil.get(targetTask);
  const trailer = TrailerUtil.get(targetTask);
  const description = MovementUtil.description(targetTask);
  const iconDescription = MovementUtil.iconDescription(targetTask);
  const totalPersons = PersonUtil.totalPersons(targetTask);
  const movementType = MovementUtil.movementType(targetTask);
  const movementStatus = MovementUtil.status(targetTask);

  switch (mode) {
    case MOVEMENT_MODES.AIR_PASSENGER: {
      return (
        <AirpaxVoyageSection
          refDataAirlineCodes={refDataAirlineCodes}
          journey={journey}
          flight={flight}
          arrivalTime={arrivalTime}
          description={description}
          movementType={movementType}
          movementStatus={movementStatus}
        />
      );
    }
    case MOVEMENT_MODES.TOURIST:
    case MOVEMENT_MODES.UNACCOMPANIED_FREIGHT:
    case MOVEMENT_MODES.ACCOMPANIED_FREIGHT: {
      return (
        <RoRoVoyageSection
          targetTask={targetTask}
          mode={mode}
          journey={journey}
          vessel={vessel}
          vehicle={vehicle}
          trailer={trailer}
          iconDescription={iconDescription}
          arrivalTime={arrivalTime}
          totalPersons={totalPersons}
        />
      );
    }
    default: {
      return null;
    }
  }
};

export default getVoyageComponent;
