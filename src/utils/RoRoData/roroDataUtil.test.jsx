import { RoRoDataUtil } from '../index';

import { testRoroData } from '../../__fixtures__/roroData.fixture';

describe('RoRoData Util', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return a modified roroData object with a list of 2 passengers', () => {
    const modifiedRoroData = RoRoDataUtil.modifyRoRoPassengersTaskList({ ...testRoroData });
    expect(modifiedRoroData.passengers.length).toEqual(2);
  });

  it('should return a check-in time that is a concatenated datetime string', () => {
    const expectedCheckInDataTime = '2020-08-03T12:05:00,2020-08-03T13:05:00Z';

    const taskVersionMinified = [
      {
        fieldSetName: 'Booking and check-in',
        hasChildSet: false,
        contents: [
          {
            fieldName: 'Check-in',
            type: 'DATETIME',
            content: '2020-08-03T12:05:00',
            versionLastUpdated: null,
            propName: 'checkIn',
          },
        ],
        type: 'null',
        propName: 'booking',
      },
    ];

    const testRoroDataMinified = {
      roro: {
        details: {
          departureTime: '2020-08-03T13:05:00Z',
        },
      },
    };

    const result = RoRoDataUtil.extractTaskVersionsBookingField(taskVersionMinified, testRoroDataMinified);
    const modifiedCheckInTime = result.contents.find(({ propName }) => propName === 'checkIn').content;

    expect(modifiedCheckInTime).toEqual(expectedCheckInDataTime);
  });

  it('should return check-in time with no concatenated datetime string when departure time is empty', () => {
    const expectedCheckInDataTime = '2020-08-03T12:05:00';

    const taskVersionMinified = [
      {
        fieldSetName: 'Booking and check-in',
        hasChildSet: false,
        contents: [
          {
            fieldName: 'Check-in',
            type: 'DATETIME',
            content: '2020-08-03T12:05:00',
            versionLastUpdated: null,
            propName: 'checkIn',
          },
        ],
        type: 'null',
        propName: 'booking',
      },
    ];

    const testRoroDataMinified = {
      roro: {
        details: {
          departureTime: '',
        },
      },
    };

    const result = RoRoDataUtil.extractTaskVersionsBookingField(taskVersionMinified, testRoroDataMinified);
    const modifiedCheckInTime = result.contents.find(({ propName }) => propName === 'checkIn').content;

    expect(modifiedCheckInTime).toEqual(expectedCheckInDataTime);
  });

  it('should return check-in time with no concatenated datetime string when check-in time is null', () => {
    const taskVersionMinified = [
      {
        fieldSetName: 'Booking and check-in',
        hasChildSet: false,
        contents: [
          {
            fieldName: 'Check-in',
            type: 'DATETIME',
            content: null,
            versionLastUpdated: null,
            propName: 'checkIn',
          },
        ],
        type: 'null',
        propName: 'booking',
      },
    ];

    const testRoroDataMinified = {
      roro: {
        details: {
          departureTime: '2020-08-03T13:05:00Z',
        },
      },
    };

    const result = RoRoDataUtil.extractTaskVersionsBookingField(taskVersionMinified, testRoroDataMinified);
    const modifiedCheckInTime = result.contents.find(({ propName }) => propName === 'checkIn').content;

    expect(modifiedCheckInTime).toBeFalsy();
  });

  it('Should return a country name from country code provided', () => {
    const bookingFieldMinified = {
      fieldSetName: 'Booking and check-in',
      hasChildSet: false,
      contents: [
        {
          fieldName: 'Country',
          type: 'STRING',
          content: 'GB',
          versionLastUpdated: null,
          propName: 'country',
        },
      ],
      type: 'null',
      propName: 'booking',
    };
    const result = RoRoDataUtil.modifyCountryCodeIfPresent(bookingFieldMinified);
    expect(result.contents?.find(({ propName }) => propName === 'country').content).toBe('United Kingdom (GB)');
  });

  it('Should return unknown(invalid country code) when an invalid country code is provided', () => {
    const bookingFieldMinified = {
      fieldSetName: 'Booking and check-in',
      hasChildSet: false,
      contents: [
        {
          fieldName: 'Country',
          type: 'STRING',
          content: 'UN',
          versionLastUpdated: null,
          propName: 'country',
        },
      ],
      type: 'null',
      propName: 'booking',
    };
    const result = RoRoDataUtil.modifyCountryCodeIfPresent(bookingFieldMinified);
    expect(result.contents?.find(({ propName }) => propName === 'country').content).toBe('UN');
  });

  it('Should return the booking object when a country code equal to the string equivalent of unknown', () => {
    const bookingFieldMinified = {
      fieldSetName: 'Booking and check-in',
      hasChildSet: false,
      contents: [
        {
          fieldName: 'Country',
          type: 'STRING',
          content: 'unknown',
          versionLastUpdated: null,
          propName: 'country',
        },
      ],
      type: 'null',
      propName: 'booking',
    };
    const result = RoRoDataUtil.modifyCountryCodeIfPresent(bookingFieldMinified);
    expect(result).toEqual(bookingFieldMinified);
  });

  it('Should return the given booking object when a country code is null', () => {
    const bookingFieldMinified = {
      fieldSetName: 'Booking and check-in',
      hasChildSet: false,
      contents: [
        {
          fieldName: 'Country',
          type: 'STRING',
          content: null,
          versionLastUpdated: null,
          propName: 'country',
        },
      ],
      type: 'null',
      propName: 'booking',
    };
    const result = RoRoDataUtil.modifyCountryCodeIfPresent(bookingFieldMinified);
    expect(result).toEqual(bookingFieldMinified);
  });

  it('Should return the given booking object when a country code data node is missing', () => {
    const bookingFieldMinified = {
      fieldSetName: 'Booking and check-in',
      hasChildSet: false,
      contents: [],
      type: 'null',
      propName: 'booking',
    };
    const result = RoRoDataUtil.modifyCountryCodeIfPresent(bookingFieldMinified);
    expect(result).toEqual(bookingFieldMinified);
  });

  it('should return only one actual passenger', () => {
    const passengers = [
      {
        name: 'JIMS CHEESES',
        dob: '',
      },
      {
        name: '',
        dob: '',
      },
    ];

    const expected = [
      {
        name: 'JIMS CHEESES',
        dob: '',
      },
    ];

    const outcome = RoRoDataUtil.filterKnownPassengers(passengers);
    expect(outcome).toEqual(expected);
  });

  it('should return two actual passengers', () => {
    const passengers = [
      {
        name: 'JIMS CHEESES',
        dob: '',
      },
      {
        name: 'ISIAH FORD',
        dob: '',
      },
    ];

    const expected = [
      {
        name: 'JIMS CHEESES',
        dob: '',
      },
      {
        name: 'ISIAH FORD',
        dob: '',
      },
    ];

    const outcome = RoRoDataUtil.filterKnownPassengers(passengers);
    expect(outcome).toEqual(expected);
  });

  it('should return true when given is a string representation of boolean true', () => {
    const GIVEN = 'true';
    expect(RoRoDataUtil.toRoRoSelectorsValue(GIVEN)).toBeTruthy();
  });

  it('should return false when given is a string representation of boolean false', () => {
    const GIVEN = 'false';
    expect(RoRoDataUtil.toRoRoSelectorsValue(GIVEN)).toBeFalsy();
  });

  it('should return null when input is an empty string', () => {
    expect(RoRoDataUtil.toRoRoSelectorsValue('')).toBeNull();
  });

  it('should return null when input is the default roro hasSelectors filter value', () => {
    const GIVEN = 'both';
    expect(RoRoDataUtil.toRoRoSelectorsValue(GIVEN)).toBeNull();
  });
});
