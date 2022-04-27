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
        <div key={index} className="thin-border govuk-!-margin-top-1">
          <span className="font__bold">{BookingUtil.paymentAmount(payment)}</span>
          <br />
          <span className="font__regular">
            Credit card ending {BookingUtil.cardLastFourDigits(payment)}, expiry {BookingUtil.cardExpiry(payment)}
          </span>
        </div>
      );
    });
  }
};

const Booking = ({ version }) => {
  const booking = BookingUtil.get(version);
  const ticket = BookingUtil.bookingTicket(booking);
  const agent = BookingUtil.agent(booking);

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
        <span className="font__light">Payments</span>
      </div>
      {toPayments(booking)}
      <div className="govuk-task-details-grid-column govuk-!-margin-top-3">
        <div>
          <ul>
            <li className="govuk-grid-key font__light">Agent name</li>
            <li className="govuk-grid-value font__bold">{BookingUtil.agentName(agent)}</li>
          </ul>
        </div>
        <div>
          <ul>
            <li className="govuk-grid-key font__light">Agent IATA</li>
            <li className="govuk-grid-value font__bold">{BookingUtil.agentIata(agent)}</li>
          </ul>
        </div>
        <div>
          <ul>
            <li className="govuk-grid-key font__light">Agent location</li>
            <li className="govuk-grid-value font__bold">{BookingUtil.agentLocation(agent)}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Booking;
