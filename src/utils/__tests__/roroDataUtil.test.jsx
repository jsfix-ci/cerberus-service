import { modifyRoRoPassengersTaskList, hasCheckinDate, hasEta, hasTaskVersionValidCounts,
  getFullMovementPersons } from '../roroDataUtil';

import { testRoroData } from '../__fixtures__/roroData.fixture';

describe('RoRoData Util', () => {
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
        fieldName: 'Infants',
        type: 'STRING',
        content: '0',
        versionLastUpdated: null,
        propName: 'infantCount',
      },
      {
        fieldName: 'Children',
        type: 'STRING',
        content: '0',
        versionLastUpdated: null,
        propName: 'childCount',
      },
      {
        fieldName: 'Adults',
        type: 'STRING',
        content: '1',
        versionLastUpdated: null,
        propName: 'adultCount',
      },
      {
        fieldName: 'OAPs',
        type: 'STRING',
        content: '0',
        versionLastUpdated: null,
        propName: 'oapCount',
      },
    ];
    const result = hasTaskVersionValidCounts(suppliedPassengerCounts);
    expect(result).toBeTruthy();
  });

  it('should a list contianing driver and passengers', () => {
    const driver = {
      fieldSetName: 'Driver',
      hasChildSet: false,
      contents: [
        {
          fieldName: 'Name',
          type: 'STRING',
          content: 'Bob Brown',
          versionLastUpdated: null,
          propName: 'name',
        },
        {
          fieldName: 'Date of birth',
          type: 'SHORT_DATE',
          content: 435,
          versionLastUpdated: null,
          propName: 'dob',
        },
        {
          fieldName: 'Gender',
          type: 'STRING',
          content: 'M',
          versionLastUpdated: null,
          propName: 'gender',
        },
        {
          fieldName: 'Nationality',
          type: 'STRING',
          content: 'NL',
          versionLastUpdated: null,
          propName: 'nationality',
        },
        {
          fieldName: 'Travel document type',
          type: 'STRING',
          content: 'Passport',
          versionLastUpdated: null,
          propName: 'docType',
        },
        {
          fieldName: 'Travel document number',
          type: 'STRING',
          content: '244746NL',
          versionLastUpdated: null,
          propName: 'docNumber',
        },
        {
          fieldName: 'Travel document expiry',
          type: 'SHORT_DATE',
          content: 18659,
          versionLastUpdated: null,
          propName: 'docExpiry',
        },
        {
          fieldName: 'Pole ID',
          type: 'HIDDEN',
          content: 'ROROXML:P=33f544d684db9e59150ae84406709122',
          versionLastUpdated: null,
          propName: 'poleId',
        },
        {
          fieldName: 'First name',
          type: 'HIDDEN',
          content: 'Bob',
          versionLastUpdated: null,
          propName: 'firstName',
        },
        {
          fieldName: 'Last name',
          type: 'HIDDEN',
          content: 'Brown',
          versionLastUpdated: null,
          propName: 'lastName',
        },
        {
          fieldName: 'Middle name',
          type: 'HIDDEN',
          content: null,
          versionLastUpdated: null,
          propName: 'middleName',
        },
        {
          fieldName: 'Entity Search URL',
          type: 'HIDDEN',
          content: null,
          versionLastUpdated: null,
          propName: 'entitySearchUrl',
        },
      ],
      type: 'null',
      propName: 'driver',
    };
    const passengers = {
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
              content: 'Ben Bailey',
              versionLastUpdated: null,
              propName: 'name',
            },
            {
              fieldName: 'Date of birth',
              type: 'SHORT_DATE',
              content: -66,
              versionLastUpdated: null,
              propName: 'dob',
            },
            {
              fieldName: 'Gender',
              type: 'STRING',
              content: 'M',
              versionLastUpdated: null,
              propName: 'gender',
            },
            {
              fieldName: 'Nationality',
              type: 'STRING',
              content: 'GB',
              versionLastUpdated: null,
              propName: 'nationality',
            },
            {
              fieldName: 'Travel document type',
              type: 'STRING',
              content: null,
              versionLastUpdated: null,
              propName: 'docType',
            },
            {
              fieldName: 'Travel document number',
              type: 'STRING',
              content: null,
              versionLastUpdated: null,
              propName: 'docNumber',
            },
            {
              fieldName: 'Travel document expiry',
              type: 'SHORT_DATE',
              content: null,
              versionLastUpdated: null,
              propName: 'docExpiry',
            },
            {
              fieldName: 'Pole ID',
              type: 'HIDDEN',
              content: 'ROROXML:P=26ebab61705c7a2c44b5f47ff0b4a58a',
              versionLastUpdated: null,
              propName: 'poleId',
            },
            {
              fieldName: 'First name',
              type: 'HIDDEN',
              content: 'Ben',
              versionLastUpdated: null,
              propName: 'firstName',
            },
            {
              fieldName: 'Last name',
              type: 'HIDDEN',
              content: 'Bailey',
              versionLastUpdated: null,
              propName: 'lastName',
            },
            {
              fieldName: 'Middle name',
              type: 'HIDDEN',
              content: null,
              versionLastUpdated: null,
              propName: 'middleName',
            },
          ],
          type: 'null',
          propName: '',
        },
      ],
      type: 'STANDARD',
      propName: 'passengers',
    };
    const result = getFullMovementPersons(driver, passengers);
    expect(result.childSets.length).toEqual(2);
  });
});
