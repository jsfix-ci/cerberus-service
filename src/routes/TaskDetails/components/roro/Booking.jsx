import React from 'react';
import classNames from 'classnames';

import { DATE_FORMATS, STRINGS } from '../../../../utils/constants';

// Utils
import { BookingUtil, DateTimeUtil } from '../../../../utils';
import renderBlock from '../../helper/common';
import { calculateTimeDifference, toDateTimeList, validateDate } from '../../../../utils/Datetime/datetimeUtil';
import { getDepartureTime, getJourney } from '../../../../utils/Movement/movementUtil';

// TODO: This is a duplicate of the one found in the airpax Booking component.
const toBookingTimeDifference = (date, version) => {
  if (!validateDate(date)) {
    return STRINGS.UNKNOWN_TEXT;
  }
  const journey = getJourney(version);
  const departureTime = getDepartureTime(journey);
  const dateTimeList = toDateTimeList(date, departureTime);
  return calculateTimeDifference(dateTimeList).replace(
    STRINGS.DAYJS_FUTURE,
    STRINGS.DAYJS_FUTURE_AIRPAX_REPLACE,
  );
};

const Booking = ({ version, classModifiers }) => {
  const booking = BookingUtil.get(version);
  const tickets = BookingUtil.bookingTickets(booking);
  return (
    <div className={classNames('task-details-container', classModifiers)}>
      <h3 className="govuk-heading-m govuk-!-margin-top-0">Booking and check-in</h3>
      <div className="govuk-task-details-grid-column">
        {renderBlock('Reference', [BookingUtil.bookingRef(booking)])}
        {renderBlock('Ticket number', [BookingUtil.ticketNumbers(tickets)])}
        {renderBlock('Type', [BookingUtil.ticketTypes(tickets)])}
        {renderBlock('Name', [BookingUtil.bookingName(booking)])}
        {renderBlock('Address', [BookingUtil.bookingAddress(booking)])}
        {renderBlock('Booking date and time', [
          DateTimeUtil.format(BookingUtil.bookedAt(booking), DATE_FORMATS.LONG),
          toBookingTimeDifference(BookingUtil.bookedAt(booking), version),
        ])}
        {renderBlock('Country', [
          `${BookingUtil.countryName(booking)} (${BookingUtil.countryCode(booking)})`,
        ])}
        {renderBlock('Payment method', [BookingUtil.paymentMethod(booking)])}
        {renderBlock('Ticket price', [BookingUtil.ticketPrices(tickets)])}
        {renderBlock('Ticket type', [BookingUtil.ticketTypes(tickets)])}
        {renderBlock('Check-in date and time', [DateTimeUtil.format(BookingUtil.checkInAt(booking), DATE_FORMATS.LONG),
          toBookingTimeDifference(BookingUtil.checkInAt(booking), version)])}
      </div>
    </div>
  );
};

export default Booking;
