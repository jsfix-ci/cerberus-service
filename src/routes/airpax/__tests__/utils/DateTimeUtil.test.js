import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { DateTimeUtil } from '../../../../utils';

import { LONG_DATE_FORMAT, UNKNOWN_TEXT, UTC_DATE_FORMAT } from '../../../../constants';

dayjs.extend(utc);

describe('DateTimeUtil', () => {
  it('should format the date if present', () => {
    const date = '1966-05-13T00:00:00Z'; // UTC
    const expected = '13 May 1966 at 00:00';

    const output = DateTimeUtil.format(date, LONG_DATE_FORMAT);

    expect(output).toEqual(expected);
  });

  it('should return unknown when date is not present', () => {
    const output = DateTimeUtil.format('', LONG_DATE_FORMAT);
    expect(output).toEqual(UNKNOWN_TEXT);
  });

  it('should return an array contaning two entries', () => {
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

    const output = DateTimeUtil.convertToUTC(INPUT_DATE, INPUT_FORMAT, UTC_DATE_FORMAT);
    expect(output).toEqual('2000-06-24T00:00:00Z');
  });
});
