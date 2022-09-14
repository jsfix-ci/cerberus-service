import React from 'react';
import { BaggageUtil, BookingUtil, DocumentUtil, JourneyUtil, MovementUtil, PersonUtil } from '../../../../utils';

const AirpaxMovementSection = ({ person, baggage, booking, journey, flight, document, otherPersons, movementType }) => {
  return (
    <>
      <div className="govuk-grid-item">
        <div>
          <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular secondary-text">
            {movementType}
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
          <li className="govuk-!-font-weight-regular">{BookingUtil.bookedPrior(BookingUtil.bookedAt(booking), JourneyUtil.departureTime(journey))}</li>
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
          <li className="govuk-!-font-weight-regular">{MovementUtil.convertMovementRoute(JourneyUtil.movementRoute(journey))}</li>
        </ul>
      </div>
    </>
  );
};

export default AirpaxMovementSection;
