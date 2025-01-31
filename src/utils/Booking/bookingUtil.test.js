import renderer from 'react-test-renderer';
import { BookingUtil } from '../index';
import { LONDON_TIMEZONE, STRINGS } from '../constants';

import config from '../config';

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
      tickets: [
        {
          number: null,
          type: null,
          price: null,
        },
      ],
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
    expect(output).toEqual(STRINGS.UNKNOWN_TEXT);
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

  it('should return check-in date if present', () => {
    booking.checkInAt = '1966-05-13T00:00:00Z';
    const output = BookingUtil.checkInAt(booking);
    expect(output).toEqual(booking.checkInAt);
  });

  it('should return unknown if check-in date is null', () => {
    booking.checkInAt = null;
    const output = BookingUtil.checkInAt(booking);
    expect(output).toEqual(STRINGS.UNKNOWN_TEXT);
  });

  it('should return unknown if check-in date is undefined', () => {
    booking.checkInAt = undefined;
    const output = BookingUtil.checkInAt(booking);
    expect(output).toEqual(STRINGS.UNKNOWN_TEXT);
  });

  it('should return unknown if check-in date is an empty string', () => {
    booking.checkInAt = '';
    const output = BookingUtil.checkInAt(booking);
    expect(output).toEqual(STRINGS.UNKNOWN_TEXT);
  });

  it('should return formatted check-in text if check-in time is present within the booking', () => {
    booking.checkInAt = '2020-08-07T17:15:00Z';
    const output = BookingUtil.toCheckInText(booking);
    expect(output).toEqual('Check-in 17:15');
  });

  it('should return default formatted error text if check-in time is not present within the booking', () => {
    booking.checkInAt = null;
    const output = BookingUtil.toCheckInText(booking);
    expect(output).toEqual(`Check-in ${STRINGS.UNKNOWN_TEXT}`);
  });

  it('should return a booking reference if present', () => {
    booking.reference = 'REF-12345';
    const output = BookingUtil.bookingRef(booking);
    expect(output).toEqual('REF-12345');
  });

  it('should return the default error text if booking reference is not present', () => {
    booking.reference = null;
    const output = BookingUtil.bookingRef(booking);
    expect(output).toEqual(STRINGS.UNKNOWN_TEXT);
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
    expect(output).toEqual(STRINGS.UNKNOWN_TEXT);
  });

  it('should get the expected country code', () => {
    const output = BookingUtil.countryCode(booking);
    expect(output).toEqual('GBR');
  });

  it('should return unknown country code is null', () => {
    booking.country = null;
    const output = BookingUtil.countryCode(booking);
    expect(output).toEqual(STRINGS.UNKNOWN_TEXT);
  });

  it('should return unknown when country code is invalid', () => {
    booking.country = 'UN';
    const output = BookingUtil.countryName(booking);
    expect(output).toEqual(STRINGS.UNKNOWN_TEXT);
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
    expect(output).toEqual(STRINGS.UNKNOWN_TEXT);
  });

  it('should return booking type when the booking type is present', () => {
    booking.type = 'Online';
    const type = BookingUtil.bookingType(booking);
    expect(type).toEqual(booking.type);
  });

  it('should return unknown when booking type is not present', () => {
    const type = BookingUtil.bookingType(booking);
    expect(type).toEqual(STRINGS.UNKNOWN_TEXT);
  });

  it('should return a booking tickets if present', () => {
    const ticket = BookingUtil.bookingTickets(booking);

    const expected = [{
      number: null,
      type: null,
      price: null,
    }];

    expect(ticket).toEqual(expected);
  });

  it('should return null when there are no booking tickets', () => {
    booking.tickets = null;
    const tickets = BookingUtil.bookingTickets(booking);
    expect(tickets).toBeNull();
  });

  it.each([
    [[
      {
        number: 'TIC-1234',
        type: 'ONE-WAY',
        price: null,
      },
      {
        number: 'TIC-7863-XZ',
        type: 'RETURN',
        price: null,
      },
    ], 'TIC-1234, TIC-7863-XZ'],
    [[
      {
        number: null,
        type: 'ONE-WAY',
        price: null,
      },
      {
        number: 'TIC-7863-XZ',
        type: 'RETURN',
        price: null,
      },
    ], 'TIC-7863-XZ'],
  ])('should return the appropriate ticket numbers', (given, expected) => {
    booking.tickets = given;
    const ticketNumbers = BookingUtil.ticketNumbers(booking.tickets);
    expect(ticketNumbers).toEqual(expected);
  });

  it('should return unknown when ticket numbers are not present', () => {
    booking.tickets = null;
    const ticketNumbers = BookingUtil.ticketNumbers(booking.tickets);
    expect(ticketNumbers).toEqual(STRINGS.UNKNOWN_TEXT);
  });

  it.each([
    [[
      {
        number: 'TIC-1234',
        type: 'ONE-WAY',
        price: null,
      },
      {
        number: 'TIC-7863-XZ',
        type: 'RETURN',
        price: null,
      },
    ], 'ONE-WAY, RETURN'],
    [[
      {
        number: 'TIC-1234',
        type: 'ONE-WAY',
        price: null,
      },
      {
        number: 'TIC-7863-XZ',
        type: null,
        price: null,
      },
    ], 'ONE-WAY'],

  ])('should return the appropriate ticket types', (given, expected) => {
    booking.tickets = given;
    const ticketTypes = BookingUtil.ticketTypes(booking.tickets);
    expect(ticketTypes).toEqual(expected);
  });

  it('should return an empty string when ticket types is null', () => {
    const ticketTypes = BookingUtil.ticketTypes(booking.tickets);
    expect(ticketTypes).toEqual(STRINGS.UNKNOWN_TEXT);
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
    expect(paymentAmount).toEqual(STRINGS.UNKNOWN_TEXT);
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
    expect(cardLastFourDigits).toEqual(STRINGS.UNKNOWN_TEXT);
  });

  it('should return the payment card expiry date if present', () => {
    const cardExpiry = BookingUtil.cardExpiry(booking.payments[0]);
    expect(cardExpiry).toEqual('10/20');
  });

  it('should return unknown when the payment card expiry date is not present', () => {
    booking.payments[0].card.expiry = null;
    const cardExpiry = BookingUtil.cardExpiry(booking.payments[0]);
    expect(cardExpiry).toEqual(STRINGS.UNKNOWN_TEXT);
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
    expect(agentIata).toEqual(STRINGS.UNKNOWN_TEXT);
  });

  it('should get the agent location if present', () => {
    const expected = 'Galiway, IRL';
    const agentLocation = BookingUtil.agentLocation(booking.agent);
    expect(agentLocation).toEqual(expected);
  });

  it('should return unknown when the agent location is not present', () => {
    booking.agent.location = null;
    const agentLocation = BookingUtil.agentLocation(booking.agent);
    expect(agentLocation).toEqual(STRINGS.UNKNOWN_TEXT);
  });

  it('should render the payments block', () => {
    const section = renderer.create(BookingUtil.paymentsBlock(booking)).toJSON();
    expect(section).toMatchSnapshot();
  });

  it.each([
    [[
      {
        number: 'TIC-1234',
        type: 'ONE-WAY',
        price: '59.99',
      },
      {
        number: 'TIC-7863-XZ',
        type: 'RETURN',
        price: '34.99',
      },
    ], '£59.99, £34.99'],
    [[
      {
        number: null,
        type: 'ONE-WAY',
        price: '23.97',
      },
      {
        number: 'TIC-7863-XZ',
        type: 'RETURN',
        price: null,
      },
    ], '£23.97'],
  ])('should return the appropriate ticket price', (given, expected) => {
    booking.tickets = given;
    const ticketNumbers = BookingUtil.ticketPrices(booking.tickets);
    expect(ticketNumbers).toEqual(expected);
  });
});
