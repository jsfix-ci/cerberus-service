import React from 'react';
import {
  LONG_DATE_FORMAT,
  DAYJS_FUTURE,
  DAYJS_FUTURE_AIXPAX_REPLACE,
  UNKNOWN_TEXT,
} from '../../../../constants';
import {
  BookingUtil,
  PersonUtil,
  DateTimeUtil,
  MovementUtil,
} from '../../utils';

import renderBlock from './helper/common';
import { calculateTimeDifference } from '../../../../utils/DatetimeUtil';

const toBookingTimeDiference = (date, version) => {
  if (!DateTimeUtil.validate(date)) {
    return UNKNOWN_TEXT;
  }
  const journey = MovementUtil.movementJourney(version);
  const departureTime = MovementUtil.departureTime(journey);
  const dateTimeList = DateTimeUtil.toList(date, departureTime);
  return calculateTimeDifference(dateTimeList).replace(
    DAYJS_FUTURE,
    DAYJS_FUTURE_AIXPAX_REPLACE,
  );
};

const Booking = ({ version }) => {
  const booking = BookingUtil.get(version);
  const tickets = BookingUtil.bookingTickets(booking);
  const agent = BookingUtil.agent(booking);

  return (
    <div className="task-details-container">
      <h3 className="govuk-heading-m govuk-!-margin-top-0">Booking</h3>
      <div className="govuk-task-details-grid-column">
        {renderBlock('Reference', [BookingUtil.bookingRef(booking)])}
        {renderBlock('Number of travellers', [
          PersonUtil.totalPersons(version),
        ])}
        {renderBlock('Booking date', [
          DateTimeUtil.format(BookingUtil.bookedAt(booking), LONG_DATE_FORMAT),
          toBookingTimeDiference(BookingUtil.bookedAt(booking), version),
        ])}
        {renderBlock('Check-in date', [DateTimeUtil.format(BookingUtil.checkInAt(booking), LONG_DATE_FORMAT),
          toBookingTimeDiference(BookingUtil.checkInAt(booking), version)])}
        {renderBlock('Booking country', [
          `${BookingUtil.countryName(booking)} (${BookingUtil.countryCode(
            booking,
          )})`,
        ])}
        {renderBlock('Booking type', [BookingUtil.bookingType(booking)])}
        {renderBlock('Ticket number', [BookingUtil.ticketNumbers(tickets)])}
        {renderBlock('Ticket type', [BookingUtil.ticketTypes(tickets)])}
      </div>
      {BookingUtil.containsPayments(booking) ? (
        <>
          <div className="bottom-border-thin">
            <span className="font__light">Payments</span>
          </div>
          {BookingUtil.paymentsBlock(booking)}
        </>
      ) : <div className="bottom-border-thin" />}
      <div className="govuk-task-details-grid-column govuk-!-margin-top-3">
        {renderBlock('Agent IATA', [BookingUtil.agentIata(agent)])}
        {renderBlock('Agent location', [BookingUtil.agentLocation(agent)])}
      </div>
    </div>
  );
};

export default Booking;
