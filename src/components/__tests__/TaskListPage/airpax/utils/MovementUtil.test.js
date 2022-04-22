import { MovementUtil } from '../../../../TaskListPage/airpax/utils/index';
import { UNKNOWN_TEXT } from '../../../../../constants';

describe('MovementUtil', () => {
  const targetTaskMin = {
    movement: {
      id: 'AIRPAXTSV:CMID=9c19fe74233c057f25e5ad333672c3f9/2b4a6b5b08ea434880562d6836b1111',
      status: 'PRE_ARRIVAL',
      mode: 'AIR_PASSENGER',
      description: 'individual',
      journey: {
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
      },
      flight: {
        departureStatus: 'DC',
        number: 'BA103',
        operator: 'BA',
        seatNumber: null,
      },
    },
  };

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
});
