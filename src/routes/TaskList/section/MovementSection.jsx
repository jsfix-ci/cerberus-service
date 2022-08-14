import React from 'react';

import { ICON, ICON_MAPPING, MOVEMENT_MODES, VIEW } from '../../../utils/constants';

import { BaggageUtil, BookingUtil, DocumentUtil, MovementUtil, PersonUtil } from '../../../utils';

const TouristSection = ({ iconFromDescription }) => {
  if (iconFromDescription === ICON.CAR) {
    return (
      <>
        <div className="govuk-grid-item">
          <div>
            <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular secondary-text">
              Driver
            </h3>
            <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0" />
          </div>
        </div>

        <div className="govuk-grid-item vertical-dotted-line">
          <div>
            <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular secondary-text">
              VRN
            </h3>
            <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0" />
          </div>
        </div>

        <div className="govuk-grid-item vertical-dotted-line">
          <div>
            <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular secondary-text">
              Booking
            </h3>
            <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0" />
          </div>
        </div>

        <div className="govuk-grid-item vertical-dotted-line">
          <div>
            <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular secondary-text">
              Co-travellers
            </h3>
            <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0" />
          </div>
        </div>
      </>
    );
  }
  if (iconFromDescription === ICON.INDIVIDUAL || iconFromDescription === ICON.GROUP) {
    return (
      <>
        <div className="govuk-grid-item">
          <div>
            <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular secondary-text">
              Primary traveller
            </h3>
            <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0" />
          </div>
        </div>

        <div className="govuk-grid-item vertical-dotted-line">
          <div>
            <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular secondary-text">
              Document
            </h3>
            <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0" />
          </div>
        </div>

        <div className="govuk-grid-item vertical-dotted-line">
          <div>
            <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular secondary-text">
              Booking
            </h3>
            <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0" />
          </div>
        </div>

        <div className="govuk-grid-item vertical-dotted-line">
          <div>
            <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular secondary-text">
              Co-travellers
            </h3>
            <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0" />
          </div>
        </div>
      </>
    );
  }
};

const RoRoSection = ({ targetTask }) => {
  const mode = MovementUtil.movementMode(targetTask);
  if (mode === MOVEMENT_MODES.ACCOMPANIED_FREIGHT) {
    return (
      <>
        <div className="govuk-grid-item">
          <div>
            <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular secondary-text">
              Driver details
            </h3>
            <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0" />
          </div>
          <div>
            <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular secondary-text">
              Passenger details
            </h3>
            <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0" />
          </div>
        </div>

        <div className="govuk-grid-item vertical-dotted-line">
          <div>
            <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular secondary-text">
              Vehicle details
            </h3>
            <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0" />
          </div>
          <div>
            <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular secondary-text">
              Trailer details
            </h3>
            <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0" />
          </div>
        </div>

        <div className="govuk-grid-item vertical-dotted-line">
          <div>
            <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular secondary-text">
              Haulier details
            </h3>
            <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0" />
          </div>
          <div>
            <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular secondary-text">
              Account details
            </h3>
            <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0" />
          </div>
        </div>

        <div className="govuk-grid-item vertical-dotted-line">
          <div>
            <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular secondary-text">
              Goods description
            </h3>
            <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0" />
          </div>
        </div>
      </>
    );
  }
  if (mode === MOVEMENT_MODES.UNACCOMPANIED_FREIGHT) {
    return (
      <>
        <div className="govuk-grid-item">
          <div>
            <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular secondary-text">
              Trailer details
            </h3>
            <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0" />
          </div>
        </div>

        <div className="govuk-grid-item vertical-dotted-line">
          <div>
            <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular secondary-text">
              Haulier details
            </h3>
            <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0" />
          </div>
          <div>
            <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular secondary-text">
              Account details
            </h3>
            <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0" />
          </div>
        </div>

        <div className="govuk-grid-item vertical-dotted-line">
          <div>
            <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular secondary-text">
              Goods description
            </h3>
            <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0" />
          </div>
        </div>

        <div className="govuk-grid-item vertical-dotted-line" />
      </>
    );
  }
  if (mode === MOVEMENT_MODES.TOURIST) {
    const description = MovementUtil.iconDescription(targetTask);
    return <TouristSection iconFromDescription={ICON_MAPPING[mode]?.[description]} />;
  }
};

