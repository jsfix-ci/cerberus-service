import React from 'react';
import { AccountUtil, BaggageUtil, BookingUtil, DocumentUtil, GoodsUtil, HaulierUtil, MovementUtil, PersonUtil, VehicleUtil } from '../../../utils';
import TrailerUtil from '../../../utils/Trailer/trailerUtil';
import DatetimeUtil from '../../../utils/Datetime/datetimeUtil';
import { MOVEMENT_MODES } from '../../../utils/constants';

import AirpaxMovementSection from '../components/airpax/AirpaxMovementSection';
import AccompaniedMovementSection from '../components/roro/AccompaniedMovementSection';
import UnaccompaniedMovementSection from '../components/roro/UnaccompaniedMovementSection';
import TouristMovementSection from '../components/roro/TouristMovementSection';

const getMovementComponent = (mode, targetTask) => {
  const person = PersonUtil.get(targetTask);
  const baggage = BaggageUtil.get(targetTask);
  const booking = BookingUtil.get(targetTask);
  const journey = MovementUtil.movementJourney(targetTask);
  const flight = MovementUtil.movementFlight(targetTask);
  const document = DocumentUtil.get(person);
  const otherPersons = PersonUtil.getOthers(targetTask);
  const movementType = MovementUtil.movementType(targetTask);
  const vehicle = VehicleUtil.get(targetTask);
  const trailer = TrailerUtil.get(targetTask);
  const haulier = HaulierUtil.get(targetTask);
  const account = AccountUtil.get(targetTask);
  const goods = GoodsUtil.get(targetTask);
  const bookingDepartureTime = DatetimeUtil.toList(BookingUtil.bookedAt(booking), MovementUtil.departureTime(journey));

  switch (mode) {
    case MOVEMENT_MODES.AIR_PASSENGER: {
      return (
        <AirpaxMovementSection
          person={person}
          baggage={baggage}
          booking={booking}
          journey={journey}
          flight={flight}
          document={document}
          otherPersons={otherPersons}
          movementType={movementType}
        />
      );
    }
    case MOVEMENT_MODES.ACCOMPANIED_FREIGHT: {
      return (
        <AccompaniedMovementSection
          person={person}
          vehicle={vehicle}
          trailer={trailer}
          haulier={haulier}
          account={account}
          booking={booking}
          goods={goods}
          bookingDepartureTime={bookingDepartureTime}
          othersCount={otherPersons.length}
        />
      );
    }
    case MOVEMENT_MODES.UNACCOMPANIED_FREIGHT: {
      return (
        <UnaccompaniedMovementSection
          trailer={trailer}
          haulier={haulier}
          account={account}
          booking={booking}
          goods={goods}
          bookingDepartureTime={bookingDepartureTime}
        />
      );
    }
    case MOVEMENT_MODES.TOURIST: {
      return (
        <TouristMovementSection targetTask={targetTask} />
      );
    }
    default: {
      return null;
    }
  }
};

export default getMovementComponent;
