import React from 'react';
import {
  DATE_FORMATS,
  STRINGS,
} from '../../../../utils/constants';
import { BookingUtil,
  PersonUtil,
  DateTimeUtil,
  JourneyUtil } from '../../../../utils';

import renderBlock from '../../helper/common';
import { calculateTimeDifference } from '../../../../utils/Datetime/datetimeUtil';

// TODO: This is a duplicate of the one found in the roro Booking component.
const toBookingTimeDifference = (date, version) => {
  if (!DateTimeUtil.validate(date)) {
    return STRINGS.UNKNOWN_TEXT;
  }
  const journey = JourneyUtil.get(version);
  const departureTime = JourneyUtil.departureTime(journey);
  const dateTimeList = DateTimeUtil.toList(date, departureTime);
  return calculateTimeDifference(dateTimeList).replace(
    STRINGS.DAYJS_FUTURE,
    STRINGS.DAYJS_FUTURE_AIRPAX_REPLACE,
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
          DateTimeUtil.format(BookingUtil.bookedAt(booking), DATE_FORMATS.LONG),
          toBookingTimeDifference(BookingUtil.bookedAt(booking), version),
        ])}
        {renderBlock('Check-in date', [DateTimeUtil.format(BookingUtil.checkInAt(booking), DATE_FORMATS.LONG),
          toBookingTimeDifference(BookingUtil.checkInAt(booking), version)])}
        {renderBlock('Booking country', [
          `${BookingUtil.countryName(booking)} (${BookingUtil.countryCode(booking)})`,
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
