import { DateTimeUtil } from '../../utils';
import { LONDON_TIMEZONE, LONG_DATE_FORMAT, UNKNOWN_TIME_DATA } from '../../../../constants';

import config from '../../../../config';

describe('DateTimeUtil', () => {
  beforeEach(() => {
    config.dayjsConfig.timezone = LONDON_TIMEZONE;
  });

  it('should format the date if present', () => {
    const date = '1966-05-13T00:00:00Z'; // UTC
    const expected = '13 May 1966 at 01:00';

    const output = DateTimeUtil.format(date, LONG_DATE_FORMAT);

    expect(output).toEqual(expected);
  });

  it('should return expected failure message when date is not present', () => {
    const output = DateTimeUtil.format('', LONG_DATE_FORMAT);
    expect(output).toEqual('Invalid Date');
  });

  it('should return an array contaning two entries', () => {
    const dateOne = '1966-05-13T00:00:00Z';
    const dateTwo = '1966-05-13T01:00:00Z';

    const output = DateTimeUtil.toList(dateOne, dateTwo);

    expect(Array.isArray(output)).toBeTruthy();
    expect(output.length).toEqual(2);
  });

  it('should convert the given time in milliseconds to a time object', () => {
    const given = '10000000';

    const expected = { h: 2, m: 46, s: 40 };

    const output = DateTimeUtil.toTime(given);
    expect(output).toEqual(expected);
  });

  it('should return a time object with unknown h. m & s when given is empty', () => {
    const output = DateTimeUtil.toTime('');
    expect(output).toEqual(UNKNOWN_TIME_DATA);
  });

  it('should return a time object with unknown h. m & s when given is 0', () => {
    const output = DateTimeUtil.toTime(0);
    expect(output).toEqual(UNKNOWN_TIME_DATA);
  });

  it('should return a time object with unknown h. m & s when given is null', () => {
    const given = null;
    const output = DateTimeUtil.toTime(given);
    expect(output).toEqual(UNKNOWN_TIME_DATA);
  });

  it('should return a time object with unknown h. m & s when given is undefined', () => {
    const given = undefined;
    const output = DateTimeUtil.toTime(given);
    expect(output).toEqual(UNKNOWN_TIME_DATA);
  });

  it('should return a time object with unknown h. m & s when given is a mixture of numbers & characters', () => {
    const given = '3600-00000A';
    const output = DateTimeUtil.toTime(given);
    expect(output).toEqual(UNKNOWN_TIME_DATA);
  });
});
