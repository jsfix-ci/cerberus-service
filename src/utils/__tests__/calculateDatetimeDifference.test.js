import calculateTimeDifference from '../calculateDatetimeDifference';
import { DEFAULT_DATE_TIME_STRING_PREFIX } from '../../constants';

describe('should calculate and return relative time diff between booking time and departure time', () => {
  it.each([
    ['2020-10-24T01:15:00,2020-11-08T14:00:00', 'Booked 16 days before travel'],
    ['2020-10-24T01:15:00,2020-10-25T01:15:00', 'Booked a day before travel'],
    ['2019-10-24T01:15:00,2020-11-08T14:00:00', 'Booked a year before travel'],
    ['2017-10-24T01:15:00,2020-11-08T14:00:00', 'Booked 3 years before travel'],
    ['2020-10-24T01:15:00,2020-11-24T14:00:00', 'Booked a month before travel'],
    ['2020-09-24T01:15:00,2020-11-24T14:00:00', 'Booked 2 months before travel'],
    ['2020-09-24T01:15:00,2020-09-24T02:15:00', 'Booked an hour before travel'],
    ['2020-09-24T01:15:00,2020-09-24T03:15:00', 'Booked 2 hours before travel'],
    ['2020-10-24T15:15:00,', 'Booked Unknown'],
    ['', 'Booked Unknown'],
  ])(
    'should calculate the relative time difference', (dateTimeCommaString, expected) => {
      const dateTimeArray = dateTimeCommaString.split(',').filter((x) => x.length > 0);
      const formattedDateString = calculateTimeDifference(dateTimeArray, DEFAULT_DATE_TIME_STRING_PREFIX);
      expect(formattedDateString).toEqual(expected);
    },
  );

  it('should calculate and return relative time with suffix', () => {
    const dateTimeArray = ['2020-10-24T01:15:00', '2020-11-08T14:00:00'];
    const suffix = 'later';
    const expected = '16 days later';

    const formattedDateString = calculateTimeDifference(dateTimeArray, undefined, suffix);
    expect(formattedDateString).toEqual(expected);
  });

  it('should calculate and return relative time with prefix & suffix', () => {
    const dateTimeArray = ['2020-10-24T01:15:00', '2020-11-08T14:00:00'];
    const prefix = 'Arrival';
    const suffix = 'later';
    const expected = 'Arrival 16 days later';

    const formattedDateString = calculateTimeDifference(dateTimeArray, prefix, suffix);
    expect(formattedDateString).toEqual(expected);
  });

  it('should calculate and return the default dayjs relative time without prefix & suffix', () => {
    const dateTimeArray = ['2020-10-24T01:15:00', '2020-11-08T14:00:00'];
    const expected = '16 days before travel';

    const formattedDateString = calculateTimeDifference(dateTimeArray);
    expect(formattedDateString).toEqual(expected);
  });

  it('should calculate and return relative time in future with AirPax mode', () => {
    const dateTimeArray = ['2020-10-24T01:15:00', '2020-11-08T14:00:00'];
    const mode = 'AirPax';
    const expected = 'arrival at London in 16 days ';

    const formattedDateString = calculateTimeDifference(dateTimeArray, 'London', '', mode);
    expect(formattedDateString).toBe(expected);
  });

  it('should calculate and return relative time in past with AirPax mode', () => {
    const dateTimeArray = ['2020-10-24T01:15:00', '2020-09-08T14:00:00'];
    const mode = 'AirPax';
    const expected = 'arrived at London a month ago';

    const formattedDateString = calculateTimeDifference(dateTimeArray, 'London', '', mode);
    expect(formattedDateString).toBe(expected);
  });
});
