import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { MovementUtil } from '../index';
import { UNKNOWN_TEXT, UNKNOWN_TIME_DATA } from '../constants';

describe('MovementUtil', () => {
  dayjs.extend(utc);

  let targetTaskMin;

  const itineraries = [
    {
      id: 'AC0850',
      arrival: {
        country: null,
        location: 'YYZ',
        time: '2018-10-03T13:05:00Z',
      },
      departure: {
        country: null,
        location: 'CDG',
        time: '2018-10-03T11:00:00Z',
      },
      duration: 7500000,
    },
    {
      id: 'BD0998',
      arrival: {
        country: null,
        location: 'YYC',
        time: '2018-10-03T18:16:00Z',
      },
      departure: {
        country: null,
        location: 'YYZ',
        time: '2018-10-03T16:05:00Z',
      },
      duration: 7860000,
    },
    {
      id: 'XZ0123',
      arrival: {
        country: null,
        location: 'LHR',
        time: '2018-10-03T21:19:20Z',
      },
      departure: {
        country: null,
        location: 'YYC',
        time: '2018-10-03T18:32:40Z',
      },
      duration: 10000000,
    },
  ];

  beforeEach(() => {
    targetTaskMin = {
      relisted: false,
      movement: {
        id: 'AIRPAXTSV:CMID=9c19fe74233c057f25e5ad333672c3f9/2b4a6b5b08ea434880562d6836b1111',
        status: 'PRE_ARRIVAL',
        mode: 'AIR_PASSENGER',
        description: 'individual',
        person: {
          role: 'PASSENGER',
        },
        journey: {
          id: 'BA103',
          direction: 'INBOUND',
          arrival: {
            country: null,
            location: 'LHR',
            time: null,
          },
          departure: {
            country: null,
            location: 'FRA',
            time: '2020-08-07T17:15:00Z',
          },
          route: [
            'FRA',
            'LHR',
          ],
          itinerary: [
            {
              id: 'BA103',
              arrival: {
                country: null,
                location: 'LHR',
                time: null,
              },
              departure: {
                country: null,
                location: 'FRA',
                time: '2020-08-07T17:15:00Z',
              },
            },
          ],
          duration: 10000000,
        },
        flight: {
          departureStatus: 'DEPARTURE_CONFIRMED',
          number: 'BA103',
          operator: 'BA',
          seatNumber: null,
        },
      },
      latestVersionNumber: 1,
      versions: [],
    };
  });

  const airlineCodesMin = [
    {
      name: 'British Airways',
      twolettercode: 'BA',
    },
    {
      name: 'Air France',
      twolettercode: 'AF',
    },
    {
      name: 'Qantas',
      twolettercode: 'QF',
    },
  ];

  it('should return the route if present', () => {
    const output = MovementUtil.movementRoute(targetTaskMin.movement.journey);
    expect(output).not.toBeUndefined();
    expect(output).not.toBeNull();
    expect(output).toEqual(targetTaskMin.movement.journey.route);
  });

  it('should return null if formatted seat number is not present', () => {
    const output = MovementUtil.seatNumber(targetTaskMin.movement.flight);
    expect(output).toEqual(`seat ${UNKNOWN_TEXT}`);
  });

  it('should return null if formatted seat number is present', () => {
    targetTaskMin.movement.flight.seatNumber = '15C';

    const output = MovementUtil.seatNumber(targetTaskMin.movement.flight);
    expect(output).toEqual('seat 15C');
  });

  it('should return a flight object if present', () => {
    const output = MovementUtil.movementFlight(targetTaskMin);
    expect(output).not.toBeUndefined();
    expect(output).not.toBeNull();
    expect(output).toEqual(targetTaskMin.movement.flight);
  });

  it('should return a journey object if present', () => {
    const output = MovementUtil.movementFlight(targetTaskMin);
    expect(output).not.toBeUndefined();
    expect(output).not.toBeNull();
    expect(output).toEqual(targetTaskMin.movement.flight);
  });

  it('should return a departure time if present', () => {
    const output = MovementUtil.departureTime(targetTaskMin.movement.journey);
    expect(output).toEqual(targetTaskMin.movement.journey.departure.time);
  });

  it('should return arrival time if present', () => {
    const output = MovementUtil.arrivalTime(targetTaskMin.movement.journey);
    expect(output).toEqual(targetTaskMin.movement.journey.arrival.time);
  });

  it('should return a formatted departure date and time if present', () => {
    const output = MovementUtil.formatDepartureTime(targetTaskMin.movement.journey);
    expect(output).toEqual('7 Aug 2020 at 17:15');
  });

  it('should return a formatted arrival date and time if present', () => {
    const output = MovementUtil.formatArrivalTime(targetTaskMin.movement.journey);
    expect(output).toEqual(UNKNOWN_TEXT);
  });

  it('should return a departure location if present', () => {
    const output = MovementUtil.departureLoc(targetTaskMin.movement.journey);
    expect(output).toEqual(targetTaskMin.movement.journey.departure.location);
  });

  it('should return an arrival location if present', () => {
    const output = MovementUtil.arrivalLoc(targetTaskMin.movement.journey);
    expect(output).toEqual(targetTaskMin.movement.journey.arrival.location);
  });

  it('should return a flight number if present', () => {
    const output = MovementUtil.flightNumber(targetTaskMin.movement.flight);
    expect(output).toEqual(targetTaskMin.movement.flight.number);
  });

  it('should return the airline operator if present', () => {
    const output = MovementUtil.airlineOperator(targetTaskMin.movement.flight);
    expect(output).toEqual(targetTaskMin.movement.flight.operator);
  });

  it('should render the departure status if present', () => {
    const tree = renderer.create(MovementUtil.status(targetTaskMin)).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should not render the departure status when status is not present on task list page', () => {
    targetTaskMin.movement.flight.departureStatus = null;
    const tree = renderer.create(MovementUtil.status(targetTaskMin)).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render unknown when the departure status is not present on task details page', () => {
    targetTaskMin.movement.flight.departureStatus = null;
    const tree = renderer.create(MovementUtil.status(targetTaskMin, true)).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render the departure status and details if present', () => {
    const tree = renderer.create(MovementUtil.status(targetTaskMin, true)).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should return the movement type if present', () => {
    const output = MovementUtil.movementType(targetTaskMin);
    expect(output).toEqual('Passenger');
  });

  it('should return the movement description text', () => {
    const output = MovementUtil.description(targetTaskMin);
    expect(output).toEqual('Single passenger');
  });

  it('should return the movement type if present (for crew)', () => {
    const targetTaskMinCrew = {
      movement: {
        id: 'AIRPAXTSV:CMID=9c19fe74233c057f25e5ad333672c3f9/2b4a6b5b08ea434880562d6836b1111',
        status: 'PRE_ARRIVAL',
        mode: 'AIR_PASSENGER',
        description: 'individual',
        person: {
          role: 'CREW',
        },
      },
    };
    const output = MovementUtil.movementType(targetTaskMinCrew);
    expect(output).toEqual('Crew');
  });

  it('should return the movement description text (for crew)', () => {
    const targetTaskMinCrew = {
      movement: {
        id: 'AIRPAXTSV:CMID=9c19fe74233c057f25e5ad333672c3f9/2b4a6b5b08ea434880562d6836b1111',
        status: 'PRE_ARRIVAL',
        mode: 'AIR_PASSENGER',
        description: 'individual',
        person: {
          role: 'CREW',
        },
      },
    };
    const output = MovementUtil.description(targetTaskMinCrew);
    expect(output).toEqual('Crew member');
  });

  it('should return the movement description text for multiple persons', () => {
    targetTaskMin.movement.description = 'group';

    targetTaskMin.movement.person = {
      name: {
        first: 'Isaiah',
        last: 'Ford',
        full: 'Isaiah Ford',
      },
      role: 'PASSENGER',
      dateOfBirth: '1966-05-13T00:00:00Z',
      gender: 'M',
      nationality: 'GBR',
      document: null,
    };

    targetTaskMin.movement.otherPersons = [
      {
        name: {
          first: 'Isaiah',
          last: 'Ford',
          full: 'Isaiah Ford',
        },
        role: 'PASSENGER',
        dateOfBirth: '1966-05-13T00:00:00Z',
        gender: 'M',
        nationality: 'GBR',
        document: null,
      },
    ];

    const output = MovementUtil.description(targetTaskMin);
    expect(output).toEqual('In group of 2');
  });

  it('should return airline name when given valid airline code', () => {
    const GIVEN_BA = MovementUtil.airlineName('BA', airlineCodesMin);
    const GIVEN_AF = MovementUtil.airlineName('AF', airlineCodesMin);
    const GIVEN_QF = MovementUtil.airlineName('QF', airlineCodesMin);

    expect(GIVEN_BA).toEqual('British Airways');
    expect(GIVEN_AF).toEqual('Air France');
    expect(GIVEN_QF).toEqual('Qantas');
  });

  it('should return unknown when given invalid airline code', () => {
    const GIVEN_EMPTY = MovementUtil.airlineName('', airlineCodesMin);
    const GIVEN_NULL = MovementUtil.airlineName('null', airlineCodesMin);
    const GIVEN_UNDEFINED = MovementUtil.airlineName('undefined', airlineCodesMin);
    const GIVEN_INVALID = MovementUtil.airlineName('invalid', airlineCodesMin);

    expect(GIVEN_EMPTY).toEqual(UNKNOWN_TEXT);
    expect(GIVEN_NULL).toEqual(UNKNOWN_TEXT);
    expect(GIVEN_UNDEFINED).toEqual(UNKNOWN_TEXT);
    expect(GIVEN_INVALID).toEqual(UNKNOWN_TEXT);
  });

  it('should return a formatted string from the departure location code when location is present', () => {
    const outcome = MovementUtil.formatLoc(targetTaskMin.movement.journey.departure.location);
    expect(outcome).toEqual('Frankfurt, Germany');
  });

  it('should return unknown when departure location code is null', () => {
    targetTaskMin.movement.journey.departure.location = null;
    const outcome = MovementUtil.formatLoc(targetTaskMin.movement.journey.departure.location);
    expect(outcome).toEqual(UNKNOWN_TEXT);
  });

  it('should return unknown when departure location code is undefined', () => {
    targetTaskMin.movement.journey.departure.location = undefined;
    const outcome = MovementUtil.formatLoc(targetTaskMin.movement.journey.departure.location);
    expect(outcome).toEqual(UNKNOWN_TEXT);
  });

  it('should return unknown when departure location code is empty', () => {
    targetTaskMin.movement.journey.departure.location = '';
    const outcome = MovementUtil.formatLoc(targetTaskMin.movement.journey.departure.location);
    expect(outcome).toEqual(UNKNOWN_TEXT);
  });

  it('should return unknown when departure location code is invalid string', () => {
    targetTaskMin.movement.journey.departure.location = 'unknown';
    const outcome = MovementUtil.formatLoc(targetTaskMin.movement.journey.departure.location);
    expect(outcome).toEqual(UNKNOWN_TEXT);
  });

  it('should return a formatted string from the arrival location code when location is present', () => {
    const outcome = MovementUtil.formatLoc(targetTaskMin.movement.journey.arrival.location);
    expect(outcome).toEqual('London, United Kingdom');
  });

  it('should return unknown when arrival location code is null', () => {
    targetTaskMin.movement.journey.arrival.location = null;
    const outcome = MovementUtil.formatLoc(targetTaskMin.movement.journey.arrival.location);
    expect(outcome).toEqual(UNKNOWN_TEXT);
  });

  it('should return unknown when arrival location code is undefined', () => {
    targetTaskMin.movement.journey.arrival.location = undefined;
    const outcome = MovementUtil.formatLoc(targetTaskMin.movement.journey.arrival.location);
    expect(outcome).toEqual(UNKNOWN_TEXT);
  });

  it('should return unknown when arrival location code is empty', () => {
    targetTaskMin.movement.journey.arrival.location = '';
    const outcome = MovementUtil.formatLoc(targetTaskMin.movement.journey.arrival.location);
    expect(outcome).toEqual(UNKNOWN_TEXT);
  });

  it('should return unknown when arrival location code is invalid string', () => {
    targetTaskMin.movement.journey.arrival.location = 'unknown';
    const outcome = MovementUtil.formatLoc(targetTaskMin.movement.journey.arrival.location);
    expect(outcome).toEqual(UNKNOWN_TEXT);
  });

  it('should return the flight duration when present', () => {
    const outcome = MovementUtil.flightDuration(targetTaskMin.movement.journey);
    expect(outcome).toEqual(targetTaskMin.movement.journey.duration);
  });

  it('should return unknown when flight duration when duration is null', () => {
    targetTaskMin.movement.journey.duration = null;
    const outcome = MovementUtil.flightDuration(targetTaskMin.movement.journey);
    expect(outcome).toEqual(UNKNOWN_TEXT);
  });

  it('should return unknown when flight duration when duration is undefined', () => {
    targetTaskMin.movement.journey.duration = undefined;
    const outcome = MovementUtil.flightDuration(targetTaskMin.movement.journey);
    expect(outcome).toEqual(UNKNOWN_TEXT);
  });

  it('should return unknown when flight duration when duration is empty', () => {
    targetTaskMin.movement.journey.duration = '';
    const outcome = MovementUtil.flightDuration(targetTaskMin.movement.journey);
    expect(outcome).toEqual(UNKNOWN_TEXT);
  });

  it('should return the flight time flight duration is present', () => {
    const outcome = MovementUtil.formatFlightTime(targetTaskMin.movement.journey);
    expect(outcome).toEqual('2h 46m');
  });

  it('should return unknown when flight duration is null', () => {
    targetTaskMin.movement.journey.duration = null;
    const outcome = MovementUtil.formatFlightTime(targetTaskMin.movement.journey);
    expect(outcome).toEqual(UNKNOWN_TEXT);
  });

  it('should return unknown when flight duration is undefined', () => {
    targetTaskMin.movement.journey.duration = undefined;
    const outcome = MovementUtil.formatFlightTime(targetTaskMin.movement.journey);
    expect(outcome).toEqual(UNKNOWN_TEXT);
  });

  it('should return unknown when flight duration is empty', () => {
    targetTaskMin.movement.journey.duration = '';
    const outcome = MovementUtil.formatFlightTime(targetTaskMin.movement.journey);
    expect(outcome).toEqual(UNKNOWN_TEXT);
  });

  it('should return unknown when flight duration is invalid', () => {
    targetTaskMin.movement.journey.duration = 'A';
    const outcome = MovementUtil.formatFlightTime(targetTaskMin.movement.journey);
    expect(outcome).toEqual(UNKNOWN_TEXT);
  });

  it('should convert the given time in milliseconds to a time object', () => {
    const given = '10000000';

    const expected = { h: 2, m: 46, s: 40 };

    const output = MovementUtil.flightTimeObject(given);
    expect(output).toEqual(expected);
  });

  it('should return a time object when given is 0', () => {
    const expected = { h: 0, m: 0, s: 0 };
    const output = MovementUtil.flightTimeObject(0);
    expect(output).toEqual(expected);
  });

  it('should return a time object when given is string representation of 0', () => {
    const expected = { h: 0, m: 0, s: 0 };
    const output = MovementUtil.flightTimeObject('0');
    expect(output).toEqual(expected);
  });

  it('should return a time object with unknown h. m & s when given is null', () => {
    const given = null;
    const output = MovementUtil.flightTimeObject(given);
    expect(output).toEqual(UNKNOWN_TIME_DATA);
  });

  it('should return a time object with unknown h. m & s when given is undefined', () => {
    const given = undefined;
    const output = MovementUtil.flightTimeObject(given);
    expect(output).toEqual(UNKNOWN_TIME_DATA);
  });

  it('should return a time object with unknown h. m & s when given is empty', () => {
    const output = MovementUtil.flightTimeObject('');
    expect(output).toEqual(UNKNOWN_TIME_DATA);
  });

  it('should return a time object with unknown h. m & s when given is a mixture of numbers & characters', () => {
    const given = '3600-00000A';
    const output = MovementUtil.flightTimeObject(given);
    expect(output).toEqual(UNKNOWN_TIME_DATA);
  });

  it('should return the itenerary flight number', () => {
    const expected = 'BA103';
    const output = MovementUtil.itinFlightNumber(targetTaskMin.movement.journey.itinerary[0]);
    expect(output).toEqual(expected);
  });

  it('should return unknown when the itenerary flight number is null', () => {
    targetTaskMin.movement.journey.itinerary[0].id = null;
    const output = MovementUtil.itinFlightNumber(targetTaskMin.movement.journey.itinerary[0]);
    expect(output).toEqual(UNKNOWN_TEXT);
  });

  it('should return city when given a valid iata code', () => {
    const output = MovementUtil.iataToCity('SOU');
    expect(output).toEqual('Southampton');
  });

  it('should return unknown text when given an invalid iata code', () => {
    const INVALID_IATA_CODES = ['SOUTH', undefined, null, ''];
    INVALID_IATA_CODES.forEach((code) => expect(MovementUtil.iataToCity(code)).toEqual('Unknown'));
  });

  it('should return unknown when the itenerary flight number is undefined', () => {
    targetTaskMin.movement.journey.itinerary[0].id = undefined;
    const output = MovementUtil.itinFlightNumber(targetTaskMin.movement.journey.itinerary[0]);
    expect(output).toEqual(UNKNOWN_TEXT);
  });

  it('should return unknown when the itenerary flight number is an empty string', () => {
    targetTaskMin.movement.journey.itinerary[0].id = '';
    const output = MovementUtil.itinFlightNumber(targetTaskMin.movement.journey.itinerary[0]);
    expect(output).toEqual(UNKNOWN_TEXT);
  });

  it('should return the itinerary departure country code', () => {
    targetTaskMin.movement.journey.itinerary[0].departure.country = 'GB';
    const expected = 'GBR';
    const output = MovementUtil.itinDepartureCountryCode(targetTaskMin.movement.journey.itinerary[0]);
    expect(output).toEqual(expected);
  });

  it('should return the country code using departure location when the departure country code is null', () => {
    const output = MovementUtil.itinDepartureCountryCode(targetTaskMin.movement.journey.itinerary[0]);
    expect(output).toEqual('DEU');
  });

  it('should return the country code using departure location when the departure country code is undefined', () => {
    targetTaskMin.movement.journey.itinerary[0].departure.country = undefined;
    const output = MovementUtil.itinDepartureCountryCode(targetTaskMin.movement.journey.itinerary[0]);
    expect(output).toEqual('DEU');
  });

  it('should return the country code using departure location when the departure country code is an empty string', () => {
    targetTaskMin.movement.journey.itinerary[0].departure.country = '';
    const output = MovementUtil.itinDepartureCountryCode(targetTaskMin.movement.journey.itinerary[0]);
    expect(output).toEqual('DEU');
  });

  it('should return unknown when the country code can not be determined using the departure location', () => {
    targetTaskMin.movement.journey.itinerary[0].departure.location = null;
    targetTaskMin.movement.journey.itinerary[0].departure.country = '';
    const output = MovementUtil.itinDepartureCountryCode(targetTaskMin.movement.journey.itinerary[0]);
    expect(output).toEqual(UNKNOWN_TEXT);
  });

  it('should return the itinerary arrival country code', () => {
    targetTaskMin.movement.journey.itinerary[0].arrival.country = 'FR';
    const expected = 'FRA';
    const output = MovementUtil.itinArrivalCountryCode(targetTaskMin.movement.journey.itinerary[0]);
    expect(output).toEqual(expected);
  });

  it('should return the country code using the arrival location when arrival country code is null', () => {
    const output = MovementUtil.itinArrivalCountryCode(targetTaskMin.movement.journey.itinerary[0]);
    expect(output).toEqual('GBR');
  });

  it('should return the country code using the arrival location when arrival country code is undefined', () => {
    targetTaskMin.movement.journey.itinerary[0].arrival.country = undefined;
    const output = MovementUtil.itinArrivalCountryCode(targetTaskMin.movement.journey.itinerary[0]);
    expect(output).toEqual('GBR');
  });

  it('should return the country code using the arrival location when arrival country code is an empty string', () => {
    targetTaskMin.movement.journey.itinerary[0].arrival.country = '';
    const output = MovementUtil.itinArrivalCountryCode(targetTaskMin.movement.journey.itinerary[0]);
    expect(output).toEqual('GBR');
  });

  it('should return unknown when the country code can not be determined using the arrival location', () => {
    targetTaskMin.movement.journey.itinerary[0].arrival.location = null;
    targetTaskMin.movement.journey.itinerary[0].arrival.country = '';
    const output = MovementUtil.itinArrivalCountryCode(targetTaskMin.movement.journey.itinerary[0]);
    expect(output).toEqual(UNKNOWN_TEXT);
  });

  describe('toItineraryBlock', () => {
    const expected = ['Unknown', '3 hours later', '17 minutes later'];
    for (let i = 0; i < itineraries.length; i += 1) {
      it('should calculate time difference between flight legs', () => {
        // As the first leg has nothing prior to it, unknown will be returned however not rendered.
        render(MovementUtil.itinRelativeTime(i, itineraries[i], itineraries));
        expect(screen.getByText(expected[i])).toBeInTheDocument();
      });
    }
  });

  it('should not render the updated label when versions array length is 0 or latestVersionNumber is not greater 1', () => {
    const { container } = render(MovementUtil.updatedStatus(targetTaskMin));
    const elements = container.getElementsByClassName('govuk-tag--updatedTarget');
    expect(elements).toHaveLength(0);
  });

  it('should not render the updated label when versions array length is 1 and latestVersionNumber is 1', () => {
    targetTaskMin.versions = [undefined];
    const { container } = render(MovementUtil.updatedStatus(targetTaskMin));
    const elements = container.getElementsByClassName('govuk-tag--updatedTarget');
    expect(elements).toHaveLength(0);
  });

  it('should render the updated label if versions array is greater than 1 and latestVersionNumber is 1', () => {
    targetTaskMin.versions = [undefined, undefined];

    const { container } = render(MovementUtil.updatedStatus(targetTaskMin));
    const elements = container.getElementsByClassName('govuk-tag--updatedTarget');

    expect(elements).toHaveLength(1);
  });

  it('should render the updated label if latestVersionNumber is greater than 1 and versions array is 0', () => {
    targetTaskMin.latestVersionNumber = 2;

    const { container } = render(MovementUtil.updatedStatus(targetTaskMin));
    const elements = container.getElementsByClassName('govuk-tag--updatedTarget');

    expect(elements).toHaveLength(1);
  });

  it('should return relative time text when given a date that is in the past', () => {
    const EXPECTED = 'arrived 2 years ago';
    const PAST_DATE = dayjs.utc().subtract(2, 'year').format();

    expect(MovementUtil.voyageText(PAST_DATE)).toEqual(EXPECTED);
  });

  it('should return relative time text when given a date that is in the present/future', () => {
    const EXPECTED = 'arriving in 2 years';
    const PAST_DATE = dayjs.utc().add(2, 'year').format();

    expect(MovementUtil.voyageText(PAST_DATE)).toEqual(EXPECTED);
  });

  it('should return unknown text when given date is within an invalid range', () => {
    const PAST_DATES = [undefined, null, ''];
    PAST_DATES.forEach((date) => expect(MovementUtil.voyageText(date)).toEqual(UNKNOWN_TEXT));
  });

  it('should return the movement direction', () => {
    const journey = MovementUtil.movementJourney(targetTaskMin);
    expect(MovementUtil.direction(journey)).toEqual('INBOUND');
  });

  it('should return undefined for invalid movement direction', () => {
    const INVALID_DIRECTIONS = [undefined, null, ''];
    INVALID_DIRECTIONS.forEach((direction) => {
      targetTaskMin.movement.journey.direction = direction;
      const journey = MovementUtil.movementJourney(targetTaskMin);
      expect(MovementUtil.direction(journey)).toBeUndefined();
    });
  });
});
