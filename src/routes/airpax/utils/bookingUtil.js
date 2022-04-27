import lookup from 'country-code-lookup';
import { getFormattedDate, toDateTimeList } from './datetimeUtil';
import calculateTimeDifference from '../../../utils/calculateDatetimeDifference';

import { UNKNOWN_TEXT, SHORT_DATE_FORMAT_ALT, STANDARD_HOUR_MINUTE_FORMAT } from '../../../constants';

const hasPaymentCard = (payment) => {
  return !!payment.card;
};

const getPaymentCard = (payment) => {
  if (hasPaymentCard(payment)) {
    return payment.card;
  }
  return null;
};

const getCardLastFourDigits = (payment) => {
  const paymentCard = getPaymentCard(payment);
  if (paymentCard) {
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
  return !!booking.payments;
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
  return !!booking.ticket;
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
  return booking.country;
};

const getBookingCountryName = (booking) => {
  if (getBookingCountryCode(booking) === UNKNOWN_TEXT) {
    return UNKNOWN_TEXT;
  }
  return lookup.byIso(getBookingCountryCode(booking)).country;
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

const BookingUtil = {
  get: getBooking,
  bookedAt: getBookedAt,
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
  paymentAmount: getPaymentAmount,
  paymentCard: getPaymentCard,
  cardLastFourDigits: getCardLastFourDigits,
};

export default BookingUtil;

export {
  toBookingDateText,
  getBookingReference,
  toCheckInTimeText,
  getBooking,
  getBookedAt,
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
};
