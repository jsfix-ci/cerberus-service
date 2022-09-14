import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { render, screen } from '@testing-library/react';
import { JourneyUtil, MovementUtil } from '../index';
import { STRINGS, UNKNOWN_TIME_DATA } from '../constants';

describe('JourneyUtil', () => {
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

  it('should return the route if present', () => {
    const output = JourneyUtil.movementRoute(targetTaskMin.movement.journey);
    expect(output).not.toBeUndefined();
    expect(output).not.toBeNull();
    expect(output).toEqual(targetTaskMin.movement.journey.route);
  });

  it('should return a departure time if present', () => {
    const output = JourneyUtil.departureTime(targetTaskMin.movement.journey);
    expect(output).toEqual(targetTaskMin.movement.journey.departure.time);
  });

  it('should return arrival time if present', () => {
    const output = JourneyUtil.arrivalTime(targetTaskMin.movement.journey);
    expect(output).toEqual(targetTaskMin.movement.journey.arrival.time);
  });

  it('should return a formatted departure date and time if present', () => {
    const output = JourneyUtil.formatDepartureTime(targetTaskMin.movement.journey);
    expect(output).toEqual('7 Aug 2020 at 17:15');
  });

  it('should return a formatted arrival date and time if present', () => {
    const output = JourneyUtil.formatArrivalTime(targetTaskMin.movement.journey);
    expect(output).toEqual(STRINGS.UNKNOWN_TEXT);
  });

  it('should return a departure location if present', () => {
    const output = JourneyUtil.departureLoc(targetTaskMin.movement.journey);
    expect(output).toEqual(targetTaskMin.movement.journey.departure.location);
  });

  it('should return an arrival location if present', () => {
    const output = JourneyUtil.arrivalLoc(targetTaskMin.movement.journey);
    expect(output).toEqual(targetTaskMin.movement.journey.arrival.location);
  });

  it('should return the flight duration when present', () => {
    const outcome = JourneyUtil.flightDuration(targetTaskMin.movement.journey);
    expect(outcome).toEqual(targetTaskMin.movement.journey.duration);
  });

  it('should return unknown when flight duration when duration is null', () => {
    targetTaskMin.movement.journey.duration = null;
    const outcome = JourneyUtil.flightDuration(targetTaskMin.movement.journey);
    expect(outcome).toEqual(STRINGS.UNKNOWN_TEXT);
  });

  it('should return unknown when flight duration when duration is undefined', () => {
    targetTaskMin.movement.journey.duration = undefined;
    const outcome = JourneyUtil.flightDuration(targetTaskMin.movement.journey);
    expect(outcome).toEqual(STRINGS.UNKNOWN_TEXT);
  });

  it('should return unknown when flight duration when duration is empty', () => {
    targetTaskMin.movement.journey.duration = '';
    const outcome = JourneyUtil.flightDuration(targetTaskMin.movement.journey);
    expect(outcome).toEqual(STRINGS.UNKNOWN_TEXT);
  });

  it('should return the flight time flight duration is present', () => {
    const outcome = JourneyUtil.formatFlightTime(targetTaskMin.movement.journey);
    expect(outcome).toEqual('2h 46m');
  });

  it('should return unknown when flight duration is null', () => {
    targetTaskMin.movement.journey.duration = null;
    const outcome = JourneyUtil.formatFlightTime(targetTaskMin.movement.journey);
    expect(outcome).toEqual(STRINGS.UNKNOWN_TEXT);
  });

  it('should return unknown when flight duration is undefined', () => {
    targetTaskMin.movement.journey.duration = undefined;
    const outcome = JourneyUtil.formatFlightTime(targetTaskMin.movement.journey);
    expect(outcome).toEqual(STRINGS.UNKNOWN_TEXT);
  });

  it('should return unknown when flight duration is empty', () => {
    targetTaskMin.movement.journey.duration = '';
    const outcome = JourneyUtil.formatFlightTime(targetTaskMin.movement.journey);
    expect(outcome).toEqual(STRINGS.UNKNOWN_TEXT);
  });

  it('should return unknown when flight duration is invalid', () => {
    targetTaskMin.movement.journey.duration = 'A';
    const outcome = JourneyUtil.formatFlightTime(targetTaskMin.movement.journey);
    expect(outcome).toEqual(STRINGS.UNKNOWN_TEXT);
  });

  it('should convert the given time in milliseconds to a time object', () => {
    const given = '10000000';

    const expected = { h: 2, m: 46, s: 40 };

    const output = JourneyUtil.flightTimeObject(given);
    expect(output).toEqual(expected);
  });

  it('should return a time object when given is 0', () => {
    const expected = { h: 0, m: 0, s: 0 };
    const output = JourneyUtil.flightTimeObject(0);
    expect(output).toEqual(expected);
  });

  it('should return a time object when given is string representation of 0', () => {
    const expected = { h: 0, m: 0, s: 0 };
    const output = JourneyUtil.flightTimeObject('0');
    expect(output).toEqual(expected);
  });

  it('should return a time object with unknown h. m & s when given is null', () => {
    const given = null;
    const output = JourneyUtil.flightTimeObject(given);
    expect(output).toEqual(UNKNOWN_TIME_DATA);
  });

  it('should return a time object with unknown h. m & s when given is undefined', () => {
    const given = undefined;
    const output = JourneyUtil.flightTimeObject(given);
    expect(output).toEqual(UNKNOWN_TIME_DATA);
  });

  it('should return a time object with unknown h. m & s when given is empty', () => {
    const output = JourneyUtil.flightTimeObject('');
    expect(output).toEqual(UNKNOWN_TIME_DATA);
  });

  it('should return a time object with unknown h. m & s when given is a mixture of numbers & characters', () => {
    const given = '3600-00000A';
    const output = JourneyUtil.flightTimeObject(given);
    expect(output).toEqual(UNKNOWN_TIME_DATA);
  });

  it('should return the movement direction', () => {
    const journey = JourneyUtil.get(targetTaskMin);
    expect(JourneyUtil.direction(journey)).toEqual('INBOUND');
  });

  it('should return undefined for invalid movement direction', () => {
    const INVALID_DIRECTIONS = [undefined, null, ''];
    INVALID_DIRECTIONS.forEach((direction) => {
      targetTaskMin.movement.journey.direction = direction;
      const journey = JourneyUtil.get(targetTaskMin);
      expect(JourneyUtil.direction(journey)).toBeUndefined();
    });
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
});
