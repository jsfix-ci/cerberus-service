import { MovementUtil } from '../index';

describe('MovementUtil.Extended', () => {
  it('should return false if given empty', () => {
    expect(MovementUtil.hasCheckinDate('')).toBeFalsy();
  });

  it('should return false if given null', () => {
    expect(MovementUtil.hasCheckinDate(null)).toBeFalsy();
  });

  it('should return false if given undefined', () => {
    expect(MovementUtil.hasCheckinDate(undefined)).toBeFalsy();
  });

  it('should return true if given not null, undefined or empty', () => {
    expect(MovementUtil.hasCheckinDate('2022-01-22T10:12:55')).toBeTruthy();
  });

  it('should return false for hasEta if given empty', () => {
    expect(MovementUtil.hasEta('')).toBeFalsy();
  });

  it('should return false for hasEta if given null', () => {
    expect(MovementUtil.hasEta(null)).toBeFalsy();
  });

  it('should return false for hasEta if given undefined', () => {
    expect(MovementUtil.hasEta(undefined)).toBeFalsy();
  });

  it('should return true for hasEta if given not null, undefined or empty', () => {
    expect(MovementUtil.hasEta('2022-01-22T10:12:55')).toBeTruthy();
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
    const result = MovementUtil.hasCarrierCounts(suppliedPassengerCounts);
    expect(result).toBeTruthy();
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
    expect(MovementUtil.hasTaskVersionPassengers(given)).toEqual(false);
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
    expect(MovementUtil.hasTaskVersionPassengers(given)).toEqual(true);
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
    expect(MovementUtil.isSinglePassenger(passengers)).toBeTruthy();
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
    expect(MovementUtil.isSinglePassenger(passengers)).toBeFalsy();
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
    expect(MovementUtil.isSinglePassenger(passengers)).toBeTruthy();
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
    expect(MovementUtil.isSinglePassenger(passengers)).toBeFalsy();
  });
});
