import formatTaskVersion, {
  poleIdsAvailable,
  findMatchingPoleIds,
  objectLookup,
} from '../formatTaskVersion';

describe('formatTaskVersion file', () => {
  describe('poleIdsAvailable', () => {
    it('should output array of pole ids with specified id flag', () => {
      const input = 'MODE:B=TEST_ID,B=ANOTHER_TEST_ID,C=ONE_MORE_ID';
      expect(
        poleIdsAvailable(
          input,
          'B',
        ),
      ).toEqual(['B=TEST_ID', 'B=ANOTHER_TEST_ID']);
      expect(
        poleIdsAvailable(
          input,
          'C',
        ),
      ).toEqual(['C=ONE_MORE_ID']);
      expect(
        poleIdsAvailable(
          input,
          'Z',
        ),
      ).toEqual([]);
    });
  });

  describe('findMatchingPoleIds', () => {
    it('should return true if matching pole ids are found', () => {
      const id1 = 'MODE:B=TEST_ID,B=ANOTHER_TEST_ID,C=ONE_MORE_ID';
      const id2 = 'MODE:C=TEST_ID,E=ANOTHER_TEST_ID,C=ONE_MORE_ID';
      expect(findMatchingPoleIds(id1, id2, 'C')).toBe(true);
    });
    it('should return false if no matching pole ids are found', () => {
      const id1 = 'MODE:B=TEST_ID,B=ANOTHER_TEST_ID,C=ONE_MORE_ID';
      const id2 = 'MODE:C=TEST_ID,B=ANOTHER_TEST_ID_4,L=ONE_MORE_ID';
      expect(findMatchingPoleIds(id1, id2, 'C')).toBe(false);
    });
    it('should return null if id passed down is falsey', () => {
      const id1 = '';
      const id2 = 'MODE:C=TEST_ID,B=ANOTHER_TEST_ID_4,L=ONE_MORE_ID';
      expect(findMatchingPoleIds(id1, id2, 'C')).toBe(null);
    });
  });

  describe('objectLookup', () => {
    const inputArr = [
      {
        object: {
          type: 'TYPE A',
        },
        party: {
          poleId: {
            v2: {
              id: 'MODE:A=TEST_ID,B=TEST_ID_2,C=TEST_ID_3',
            },
          },
        },
      },
      {
        object: {
          type: 'TYPE B',
        },
        party: {
          poleId: {
            v2: {
              id: 'MODE:D=TEST_ID,E=TEST_ID_2,F=TEST_ID_3',
            },
          },
        },
      },
    ];

    it('should return object if matching pole ids have been found and object type not specified', () => {
      expect(
        objectLookup(
          inputArr,
          'MODE:T=FOO,F=TEST_ID_3',
          'F',
        ),
      ).toEqual(inputArr[1]);
    });
    it('should return undefined if no matching pole ids are found and object type not specified', () => {
      expect(
        objectLookup(
          inputArr,
          'MODE:A=WILL_NOT_MATCH',
          'A',
        ),
      ).toBe(undefined);
    });
    it('should return object if matching pole ids have been found and object types are equal', () => {
      expect(
        objectLookup(
          inputArr,
          'MODE:T=FOO,F=TEST_ID_3',
          'F',
          'object.type',
          'TYPE B',
        ),
      ).toEqual(inputArr[1]);
    });
    it('should return undefined if matching pole ids have been found and object types are not equal', () => {
      expect(
        objectLookup(
          inputArr,
          'MODE:T=FOO,F=TEST_ID_3',
          'F',
          'object.type',
          'TYPE A',
        ),
      ).toEqual(undefined);
    });
    it('should return undefined if no matching pole ids have been found and object types are equal', () => {
      expect(
        objectLookup(
          inputArr,
          'MODE:T=FOO,F=BAR',
          'F',
          'object.type',
          'TYPE A',
        ),
      ).toEqual(undefined);
    });
    it('should return undefined if no matching pole ids have been found and object types are not equal', () => {
      expect(
        objectLookup(
          inputArr,
          'MODE:T=FOO,F=BAR',
          'F',
          'object.type',
          'TYPE B',
        ),
      ).toEqual(undefined);
    });
  });

  describe('formatTaskVersion', () => {
    const task = {
      orgHistory: [[]],
      personHistory: [[]],
      addressHistory: [[]],
      contactHistory: [[]],
      vehicleHistory: [[]],
      serviceMovementHistory: [{}],
      ruleHistory: [[]],
      selectorHistory: [[]],
      documentHistory: [[]],
    };
    it('should return object with correct structure', () => {
      const expectedResult = {
        account: {
          fullName: undefined,
          shortName: undefined,
          referenceNumber: undefined,
          fullAddress: undefined,
          telephone: undefined,
          mobile: undefined,
        },
        haulier: {
          name: undefined,
          fullAddress: undefined,
          telephone: undefined,
          mobile: undefined,
        },
        driver: {
          driverDocument: {},
        },
        passengers: [],
        vehicle: {},
        trailer: {},
        goods: {},
        booking: {},
        matchedRules: [],
        riskIndicators: [],
      };
      expect(formatTaskVersion(task, 1)).toEqual(expectedResult);
    });
  });
});
