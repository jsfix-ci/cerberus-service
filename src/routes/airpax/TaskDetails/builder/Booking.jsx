import React from 'react';
import { LONG_DATE_FORMAT } from '../../../../constants';
import { BookingUtil, PersonUtil, DateTimeUtil, MovementUtil } from '../../utils';

import calculateTimeDifference from '../../../../utils/calculateDatetimeDifference';

const toBookingTimeDiference = (booking, version) => {
  const journey = MovementUtil.movementJourney(version);
  const departureTime = MovementUtil.departureTime(journey);
  const dateTimeList = DateTimeUtil.toList(BookingUtil.bookedAt(booking), departureTime);
  return calculateTimeDifference(dateTimeList).replace('ago', 'before departure');
};

const toPayments = (booking) => {
  const payments = BookingUtil.payments(booking);
  if (payments) {
    return payments.map((payment, index) => {
      return (
        <div key={index} className="thin-border">
          <span className="font__bold">{BookingUtil.paymentAmount(payment)}</span>
          <br />
          <span className="font__regular">Credit card ending {BookingUtil.cardLastFourDigits(payment)}, expiry </span>
        </div>
      );
    });
  }
};

const Booking = ({ booking, ticket, version }) => {
  return (
    <div className="task-details-container">
      <h3 className="title-heading airpax-title-heading">Booking</h3>
      <div className="govuk-task-details-grid-column">
        <div>
          <ul>
            <li className="govuk-grid-key font__light">Reference</li>
            <li className="govuk-grid-value font__bold">{BookingUtil.bookingRef(booking)}</li>
          </ul>
        </div>
        <div>
          <ul>
            <li className="govuk-grid-key font__light">Number of travellers</li>
            <li className="govuk-grid-value font__bold">{PersonUtil.totalPersons(version)}</li>
          </ul>
        </div>
        <div>
          <ul>
            <li className="govuk-grid-key font__light">Booking date</li>
            <li className="govuk-grid-value font__bold">
              {DateTimeUtil.format(BookingUtil.bookedAt(booking), LONG_DATE_FORMAT)}
            </li>
            <li className="govuk-grid-value font__light">{toBookingTimeDiference(booking, version)}</li>
          </ul>
        </div>
        <div>
          <ul>
            <li className="govuk-grid-key font__light">Booking country</li>
            <li className="govuk-grid-value font__bold">
              {BookingUtil.countryName(booking)} ({BookingUtil.countryCode(booking)})
            </li>
          </ul>
        </div>
        <div>
          <ul>
            <li className="govuk-grid-key font__light">Booking type</li>
            <li className="govuk-grid-value font__bold">{BookingUtil.bookingType(booking)}</li>
          </ul>
        </div>
        <div>
          <ul>
            <li className="govuk-grid-key font__light">Ticket number</li>
            <li className="govuk-grid-value font__bold">{BookingUtil.ticketNumber(ticket)}</li>
          </ul>
        </div>
        <div>
          <ul>
            <li className="govuk-grid-key font__light">Ticket type</li>
            <li className="govuk-grid-value font__bold">{BookingUtil.ticketType(ticket)}</li>
          </ul>
        </div>
      </div>
      <div className="thin-border">
        <span>Payments</span>
      </div>
      {toPayments(booking)}
    </div>
  );
};

export default Booking;
