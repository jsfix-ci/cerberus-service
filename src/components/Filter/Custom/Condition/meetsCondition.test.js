import meetsCondition from './meetsCondition';

describe('Custom.Condition.meetsCondition', () => {
  const TEST_VALUES = ['a', 'b', 3, 4, null, undefined, true, false, 0];
  const FIELD_ID = 'field-id';

  const getCondition = (operator, val) => {
    if (['in', 'nin'].includes(operator)) {
      return { field: FIELD_ID, op: operator, values: val };
    }
    return { field: FIELD_ID, op: operator, value: val };
  };

  describe('equality operators', () => {
    ['eq', '='].forEach((op) => {
      describe(`operator ${op}`, () => {
        // Should match...
        it('should match two nulls', () => {
          const DATA = { [FIELD_ID]: null };
          const CONDITION = getCondition(op, null);
          expect(meetsCondition(CONDITION, DATA)).toBeTruthy();
        });
        it('should match two undefineds', () => {
          const DATA = { [FIELD_ID]: undefined };
          const CONDITION = getCondition(op, undefined);
          expect(meetsCondition(CONDITION, DATA)).toBeTruthy();
        });
        it('should match two identical strings', () => {
          const DATA = { [FIELD_ID]: 'value' };
          const CONDITION = getCondition(op, 'value');
          expect(meetsCondition(CONDITION, DATA)).toBeTruthy();
        });
        it('should match two empty strings', () => {
          const DATA = { [FIELD_ID]: '' };
          const CONDITION = getCondition(op, '');
          expect(meetsCondition(CONDITION, DATA)).toBeTruthy();
        });
        it('should match two identical numbers', () => {
          const DATA = { [FIELD_ID]: 3 };
          const CONDITION = getCondition(op, 3);
          expect(meetsCondition(CONDITION, DATA)).toBeTruthy();
        });
        it('should match two zeroes', () => {
          const DATA = { [FIELD_ID]: 0 };
          const CONDITION = getCondition(op, 0);
          expect(meetsCondition(CONDITION, DATA)).toBeTruthy();
        });
        it('should match two boolean trues', () => {
          const DATA = { [FIELD_ID]: true };
          const CONDITION = getCondition(op, true);
          expect(meetsCondition(CONDITION, DATA)).toBeTruthy();
        });
        it('should match two boolean falses', () => {
          const DATA = { [FIELD_ID]: false };
          const CONDITION = getCondition(op, false);
          expect(meetsCondition(CONDITION, DATA)).toBeTruthy();
        });

        // Should reject...
        it('should reject a null and undefined', () => {
          const DATA = { [FIELD_ID]: null };
          const CONDITION = getCondition(op, undefined);
          expect(meetsCondition(CONDITION, DATA)).toBeFalsy();
        });
        it('should reject a null and empty string', () => {
          const DATA = { [FIELD_ID]: null };
          const CONDITION = getCondition(op, '');
          expect(meetsCondition(CONDITION, DATA)).toBeFalsy();
        });
        it('should reject an undefined and empty string', () => {
          const DATA = { [FIELD_ID]: undefined };
          const CONDITION = getCondition(op, '');
          expect(meetsCondition(CONDITION, DATA)).toBeFalsy();
        });
        it('should reject a string of just whitespace and empty string', () => {
          const DATA = { [FIELD_ID]: ' ' };
          const CONDITION = getCondition(op, '');
          expect(meetsCondition(CONDITION, DATA)).toBeFalsy();
        });
        it('should reject the string number \'3\' and the number 3', () => {
          const DATA = { [FIELD_ID]: '3' };
          const CONDITION = getCondition(op, 3);
          expect(meetsCondition(CONDITION, DATA)).toBeFalsy();
        });
        it('should reject a boolean true and the number 1', () => {
          const DATA = { [FIELD_ID]: true };
          const CONDITION = getCondition(op, 1);
          expect(meetsCondition(CONDITION, DATA)).toBeFalsy();
        });
        it('should reject a boolean false and a zero', () => {
          const DATA = { [FIELD_ID]: false };
          const CONDITION = getCondition(op, 0);
          expect(meetsCondition(CONDITION, DATA)).toBeFalsy();
        });
      });
    });
  });

  describe('inequality operators', () => {
    ['ne', 'neq', '!=', '<>'].forEach((op) => {
      describe(`operator ${op}`, () => {
        // Should reject...
        it('should reject two nulls', () => {
          const DATA = { [FIELD_ID]: null };
          const CONDITION = getCondition(op, null);
          expect(meetsCondition(CONDITION, DATA)).toBeFalsy();
        });
        it('should reject two undefineds', () => {
          const DATA = { [FIELD_ID]: undefined };
          const CONDITION = getCondition(op, undefined);
          expect(meetsCondition(CONDITION, DATA)).toBeFalsy();
        });
        it('should reject two identical strings', () => {
          const DATA = { [FIELD_ID]: 'value' };
          const CONDITION = getCondition(op, 'value');
          expect(meetsCondition(CONDITION, DATA)).toBeFalsy();
        });
        it('should reject two empty strings', () => {
          const DATA = { [FIELD_ID]: '' };
          const CONDITION = getCondition(op, '');
          expect(meetsCondition(CONDITION, DATA)).toBeFalsy();
        });
        it('should reject two identical numbers', () => {
          const DATA = { [FIELD_ID]: 3 };
          const CONDITION = getCondition(op, 3);
          expect(meetsCondition(CONDITION, DATA)).toBeFalsy();
        });
        it('should reject two zeroes', () => {
          const DATA = { [FIELD_ID]: 0 };
          const CONDITION = getCondition(op, 0);
          expect(meetsCondition(CONDITION, DATA)).toBeFalsy();
        });
        it('should reject two boolean trues', () => {
          const DATA = { [FIELD_ID]: true };
          const CONDITION = getCondition(op, true);
          expect(meetsCondition(CONDITION, DATA)).toBeFalsy();
        });
        it('should reject two boolean falses', () => {
          const DATA = { [FIELD_ID]: false };
          const CONDITION = getCondition(op, false);
          expect(meetsCondition(CONDITION, DATA)).toBeFalsy();
        });

        // Should match...
        it('should match a null and undefined', () => {
          const DATA = { [FIELD_ID]: null };
          const CONDITION = getCondition(op, undefined);
          expect(meetsCondition(CONDITION, DATA)).toBeTruthy();
        });
        it('should match a null and empty string', () => {
          const DATA = { [FIELD_ID]: null };
          const CONDITION = getCondition(op, '');
          expect(meetsCondition(CONDITION, DATA)).toBeTruthy();
        });
        it('should match an undefined and empty string', () => {
          const DATA = { [FIELD_ID]: undefined };
          const CONDITION = getCondition(op, '');
          expect(meetsCondition(CONDITION, DATA)).toBeTruthy();
        });
        it('should match a string of just whitespace and empty string', () => {
          const DATA = { [FIELD_ID]: ' ' };
          const CONDITION = getCondition(op, '');
          expect(meetsCondition(CONDITION, DATA)).toBeTruthy();
        });
        it('should match the string number \'3\' and the number 3', () => {
          const DATA = { [FIELD_ID]: '3' };
          const CONDITION = getCondition(op, 3);
          expect(meetsCondition(CONDITION, DATA)).toBeTruthy();
        });
        it('should match a boolean true and the number 1', () => {
          const DATA = { [FIELD_ID]: true };
          const CONDITION = getCondition(op, 1);
          expect(meetsCondition(CONDITION, DATA)).toBeTruthy();
        });
        it('should match a boolean false and a zero', () => {
          const DATA = { [FIELD_ID]: false };
          const CONDITION = getCondition(op, 0);
          expect(meetsCondition(CONDITION, DATA)).toBeTruthy();
        });
      });
    });
  });

  describe('operator in', () => {
    const op = 'in';

    // Should match...
    it('should match a string that is in the values array', () => {
      const DATA = { [FIELD_ID]: 'alpha' };
      const CONDITION = getCondition(op, ['alpha', 'bravo', 'charlie']);
      expect(meetsCondition(CONDITION, DATA)).toBeTruthy();
    });
    it('should match a number that is in the values array', () => {
      const DATA = { [FIELD_ID]: 4 };
      const CONDITION = getCondition(op, ['alpha', 'bravo', 'charlie', 4]);
      expect(meetsCondition(CONDITION, DATA)).toBeTruthy();
    });

    // Should reject...
    it('should reject a string that is missing from the values array', () => {
      const DATA = { [FIELD_ID]: 'delta' };
      const CONDITION = getCondition(op, ['alpha', 'bravo', 'charlie']);
      expect(meetsCondition(CONDITION, DATA)).toBeFalsy();
    });
    it('should reject a number that is missing from the values array', () => {
      const DATA = { [FIELD_ID]: 4 };
      const CONDITION = getCondition(op, ['alpha', 'bravo', 'charlie']);
      expect(meetsCondition(CONDITION, DATA)).toBeFalsy();
    });
    it('should reject everything when the values array is empty', () => {
      const CONDITION = getCondition(op, []);
      ['a', 'b', 'c', 'd', 'e', 6, 7, 8, 9, 'ten'].forEach((value) => {
        expect(meetsCondition(CONDITION, value)).toBeFalsy();
      });
    });
    it('should reject everything when the values array is null', () => {
      const CONDITION = getCondition(op, null);
      ['a', 'b', 'c', 'd', 'e', 6, 7, 8, 9, 'ten'].forEach((value) => {
        expect(meetsCondition(CONDITION, value)).toBeFalsy();
      });
    });
  });

  describe('operator nin', () => {
    const op = 'nin';

    // Should reject...
    it('should reject a string that is in the values array', () => {
      const DATA = { [FIELD_ID]: 'alpha' };
      const CONDITION = getCondition(op, ['alpha', 'bravo', 'charlie']);
      expect(meetsCondition(CONDITION, DATA)).toBeFalsy();
    });
    it('should reject a number that is in the values array', () => {
      const DATA = { [FIELD_ID]: 4 };
      const CONDITION = getCondition(op, ['alpha', 'bravo', 'charlie', 4]);
      expect(meetsCondition(CONDITION, DATA)).toBeFalsy();
    });

    // Should match...
    it('should match a string that is missing from the values array', () => {
      const DATA = { [FIELD_ID]: 'delta' };
      const CONDITION = getCondition(op, ['alpha', 'bravo', 'charlie']);
      expect(meetsCondition(CONDITION, DATA)).toBeTruthy();
    });
    it('should match a number that is missing from the values array', () => {
      const DATA = { [FIELD_ID]: 4 };
      const CONDITION = getCondition(op, ['alpha', 'bravo', 'charlie']);
      expect(meetsCondition(CONDITION, DATA)).toBeTruthy();
    });
    it('should match anything when the values array is empty', () => {
      const CONDITION = getCondition(op, []);
      TEST_VALUES.forEach((value) => {
        expect(meetsCondition(CONDITION, value)).toBeTruthy();
      });
    });
    it('should match anything when the values array is null', () => {
      const CONDITION = getCondition(op, null);
      TEST_VALUES.forEach((value) => {
        expect(meetsCondition(CONDITION, value)).toBeTruthy();
      });
    });
  });

  describe('operator contains', () => {
    const op = 'contains';

    // Should match...
    it('should match a string that is in the field array', () => {
      const FIELD = ['alpha', 'bravo', 'charlie'];
      const VALUE = 'alpha';
      const CONDITION = getCondition(op, VALUE);
      const DATA = { [FIELD_ID]: FIELD };
      expect(meetsCondition(CONDITION, DATA)).toBeTruthy();
    });
    it('should match a sub-string that is in the field array', () => {
      const FIELD = ['alpha', 'bravo', 'charlie'];
      const VALUE = 'alp';
      const CONDITION = getCondition(op, VALUE);
      const DATA = { [FIELD_ID]: FIELD };
      expect(meetsCondition(CONDITION, DATA)).toBeTruthy();
    });
    it('should match a number that is in the field array', () => {
      const FIELD = [1, 2, 3];
      const VALUE = 1;
      const CONDITION = getCondition(op, VALUE);
      const DATA = { [FIELD_ID]: FIELD };
      expect(meetsCondition(CONDITION, DATA)).toBeTruthy();
    });
    it('should match a sub-string that is in the field string', () => {
      const FIELD = 'alphabravocharlie';
      const VALUE = 'alpha';
      const CONDITION = getCondition(op, VALUE);
      const DATA = { [FIELD_ID]: FIELD };
      expect(meetsCondition(CONDITION, DATA)).toBeTruthy();
    });
    it('should match a string that is in the field array regardless of case', () => {
      const FIELD = ['Alpha', 'bravo', 'charlie'];
      const VALUE = 'alpha';
      const CONDITION = getCondition(op, VALUE);
      const DATA = { [FIELD_ID]: FIELD };
      expect(meetsCondition(CONDITION, DATA)).toBeTruthy();
    });

    // Should reject...
    it('should reject a string that is missing from the field array', () => {
      const FIELD = ['alpha', 'bravo', 'charlie'];
      const VALUE = 'delta';
      const CONDITION = getCondition(op, VALUE);
      expect(meetsCondition(CONDITION, FIELD)).toBeFalsy();
    });
    it('should reject a number that is missing from the field array', () => {
      const FIELD = [1, 2, 3];
      const VALUE = 4;
      const CONDITION = getCondition(op, VALUE);
      expect(meetsCondition(CONDITION, FIELD)).toBeFalsy();
    });
    it('should reject a substring that is missing from the field string', () => {
      const FIELD = 'alphabravocharlie';
      const VALUE = 'delta';
      const CONDITION = getCondition(op, VALUE);
      expect(meetsCondition(CONDITION, FIELD)).toBeFalsy();
    });
    it('should reject any value when the field is an empty Array', () => {
      const FIELD = [];
      const VALUE = 'alpha';
      const CONDITION = getCondition(op, VALUE);
      expect(meetsCondition(CONDITION, FIELD)).toBeFalsy();
    });
    it('should reject any value when the field is an empty string', () => {
      const FIELD = '';
      const VALUE = 'alpha';
      const CONDITION = getCondition(op, VALUE);
      expect(meetsCondition(CONDITION, FIELD)).toBeFalsy();
    });
    it('should reject any field when the value is null', () => {
      const FIELD = ['alpha', 'bravo', 'charlie'];
      const VALUE = null;
      const CONDITION = getCondition(op, VALUE);
      expect(meetsCondition(CONDITION, FIELD)).toBeFalsy();
    });
    it('should reject any field when the value is undefined', () => {
      const FIELD = ['alpha', 'bravo', 'charlie'];
      const VALUE = undefined;
      const CONDITION = getCondition(op, VALUE);
      expect(meetsCondition(CONDITION, FIELD)).toBeFalsy();
    });
    it('should reject any value when the field is null', () => {
      const FIELD = null;
      const VALUE = 'alpha';
      const CONDITION = getCondition(op, VALUE);
      expect(meetsCondition(CONDITION, FIELD)).toBeFalsy();
    });
    it('should reject any value when the field is undefined', () => {
      const FIELD = undefined;
      const VALUE = 'alpha';
      const CONDITION = getCondition(op, VALUE);
      expect(meetsCondition(CONDITION, FIELD)).toBeFalsy();
    });
  });

  describe('unknown operator', () => {
    const op = 'definitely_not_a_real_operator';

    it('should reject anything regardless of the value', () => {
      const CONDITION = getCondition(op, 'a');
      TEST_VALUES.forEach((value) => {
        expect(meetsCondition(CONDITION, value)).toBeFalsy();
      });
    });
    it('should accept anything even with a null value', () => {
      const CONDITION = getCondition(op, null);
      TEST_VALUES.forEach((value) => {
        expect(meetsCondition(CONDITION, value)).toBeFalsy();
      });
    });
    it('should accept anything even with a undefined value', () => {
      const CONDITION = getCondition(op, null);
      TEST_VALUES.forEach((value) => {
        expect(meetsCondition(CONDITION, value)).toBeFalsy();
      });
    });
  });

  describe('invalid condition', () => {
    it('should accept anything when the condition is null', () => {
      TEST_VALUES.forEach((value) => {
        expect(meetsCondition(null, value)).toBeTruthy();
      });
    });
    it('should accept anything when the condition is undefined', () => {
      TEST_VALUES.forEach((value) => {
        expect(meetsCondition(undefined, value)).toBeTruthy();
      });
    });
    it('should accept anything when the condition is not an object', () => {
      TEST_VALUES.forEach((value) => {
        expect(meetsCondition('condition', value)).toBeTruthy();
      });
    });
  });
});
