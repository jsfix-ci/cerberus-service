import React from 'react';
import lookup from 'country-code-lookup';
import Common from './common';
import { getFormattedDate, toDateTimeList } from './datetimeUtil';
import { calculateTimeDifference } from '../../../utils/DatetimeUtil';

import {
  UNKNOWN_TEXT,
  SHORT_DATE_FORMAT_ALT,
  STANDARD_HOUR_MINUTE_FORMAT,
  STANDARD_CARD_EXPIRY_FORMAT,
} from '../../../constants';

const getAgentLocation = (agent) => {
  if (!agent?.location) {
    return UNKNOWN_TEXT;
  }
  const splitLoc = agent?.location?.split(',').map((val) => val.trim());
  if (!splitLoc.every((val) => val)) {
    return UNKNOWN_TEXT;
  }
  return [splitLoc[0], Common.iso3Code(splitLoc[1])].join(', ');
};

const getAgentIata = (agent) => {
  if (!agent?.iata) {
    return UNKNOWN_TEXT;
  }
  return agent.iata;
};

const getAgentName = (agent) => {
  if (!agent?.name) {
    return UNKNOWN_TEXT;
  }
  return agent.name;
};

const hasAgent = (booking) => {
  return !!booking?.agent;
};

const getAgent = (booking) => {
  if (hasAgent(booking)) {
    return booking.agent;
  }
  return null;
};

const hasPaymentCard = (payment) => {
  return !!payment?.card;
};

const getPaymentCard = (payment) => {
  if (hasPaymentCard(payment)) {
    return payment.card;
  }
  return null;
};

const getCardExpiry = (payment) => {
  const paymentCard = getPaymentCard(payment);
  if (paymentCard?.expiry) {
    return getFormattedDate(paymentCard.expiry, STANDARD_CARD_EXPIRY_FORMAT);
  }
  return UNKNOWN_TEXT;
};

const getCardLastFourDigits = (payment) => {
  const paymentCard = getPaymentCard(payment);
  if (paymentCard?.number) {
    return paymentCard.number.substr(paymentCard.number.length - 4);
  }
  return UNKNOWN_TEXT;
};

const getPaymentAmount = (payment) => {
  if (!payment?.amount) {
    return UNKNOWN_TEXT;
  }
  return payment.amount;
};

const hasPayments = (booking) => {
  return !!booking?.payments?.length > 0;
};

const getPayments = (booking) => {
  if (hasPayments(booking)) {
    return booking.payments;
  }
  return null;
};

const getTicketType = (ticket) => {
  if (!ticket?.type) {
    return UNKNOWN_TEXT;
  }
  return ticket.type;
};

const getTicketNumber = (ticket) => {
  if (!ticket?.number) {
    return UNKNOWN_TEXT;
  }
  return ticket.number;
};

const hasTicket = (booking) => {
  return !!booking?.ticket;
};

const getTicket = (booking) => {
  if (hasTicket(booking)) {
    return booking.ticket;
  }
  return null;
};

const getBookingType = (booking) => {
  if (!booking?.type) {
    return UNKNOWN_TEXT;
  }
  return booking.type;
};

const getBookingCountryCode = (booking) => {
  if (!booking?.country) {
    return UNKNOWN_TEXT;
  }
  return Common.iso3Code(booking.country);
};

const getBookingCountryName = (booking) => {
  const countryCode = getBookingCountryCode(booking);
  if (countryCode === UNKNOWN_TEXT) {
    return UNKNOWN_TEXT;
  }
  if (lookup.byIso(countryCode) === null) {
    return UNKNOWN_TEXT;
  }
  return lookup.byIso(countryCode).country;
};

const toBookingDateText = (booking) => {
  if (!booking?.bookedAt) {
    return UNKNOWN_TEXT;
  }
  return getFormattedDate(booking.bookedAt, SHORT_DATE_FORMAT_ALT);
};

const getBookingReference = (booking) => {
  if (!booking?.reference) {
    return UNKNOWN_TEXT;
  }
  return booking.reference;
};

const getCheckInAt = (booking) => {
  if (!booking?.checkInAt) {
    return UNKNOWN_TEXT;
  }
  return booking.checkInAt;
};

const toCheckInTimeText = (booking) => {
  const checkinPrefix = 'Check-in';
  if (!booking?.checkInAt) {
    return `${checkinPrefix} ${UNKNOWN_TEXT}`;
  }
  return `${checkinPrefix} ${getFormattedDate(booking.checkInAt, STANDARD_HOUR_MINUTE_FORMAT)}`;
};

const getBookedAt = (booking) => {
  return booking?.bookedAt;
};

const getBookedPriorToDeparture = (bookedAt, departureTime) => {
  const dateTimeList = toDateTimeList(bookedAt, departureTime);
  return calculateTimeDifference(dateTimeList);
};

const hasBooking = (targetTask) => {
  return !!targetTask?.movement?.booking;
};

const getBooking = (targetTask) => {
  if (hasBooking(targetTask)) {
    return targetTask.movement.booking;
  }
  return null;
};

const toPaymentsBlock = (booking) => {
  const payments = getPayments(booking);
  if (payments) {
    return payments.map((payment, index) => {
      return (
        <div key={index} className="bottom-border-thin govuk-!-margin-top-1 govuk-!-padding-bottom-1">
          <div className="font__bold">{getPaymentAmount(payment)}</div>
          <div className="font__light">
            Credit card ending {getCardLastFourDigits(payment)}, expiry {getCardExpiry(payment)}
          </div>
        </div>
      );
    });
  }
};

const BookingUtil = {
  get: getBooking,
  bookedAt: getBookedAt,
  checkInAt: getCheckInAt,
  bookedPrior: getBookedPriorToDeparture,
  toCheckInText: toCheckInTimeText,
  bookingRef: getBookingReference,
  toBookingText: toBookingDateText,
  countryCode: getBookingCountryCode,
  countryName: getBookingCountryName,
  bookingType: getBookingType,
  bookingTicket: getTicket,
  ticketNumber: getTicketNumber,
  ticketType: getTicketType,
  payments: getPayments,
  containsPayments: hasPayments,
  paymentAmount: getPaymentAmount,
  paymentCard: getPaymentCard,
  cardLastFourDigits: getCardLastFourDigits,
  cardExpiry: getCardExpiry,
  agent: getAgent,
  agentName: getAgentName,
  agentIata: getAgentIata,
  agentLocation: getAgentLocation,
  paymentsBlock: toPaymentsBlock,
};

export default BookingUtil;

export {
  toBookingDateText,
  getBookingReference,
  toCheckInTimeText,
  getBooking,
  getBookedAt,
  getCheckInAt,
  getBookedPriorToDeparture,
  getBookingCountryCode,
  getBookingCountryName,
  getBookingType,
  getTicket,
  getTicketNumber,
  getTicketType,
  getPayments,
  getPaymentAmount,
  getPaymentCard,
  getCardLastFourDigits,
  getCardExpiry,
  getAgent,
  getAgentName,
  getAgentIata,
  getAgentLocation,
  toPaymentsBlock,
};
