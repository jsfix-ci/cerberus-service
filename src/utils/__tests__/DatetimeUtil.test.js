import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { calculateTimeDifference, isInPast, toRelativeTime } from '../datetimeUtil';
import { DEFAULT_DATE_TIME_STRING_PREFIX, OPERATION } from '../../constants';

describe('should calculate and return relative time diff between booking time and departure time', () => {
  dayjs.extend(utc);

  const getDate = (value, unit, op) => {
    if (op === OPERATION.ADD) {
      return dayjs.utc().add(value, unit).format();
    }
    return dayjs.utc().subtract(value, unit).format();
  };

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

  it('should return true when datetime is in the past', () => {
    const datetime = getDate(1, 'year', OPERATION.SUBTRACT);
    expect(isInPast(datetime)).toBeTruthy();
  });

  it('should return false when datetime is in the present/ future', () => {
    const datetime = getDate(1, 'year', OPERATION.ADD);
    expect(isInPast(datetime)).toBeFalsy();
  });

  it('should return a relative time text when datetime is in the past', () => {
    const EXPECTED = '2 years ago';
    const datetime = getDate(2, 'year', OPERATION.SUBTRACT);
    expect(toRelativeTime(datetime)).toEqual(EXPECTED);
  });

  it('should return a relative time text when datetime is in the future', () => {
    const EXPECTED = '3 years before travel';
    const datetime = getDate(3, 'year', OPERATION.ADD);
    expect(toRelativeTime(datetime)).toEqual(EXPECTED);
  });
});
