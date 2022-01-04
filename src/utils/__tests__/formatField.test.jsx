import { formatField } from '../formatField';

describe('formatField', () => {
  describe('BOOKING_DATETIME type', () => {
    it.each([
      ['2020-10-24T01:15:00,2020-11-08T14:00:00', '24 Oct 2020 at 01:15, 16 days before travel'],
      ['2020-10-24T01:15:00,2020-10-25T01:15:00', '24 Oct 2020 at 01:15, a day before travel'],
      ['2019-10-24T01:15:00,2020-11-08T14:00:00', '24 Oct 2019 at 01:15, a year before travel'],
      ['2017-10-24T01:15:00,2020-11-08T14:00:00', '24 Oct 2017 at 01:15, 3 years before travel'],
      ['2020-10-24T01:15:00,2020-11-24T14:00:00', '24 Oct 2020 at 01:15, a month before travel'],
      ['2020-09-24T01:15:00,2020-11-24T14:00:00', '24 Sep 2020 at 01:15, 2 months before travel'],
      ['2020-09-24T01:15:00,2020-09-24T02:15:00', '24 Sep 2020 at 01:15, an hour before travel'],
      ['2020-09-24T01:15:00,2020-09-24T03:15:00', '24 Sep 2020 at 01:15, 2 hours before travel'],
    ])(
      'should format the booking datetime correctly', (bookingDatetime, expectedOutput) => {
        expect(formatField('BOOKING_DATETIME', bookingDatetime)).toEqual(expectedOutput);
      },
    );
  });
});
