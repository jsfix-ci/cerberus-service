import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { STRINGS, DATE_FORMATS, OPERATION } from '../constants';

import { DateTimeUtil } from '../index';

describe('DatetimeUtil', () => {
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
      const formattedDateString = DateTimeUtil
        .calculateTimeDifference(dateTimeArray, STRINGS.DEFAULT_BOOKING_STRING_PREFIX);
      expect(formattedDateString).toEqual(expected);
    },
  );

  it('should calculate and return relative time with suffix', () => {
    const dateTimeArray = ['2020-10-24T01:15:00', '2020-11-08T14:00:00'];
    const suffix = 'later';
    const expected = '16 days later';

    const formattedDateString = DateTimeUtil.calculateTimeDifference(dateTimeArray, undefined, suffix);
    expect(formattedDateString).toEqual(expected);
  });

  it('should calculate and return relative time with prefix & suffix', () => {
    const dateTimeArray = ['2020-10-24T01:15:00', '2020-11-08T14:00:00'];
    const prefix = 'Arrival';
    const suffix = 'later';
    const expected = 'Arrival 16 days later';

    const formattedDateString = DateTimeUtil.calculateTimeDifference(dateTimeArray, prefix, suffix);
    expect(formattedDateString).toEqual(expected);
  });

  it('should calculate and return the default dayjs relative time without prefix & suffix', () => {
    const dateTimeArray = ['2020-10-24T01:15:00', '2020-11-08T14:00:00'];
    const expected = '16 days before travel';

    const formattedDateString = DateTimeUtil.calculateTimeDifference(dateTimeArray);
    expect(formattedDateString).toEqual(expected);
  });

  it('should return true when datetime is in the past', () => {
    const datetime = getDate(1, 'year', OPERATION.SUBTRACT);
    expect(DateTimeUtil.isPast(datetime)).toBeTruthy();
  });

  it('should return false when datetime is in the present/ future', () => {
    const datetime = getDate(1, 'year', OPERATION.ADD);
    expect(DateTimeUtil.isPast(datetime)).toBeFalsy();
  });

  it('should return a relative time text when datetime is in the past', () => {
    const EXPECTED = '2 years ago';
    const datetime = getDate(2, 'year', OPERATION.SUBTRACT);
    expect(DateTimeUtil.relativeTime(datetime)).toEqual(EXPECTED);
  });

  it('should return a relative time text when datetime is in the future', () => {
    const EXPECTED = '3 years before travel';
    const datetime = getDate(3, 'year', OPERATION.ADD);
    expect(DateTimeUtil.relativeTime(datetime)).toEqual(EXPECTED);
  });

  it('should format the date if present', () => {
    const date = '1966-05-13T00:00:00Z'; // UTC
    const expected = '13 May 1966 at 00:00';

    const output = DateTimeUtil.format(date, DATE_FORMATS.LONG);

    expect(output).toEqual(expected);
  });

  it('should return unknown when date is not present', () => {
    const output = DateTimeUtil.format('', DATE_FORMATS.LONG);
    expect(output).toEqual(STRINGS.UNKNOWN_TEXT);
  });

  it('should return an array containing two entries', () => {
    const dateOne = '1966-05-13T00:00:00Z';
    const dateTwo = '1966-05-13T01:00:00Z';

    const output = DateTimeUtil.toList(dateOne, dateTwo);

    expect(Array.isArray(output)).toBeTruthy();
    expect(output).toHaveLength(2);
    expect(output).toMatchObject([dateOne, dateTwo]);
  });

  it('should return true if date is in past', () => {
    const dateOne = '1966-05-13T00:00:00Z';
    expect(DateTimeUtil.isPast(dateOne)).toEqual(true);
  });

  it('should return false if date is in future', () => {
    const dateOne = dayjs().utc().add(1, 'year').format();
    expect(DateTimeUtil.isPast(dateOne)).toEqual(false);
  });

  it('should return true on date validation when date is a valid UTC dates', () => {
    const VALID_DATES = ['1966-05-13T00:00:00Z', '2022-06-24T13:18:38.076Z'];
    VALID_DATES.forEach((validDate) => {
      expect(DateTimeUtil.validate(validDate)).toBeTruthy();
    });
  });

  it('should return evaluate to false on date validation when date is invalid', () => {
    const INVALID_DATES = [null, undefined, '1966-05-13T00:00:000Z', ''];
    INVALID_DATES.forEach((invalidDate) => {
      expect(DateTimeUtil.validate(invalidDate)).toBeFalsy();
    });
  });

  it('should convert a custom date to a UTC date time string', () => {
    const INPUT_DATE = '24-06-2000';
    const INPUT_FORMAT = 'DD-MM-YYYY';

    const output = DateTimeUtil.convertToUTC(INPUT_DATE, INPUT_FORMAT, DATE_FORMATS.UTC);
    expect(output).toEqual('2000-06-24T00:00:00Z');
  });
});
