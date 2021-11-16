import targetDatetimeDifference from '../calculateDatetimeDifference';

describe('should calculate and return relative time diff between booking time and departure time', () => {
    it.each([
        ["2020-10-24T01:15:00,2020-11-08T14:00:00", "Booked 16 days before travel"],
        ["2020-10-24T01:15:00,2020-10-25T01:15:00", "Booked a day before travel"],
        ["2019-10-24T01:15:00,2020-11-08T14:00:00", "Booked a year before travel"],
        ["2017-10-24T01:15:00,2020-11-08T14:00:00", "Booked 3 years before travel"],
        ["2020-10-24T01:15:00,2020-11-24T14:00:00", "Booked a month before travel"],
        ["2020-09-24T01:15:00,2020-11-24T14:00:00", "Booked 2 months before travel"],
        ["2020-09-24T01:15:00,2020-09-24T02:15:00", "Booked an hour before travel"],
        ["2020-09-24T01:15:00,2020-09-24T03:15:00", "Booked 2 hours before travel"],
        ["2020-10-24T15:15:00,", ""]
    ])(
        'should calculate the relative time difference', (bookingDatetime, expected) => {
            expect(targetDatetimeDifference(bookingDatetime)).toEqual(expected);          
        }  
    )
});