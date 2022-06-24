import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { DateTimeUtil } from '../../utils';

import { LONG_DATE_FORMAT, UNKNOWN_TEXT } from '../../../../constants';

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
});
