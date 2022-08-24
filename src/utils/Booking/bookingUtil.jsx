import React from 'react';
import lookup from 'country-code-lookup';
import CommonUtil from '../Common/commonUtil';
import { calculateTimeDifference, getFormattedDate, toDateTimeList } from '../Datetime/datetimeUtil';

import {
  DATE_FORMATS,
  STRINGS,
} from '../constants';

const getAgentLocation = (agent) => {
  if (!agent?.location) {
    return STRINGS.UNKNOWN_TEXT;
  }
  const splitLoc = agent?.location?.split(',').map((val) => val.trim());
  if (!splitLoc.every((val) => val)) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return [splitLoc[0], CommonUtil.iso3Code(splitLoc[1])].join(', ');
};

const getAgentIata = (agent) => {
  if (!agent?.iata) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return agent.iata;
};

const getAgentName = (agent) => {
  if (!agent?.name) {
    return STRINGS.UNKNOWN_TEXT;
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
    return getFormattedDate(paymentCard.expiry, DATE_FORMATS.CUSTOM_CARD_EXPIRY);
  }
  return STRINGS.UNKNOWN_TEXT;
};

const getCardLastFourDigits = (payment) => {
  const paymentCard = getPaymentCard(payment);
  if (paymentCard?.number) {
    return paymentCard.number.substr(paymentCard.number.length - 4);
  }
  return STRINGS.UNKNOWN_TEXT;
};

const getPaymentAmount = (payment) => {
  if (!payment?.amount) {
    return STRINGS.UNKNOWN_TEXT;
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

const getTicketTypes = (tickets) => {
  if (!tickets?.length) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return tickets.map((ticket) => ticket.type).join(', ');
};

const getTicketNumbers = (tickets) => {
  if (!tickets?.length) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return tickets.map((ticket) => ticket.number).join(', ');
};

const hasTickets = (booking) => {
  return !!booking?.tickets?.length;
};

const getTickets = (booking) => {
  if (hasTickets(booking)) {
    return booking.tickets;
  }
  return null;
};

const getBookingType = (booking) => {
  if (!booking?.type) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return booking.type;
};

const getBookingCountryCode = (booking) => {
  if (!booking?.country) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return CommonUtil.iso3Code(booking.country);
};

const getBookingCountryName = (booking) => {
  const countryCode = getBookingCountryCode(booking);
  if (countryCode === STRINGS.UNKNOWN_TEXT) {
    return STRINGS.UNKNOWN_TEXT;
  }
  if (lookup.byIso(countryCode) === null) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return lookup.byIso(countryCode).country;
};

const toBookingDateText = (booking) => {
  if (!booking?.bookedAt) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return getFormattedDate(booking.bookedAt, DATE_FORMATS.SHORT_ALT);
};

const getBookingReference = (booking) => {
  if (!booking?.reference) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return booking.reference;
};

const getCheckInAt = (booking) => {
  if (!booking?.checkInAt) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return booking.checkInAt;
};

const toCheckInTimeText = (booking) => {
  const checkinPrefix = 'Check-in';
  if (!booking?.checkInAt) {
    return `${checkinPrefix} ${STRINGS.UNKNOWN_TEXT}`;
  }
  return `${checkinPrefix} ${getFormattedDate(booking.checkInAt, DATE_FORMATS.CUSTOM_HOUR_MINUTE)}`;
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
  bookingTickets: getTickets,
  ticketNumbers: getTicketNumbers,
  ticketTypes: getTicketTypes,
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
  getTickets,
  getTicketNumbers,
  getTicketTypes,
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
