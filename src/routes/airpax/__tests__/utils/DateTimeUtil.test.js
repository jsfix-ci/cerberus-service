import { DateTimeUtil } from '../../utils';
import { LONG_DATE_FORMAT, UNKNOWN_TEXT } from '../../../../constants';

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
});
