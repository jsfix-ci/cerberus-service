import renderer from 'react-test-renderer';
import { BookingUtil } from '../../utils';
import { LONDON_TIMEZONE, UNKNOWN_TEXT } from '../../../../constants';

import config from '../../../../config';

describe('BookingUtil', () => {
  let booking;

  beforeEach(() => {
    config.dayjsConfig.timezone = LONDON_TIMEZONE;

    booking = {
      reference: 'LSV4UV',
      type: null,
      paymentMethod: null,
      bookedAt: '2020-02-07T17:15:00Z',
      checkInAt: null,
      ticket: {
        number: null,
        type: null,
        price: null,
      },
      country: 'GB',
      payments: [
        {
          amount: 2190.48,
          card: {
            number: '30XXXXXXXXXXX63X',
            expiry: '2020-10-01T00:00:00Z',
          },
        },
        {
          amount: 2151.48,
          card: {
            number: '30XXXXXXXXXXX62X',
            expiry: '2020-10-01T00:00:00Z',
          },
        },
      ],
      agent: {
        iata: '987654321',
        location: 'Galiway, IE',
      },
    };
  });

  it('should return a booking object if present', () => {
    const targetTaskMin = {
      movement: {
        booking: {
          reference: null,
          bookedAt: null,
          checkInAt: null,
          country: null,
        },
      },
    };

    const expected = {
      reference: null,
      bookedAt: null,
      checkInAt: null,
      country: null,
    };

    const output = BookingUtil.get(targetTaskMin);

    expect(output).not.toBeUndefined();
    expect(output).toEqual(expected);
  });

  it('should not return a booking object if not present', () => {
    const targetTaskMin = {
      movement: {
      },
    };

    const output = BookingUtil.get(targetTaskMin);

    expect(output).toBeNull();
  });

  it('should return the default error text when bookedAt is not present', () => {
    booking.bookedAt = null;
    const output = BookingUtil.toBookingText(booking);
    expect(output).toEqual(UNKNOWN_TEXT);
  });

  it('should return a formatted date if bookedAt is present', () => {
    booking.bookedAt = '1966-05-13T00:00:00Z';
    const output = BookingUtil.toBookingText(booking);
    expect(output).toEqual('13 May 1966');
  });

  it('should have bookedAt if populated', () => {
    booking.bookedAt = '1966-05-13T00:00:00Z';
    const output = BookingUtil.bookedAt(booking);
    expect(output).toEqual('1966-05-13T00:00:00Z');
  });

  it('should return null if bookedAt is assigned null', () => {
    booking.bookedAt = null;
    const output = BookingUtil.bookedAt(booking);
    expect(output).toBeNull();
  });

  it('should return formatted check-in text if check-in time is present within the booking', () => {
    booking.checkInAt = '2020-08-07T17:15:00Z';
    const output = BookingUtil.toCheckInText(booking);
    expect(output).toEqual('Check-in 18:15');
  });

  it('should return default formatted error text if check-in time is not present within the booking', () => {
    booking.checkInAt = null;
    const output = BookingUtil.toCheckInText(booking);
    expect(output).toEqual(`Check-in ${UNKNOWN_TEXT}`);
  });

  it('should return a booking reference if present', () => {
    booking.reference = 'REF-12345';
    const output = BookingUtil.bookingRef(booking);
    expect(output).toEqual('REF-12345');
  });

  it('should return the default error text if booking reference is not present', () => {
    booking.reference = null;
    const output = BookingUtil.bookingRef(booking);
    expect(output).toEqual(UNKNOWN_TEXT);
  });

  it('should calculate the booked prior value for given', () => {
    const bookedAt = '2020-08-07T17:15:00Z';
    const departureTime = '2020-08-10T18:15:00Z';

    const output = BookingUtil.bookedPrior(bookedAt, departureTime);
    expect(output).toEqual('3 days before travel');
  });

  it('should handle the omission of one the two dates', () => {
    const bookedAt = '';
    const departureTime = '2020-08-10T18:15:00Z';

    const output = BookingUtil.bookedPrior(bookedAt, departureTime);
    expect(output).toEqual(UNKNOWN_TEXT);
  });

  it('should get the expected country code', () => {
    const output = BookingUtil.countryCode(booking);
    expect(output).toEqual('GB');
  });

  it('should return unknown country code is null', () => {
    booking.country = null;
    const output = BookingUtil.countryCode(booking);
    expect(output).toEqual(UNKNOWN_TEXT);
  });

  it('should return unknown country code is invalid', () => {
    booking.country = 'UN';
    const output = BookingUtil.countryName(booking);
    expect(output).toEqual(UNKNOWN_TEXT);
  });

  it('should return the expected country name', () => {
    let output = BookingUtil.countryName(booking);
    expect(output).toEqual('United Kingdom');

    booking.country = 'FR';
    output = BookingUtil.countryName(booking);
    expect(output).toEqual('France');
  });

  it('should return unknown when the country name is null', () => {
    booking.country = null;
    let output = BookingUtil.countryName(booking);
    expect(output).toEqual(UNKNOWN_TEXT);
  });

  it('should return booking type when the booking type is present', () => {
    booking.type = 'Online';
    const type = BookingUtil.bookingType(booking);
    expect(type).toEqual(booking.type);
  });

  it('should return unknown when booking type is not present', () => {
    const type = BookingUtil.bookingType(booking);
    expect(type).toEqual(UNKNOWN_TEXT);
  });

  it('should return a booking ticket object if present', () => {
    const ticket = BookingUtil.bookingTicket(booking);

    const expected = {
      number: null,
      type: null,
      price: null,
    };

    expect(ticket).toEqual(expected);
  });

  it('should return null when a booking ticket is not present', () => {
    booking.ticket = null;
    const ticket = BookingUtil.bookingTicket(booking);
    expect(ticket).toBeNull();
  });

  it('should return the ticket number if present', () => {
    booking.ticket.number = 'TIC-098376';
    const ticketNumber = BookingUtil.ticketNumber(booking.ticket);
    expect(ticketNumber).toEqual(booking.ticket.number);
  });

  it('should return unknown when ticket number is not present', () => {
    const ticketNumber = BookingUtil.ticketNumber(booking.ticket);
    expect(ticketNumber).toEqual(UNKNOWN_TEXT);
  });

  it('should return the ticket type if present', () => {
    booking.ticket.type = 'Online';
    const ticketType = BookingUtil.ticketType(booking.ticket);
    expect(ticketType).toEqual(booking.ticket.type);
  });

  it('should return unknown when ticket type is not present', () => {
    const ticketType = BookingUtil.ticketType(booking.ticket);
    expect(ticketType).toEqual(UNKNOWN_TEXT);
  });

  it('should return the payment object if present', () => {
    const payments = BookingUtil.payments(booking);

    const expected = [
      {
        amount: 2190.48,
        card: {
          number: '30XXXXXXXXXXX63X',
          expiry: '2020-10-01T00:00:00Z',
        },
      },
      {
        amount: 2151.48,
        card: {
          number: '30XXXXXXXXXXX62X',
          expiry: '2020-10-01T00:00:00Z',
        },
      },
    ];

    expect(payments).toEqual(expected);
  });

  it('should return unknown when the payment object is not present', () => {
    booking.payments = null;
    const payments = BookingUtil.payments(booking);
    expect(payments).toBeNull();
  });

  it('should get a payment amount if present', () => {
    const paymentAmount = BookingUtil.paymentAmount(booking.payments[0]);
    expect(paymentAmount).toEqual(2190.48);
  });

  it('should return unknown when payment amount is not present', () => {
    booking.payments[0].amount = null;
    const paymentAmount = BookingUtil.paymentAmount(booking.payments[0]);
    expect(paymentAmount).toEqual(UNKNOWN_TEXT);
  });

  it('should return the payment card object', () => {
    const paymentCard = BookingUtil.paymentCard(booking.payments[0]);

    const expected = {
      number: '30XXXXXXXXXXX63X',
      expiry: '2020-10-01T00:00:00Z',
    };

    expect(paymentCard).toEqual(expected);
  });

  it('should return null if the payment card object is not present', () => {
    booking.payments[0] = null;

    const paymentCard = BookingUtil.paymentCard(booking.payments[0]);

    expect(paymentCard).toBeNull();
  });

  it('should return the payment card number', () => {
    const cardNumber = BookingUtil.paymentCard(booking.payments[0]).number;
    expect(cardNumber).toEqual(booking.payments[0].card.number);
  });

  it('should return the payment card expiry', () => {
    const cardExpiry = BookingUtil.paymentCard(booking.payments[0]).expiry;
    expect(cardExpiry).toEqual(booking.payments[0].card.expiry);
  });

  it('should return the payment card last 4 digits', () => {
    const cardLastFourDigits = BookingUtil.cardLastFourDigits(booking.payments[0]);
    const expected = booking.payments[0].card.number.substring(booking.payments[0].card.number.length - 4);
    expect(cardLastFourDigits).toEqual(expected);
  });

  it('should return unknown when the payment card\'s last 4 digits is not found', () => {
    booking.payments[0].card.number = null;
    const cardLastFourDigits = BookingUtil.cardLastFourDigits(booking.payments[0]);
    expect(cardLastFourDigits).toEqual(UNKNOWN_TEXT);
  });

  it('should return the payment card expiry date if present', () => {
    const cardExpiry = BookingUtil.cardExpiry(booking.payments[0]);
    expect(cardExpiry).toEqual('10/20');
  });

  it('should return unknown when the payment card expiry date is not present', () => {
    booking.payments[0].card.expiry = null;
    const cardExpiry = BookingUtil.cardExpiry(booking.payments[0]);
    expect(cardExpiry).toEqual(UNKNOWN_TEXT);
  });

  it('should get the agent object if present', () => {
    const agent = BookingUtil.agent(booking);

    const expected = {
      iata: '987654321',
      location: 'Galiway, IE',
    };

    expect(agent).toEqual(expected);
  });

  it('should get the agent iata if present', () => {
    const agentIata = BookingUtil.agentIata(booking.agent);
    expect(agentIata).toEqual(booking.agent.iata);
  });

  it('should return unknown when the agent iata is not present', () => {
    booking.agent.iata = null;
    const agentIata = BookingUtil.agentIata(booking.agent);
    expect(agentIata).toEqual(UNKNOWN_TEXT);
  });

  it('should get the agent location if present', () => {
    const agentLocation = BookingUtil.agentLocation(booking.agent);
    expect(agentLocation).toEqual(booking.agent.location);
  });

  it('should return unknown when the agent location is not present', () => {
    booking.agent.location = null;
    const agentLocation = BookingUtil.agentLocation(booking.agent);
    expect(agentLocation).toEqual(UNKNOWN_TEXT);
  });

  it('should render the payments block', () => {
    const section = renderer.create(BookingUtil.paymentsBlock(booking)).toJSON();
    expect(section).toMatchSnapshot();
  });
});
