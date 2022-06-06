import { RORO_FILTERS_KEY, TASK_ID_KEY, TASK_STATUS_NEW } from '../../constants';
import { modifyRoRoPassengersTaskList,
  hasCheckinDate,
  hasEta,
  hasCarrierCounts,
  hasTaskVersionPassengers,
  extractTaskVersionsBookingField,
  modifyCountryCodeIfPresent,
  isSinglePassenger,
  filterKnownPassengers,
  isNotNumber,
  getTaskId,
  hasLocalStorageFilters } from '../roroDataUtil';

import { testRoroData } from '../__fixtures__/roroData.fixture';

describe('RoRoData Util', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return a modified roroData object with a list of 2 passengers', () => {
    const modifiedRoroData = modifyRoRoPassengersTaskList({ ...testRoroData });
    expect(modifiedRoroData.passengers.length).toEqual(2);
  });

  it('should return false if given empty', () => {
    const result = hasCheckinDate('');
    expect(result).toBeFalsy();
  });

  it('should return false if given null', () => {
    const result = hasCheckinDate(null);
    expect(result).toBeFalsy();
  });

  it('should return false if given undefined', () => {
    const result = hasCheckinDate(undefined);
    expect(result).toBeFalsy();
  });

  it('should return true if given not null, undefined or empty', () => {
    const result = hasCheckinDate('2022-01-22T10:12:55');
    expect(result).toBeTruthy();
  });

  it('should return false for hasEta if given empty', () => {
    const result = hasEta('');
    expect(result).toBeFalsy();
  });

  it('should return false for hasEta if given null', () => {
    const result = hasEta(null);
    expect(result).toBeFalsy();
  });

  it('should return false for hasEta if given undefined', () => {
    const result = hasEta(undefined);
    expect(result).toBeFalsy();
  });

  it('should return true for hasEta if given not null, undefined or empty', () => {
    const result = hasEta('2022-01-22T10:12:55');
    expect(result).toBeTruthy();
  });

  it('should true when all counts have non-null content', () => {
    const suppliedPassengerCounts = [
      {
        propName: 'infantCount',
      },
      {
        propName: 'childCount',
      },
      {
        propName: 'adultCount',
      },
      {
        propName: 'oapCount',
      },
    ];
    const result = hasCarrierCounts(suppliedPassengerCounts);
    expect(result).toBeTruthy();
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

    const result = extractTaskVersionsBookingField(taskVersionMinified, testRoroDataMinified);
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

    const result = extractTaskVersionsBookingField(taskVersionMinified, testRoroDataMinified);
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

    const result = extractTaskVersionsBookingField(taskVersionMinified, testRoroDataMinified);
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
    const result = modifyCountryCodeIfPresent(bookingFieldMinified);
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
    const result = modifyCountryCodeIfPresent(bookingFieldMinified);
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
    const result = modifyCountryCodeIfPresent(bookingFieldMinified);
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
    const result = modifyCountryCodeIfPresent(bookingFieldMinified);
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
    const result = modifyCountryCodeIfPresent(bookingFieldMinified);
    expect(result).toEqual(bookingFieldMinified);
  });

  it('should return false for absence of a valid passenger when not found', () => {
    const given = {
      fieldSetName: 'Passengers',
      hasChildSet: true,
      contents: [],
      childSets: [
        {
          fieldSetName: '',
          hasChildSet: false,
          contents: [
            {
              fieldName: 'Name',
              type: 'STRING',
              content: null,
              versionLastUpdated: null,
              propName: 'name',
            },
            {
              fieldName: 'Date of birth',
              type: 'SHORT_DATE',
              content: null,
              versionLastUpdated: null,
              propName: 'dob',
            },
            {
              fieldName: 'Enrichment count',
              type: 'HIDDEN',
              content: '-/-/-',
              versionLastUpdated: null,
              propName: 'enrichmentCount',
            },
          ],
          type: 'null',
          propName: '',
        },
        {
          fieldSetName: '',
          hasChildSet: false,
          contents: [
            {
              fieldName: 'Name',
              type: 'STRING',
              content: null,
              versionLastUpdated: null,
              propName: 'name',
            },
            {
              fieldName: 'Date of birth',
              type: 'SHORT_DATE',
              content: null,
              versionLastUpdated: null,
              propName: 'dob',
            },
            {
              fieldName: 'Enrichment count',
              type: 'HIDDEN',
              content: '-/-/1',
              versionLastUpdated: null,
              propName: 'enrichmentCount',
            },
          ],
          type: 'null',
          propName: '',
        },
      ],
      type: 'STANDARD',
      propName: 'passengers',
    };
    const outcome = hasTaskVersionPassengers(given);
    expect(outcome).toEqual(false);
  });

  it('should return true for presence of a valid passenger when found', () => {
    const given = {
      fieldSetName: 'Passengers',
      hasChildSet: true,
      contents: [],
      childSets: [
        {
          fieldSetName: '',
          hasChildSet: false,
          contents: [
            {
              fieldName: 'Name',
              type: 'STRING',
              content: 'JOE BLOGGS',
              versionLastUpdated: null,
              propName: 'name',
            },
            {
              fieldName: 'Date of birth',
              type: 'SHORT_DATE',
              content: null,
              versionLastUpdated: null,
              propName: 'dob',
            },
            {
              fieldName: 'Enrichment count',
              type: 'HIDDEN',
              content: '-/-/-',
              versionLastUpdated: null,
              propName: 'enrichmentCount',
            },
          ],
          type: 'null',
          propName: '',
        },
        {
          fieldSetName: '',
          hasChildSet: false,
          contents: [
            {
              fieldName: 'Name',
              type: 'STRING',
              content: 'JOHN CHEESE',
              versionLastUpdated: null,
              propName: 'name',
            },
            {
              fieldName: 'Date of birth',
              type: 'SHORT_DATE',
              content: null,
              versionLastUpdated: null,
              propName: 'dob',
            },
            {
              fieldName: 'Enrichment count',
              type: 'HIDDEN',
              content: '-/-/-',
              versionLastUpdated: null,
              propName: 'enrichmentCount',
            },
          ],
          type: 'null',
          propName: '',
        },
      ],
      type: 'STANDARD',
      propName: 'passengers',
    };
    const outcome = hasTaskVersionPassengers(given);
    expect(outcome).toEqual(true);
  });

  it('should return true when there is only one passenger', () => {
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

    const outcome = isSinglePassenger(passengers);
    expect(outcome).toBeTruthy();
  });

  it('should return false when there is more than one passenger', () => {
    const passengers = [
      {
        name: 'JIMS CHEESE',
        dob: '',
      },
      {
        name: 'ISIAH FORD',
        dob: '',
      },
    ];

    const outcome = isSinglePassenger(passengers);
    expect(outcome).toBeFalsy();
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

    const outcome = filterKnownPassengers(passengers);
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

    const outcome = filterKnownPassengers(passengers);
    expect(outcome).toEqual(expected);
  });

  it('should return true when there is only one task details passenger)', () => {
    const passengers = [
      {
        fieldSetName: '',
        hasChildSet: false,
        contents: [
          {
            fieldName: 'Name',
            type: 'STRING',
            content: 'Isiah Ford',
            versionLastUpdated: null,
            propName: 'name',
          },
          {
            fieldName: 'Date of birth',
            type: 'SHORT_DATE',
            content: null,
            versionLastUpdated: null,
            propName: 'dob',
          },
        ],
        type: 'null',
        propName: '',
      },
      {
        fieldSetName: '',
        hasChildSet: false,
        contents: [
          {
            fieldName: 'Name',
            type: 'STRING',
            content: null,
            versionLastUpdated: null,
            propName: 'name',
          },
          {
            fieldName: 'Date of birth',
            type: 'SHORT_DATE',
            content: null,
            versionLastUpdated: null,
            propName: 'dob',
          },
        ],
        type: 'null',
        propName: '',
      },
    ];

    const outcome = isSinglePassenger(passengers);
    expect(outcome).toBeTruthy();
  });

  it('should return false when there is more than one task details passengers)', () => {
    const passengers = [
      {
        fieldSetName: '',
        hasChildSet: false,
        contents: [
          {
            fieldName: 'Name',
            type: 'STRING',
            content: 'Isiah Ford',
            versionLastUpdated: null,
            propName: 'name',
          },
          {
            fieldName: 'Date of birth',
            type: 'SHORT_DATE',
            content: null,
            versionLastUpdated: null,
            propName: 'dob',
          },
        ],
        type: 'null',
        propName: '',
      },
      {
        fieldSetName: '',
        hasChildSet: false,
        contents: [
          {
            fieldName: 'Name',
            type: 'STRING',
            content: 'JOHN CHEESE',
            versionLastUpdated: null,
            propName: 'name',
          },
          {
            fieldName: 'Date of birth',
            type: 'SHORT_DATE',
            content: null,
            versionLastUpdated: null,
            propName: 'dob',
          },
        ],
        type: 'null',
        propName: '',
      },
    ];

    const outcome = isSinglePassenger(passengers);
    expect(outcome).toBeFalsy();
  });

  it('should validate false if given is a number', () => {
    const given = 10;

    const outcome = isNotNumber(given);
    expect(outcome).toBeFalsy();
  });

  it('should validate false if given is a number and is 0', () => {
    const given = 0;

    const outcome = isNotNumber(given);
    expect(outcome).toBeFalsy();
  });

  it('should validate false if given is a number, in a string representation', () => {
    const given = '10';

    const outcome = isNotNumber(given);
    expect(outcome).toBeFalsy();
  });

  it('should validate true if given is null and not a number', () => {
    const given = null;

    const outcome = isNotNumber(given);
    expect(outcome).toBeTruthy();
  });

  it('should validate true if given is undefined and not a number', () => {
    const given = undefined;

    const outcome = isNotNumber(given);
    expect(outcome).toBeTruthy();
  });

  it('should validate true if given is an empty string and not a number', () => {
    const given = '';

    const outcome = isNotNumber(given);
    expect(outcome).toBeTruthy();
  });

  it('should validate true if given is a string of mixed chracters and not a number', () => {
    const given = 'XY1_C!';

    const outcome = isNotNumber(given);
    expect(outcome).toBeTruthy();
  });

  it('should return the set task id', () => {
    const EXPECTED = 'test-task-id';
    localStorage.setItem(TASK_ID_KEY, EXPECTED);

    const output = getTaskId(TASK_ID_KEY);
    expect(output).toEqual(EXPECTED);
  });

  it(`should return task status "${TASK_STATUS_NEW}" if none has been set in local storage`, () => {
    const output = getTaskId(TASK_ID_KEY);
    expect(output).toEqual(TASK_STATUS_NEW);
  });

  it('should return true if local storage filters found', () => {
    const EXPECTED = 'test-task-id';
    localStorage.setItem(RORO_FILTERS_KEY, EXPECTED);

    const output = hasLocalStorageFilters(RORO_FILTERS_KEY);
    expect(output).toBeTruthy();
  });

  it('should return false if local storage filters are not found', () => {
    const output = hasLocalStorageFilters(RORO_FILTERS_KEY);
    expect(output).toBeFalsy();
  });
});