const AirpaxSection = ({ targetTask }) => {
  const person = PersonUtil.get(targetTask);
  const baggage = BaggageUtil.get(targetTask);
  const booking = BookingUtil.get(targetTask);
  const journey = MovementUtil.movementJourney(targetTask);
  const flight = MovementUtil.movementFlight(targetTask);
  const document = DocumentUtil.get(person);
  const otherPersons = PersonUtil.getOthers(targetTask);
  return (
    <>
      <div className="govuk-grid-item">
        <div>
          <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular secondary-text">
            {MovementUtil.movementType(targetTask)}
          </h3>
          <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0">
            <li className="govuk-!-font-weight-bold">{PersonUtil.lastname(person)}, </li>
            <li className="govuk-!-font-weight-regular">{PersonUtil.firstname(person)}</li>
          </ul>
          <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0">
            <li className="govuk-!-font-weight-regular">{PersonUtil.gender(person)}, </li>
            <li className="govuk-!-font-weight-regular">{PersonUtil.dob(person)}, </li>
            <li className="govuk-!-font-weight-regular">{PersonUtil.nationality(person)}</li>
          </ul>
          <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0 secondary-text">
            <li className="govuk-!-font-weight-regular">{BaggageUtil.checked(baggage)}, </li>
            <li className="govuk-!-font-weight-regular">{BaggageUtil.weight(baggage)} </li>
          </ul>
          <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0 secondary-text">
            <li className="govuk-!-font-weight-regular">{BookingUtil.toCheckInText(booking)}, </li>
            <li className="govuk-!-font-weight-regular">{MovementUtil.seatNumber(flight)} </li>
          </ul>
        </div>
      </div>

      <div className="govuk-grid-item vertical-dotted-line">
        <div>
          <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular secondary-text">
            Document
          </h3>
          <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0">
            <li className="govuk-!-font-weight-bold">{DocumentUtil.docNumber(document)} ({PersonUtil.nationality(person)})</li>
          </ul>
          <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0 secondary-text">
            <li className="govuk-!-font-weight-regular">{DocumentUtil.docValidity(document)}</li>
          </ul>
          <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0 secondary-text">
            <li className="govuk-!-font-weight-regular">{DocumentUtil.docExpiry(document)}</li>
          </ul>
          <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0 secondary-text">
            <li className="govuk-!-font-weight-regular">{DocumentUtil.docCountry(document)}</li>
          </ul>
        </div>
      </div>

      <div className="govuk-grid-item vertical-dotted-line">
        <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular secondary-text">
          Booking
        </h3>
        <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0">
          <li className="govuk-!-font-weight-bold">{BookingUtil.bookingRef(booking)}</li>
        </ul>
        <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0">
          <li className="govuk-!-font-weight-regular">{BookingUtil.toBookingText(booking)}</li>
        </ul>
        <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0 secondary-text">
          <li className="govuk-!-font-weight-regular">{BookingUtil.bookedPrior(BookingUtil.bookedAt(booking), MovementUtil.departureTime(journey))}</li>
        </ul>
      </div>

      <div className="govuk-grid-item vertical-dotted-line">
        <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular secondary-text">
          Co-travellers
        </h3>
        <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0">
          {PersonUtil.toOthers(otherPersons)}
        </ul>
        <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular secondary-text">
          Route
        </h3>
        <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0">
          <li className="govuk-!-font-weight-regular">{MovementUtil.convertMovementRoute(MovementUtil.movementRoute(journey))}</li>
        </ul>
      </div>
    </>
  );
};

const MovementSection = ({ view, targetTask }) => {
  if (view === VIEW.AIRPAX) {
    return <AirpaxSection targetTask={targetTask} />;
  }
  if (view === VIEW.RORO_V2) {
    return <RoRoSection targetTask={targetTask} />;
  }
};

export default MovementSection;
