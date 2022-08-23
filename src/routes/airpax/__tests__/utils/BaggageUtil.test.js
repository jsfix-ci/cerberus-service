import { BaggageUtil } from '../../utils';
import { UNKNOWN_TEXT } from '../../../../constants';

describe('BaggageUtil', () => {
  let targetTaskMin;
  let invalidValues = [
    [undefined, UNKNOWN_TEXT],
    [null, UNKNOWN_TEXT],
    ['', UNKNOWN_TEXT],
  ];

  let checkedBagsCounts = [
    [2, '2 bags'],
    [1, '1 bag'],
    [0, 'None'],
  ];

  let invalidBagsCounts = [
    [0, 0],
    ['Unknown', 0],
  ];

  beforeEach(() => {
    targetTaskMin = {
      movement: {
        baggage: {
          numberOfCheckedBags: 1,
          weight: '1kg',
        },
      },
    };
  });

  it('should return a baggage object', () => {
    const expected = {
      numberOfCheckedBags: 1,
      weight: '1kg',
    };

    const output = BaggageUtil.get(targetTaskMin);
    expect(output).toEqual(expected);
  });

  it('should return the number of checked bags if present', () => {
    const expected = '1 checked bag';
    const output = BaggageUtil.checked(BaggageUtil.get(targetTaskMin));
    expect(output).toEqual(expected);
  });

  it('should return no checked bags when number of checked bags is 0', () => {
    targetTaskMin.movement.baggage.numberOfCheckedBags = 0;
    const expected = 'No checked bags';
    const output = BaggageUtil.checked(BaggageUtil.get(targetTaskMin));
    expect(output).toEqual(expected);
  });

  it('should return none when number of checked bags is 0 for task details', () => {
    targetTaskMin.movement.baggage.numberOfCheckedBags = 0;
    const expected = 'None';
    const output = BaggageUtil.checked(BaggageUtil.get(targetTaskMin), true);
    expect(output).toEqual(expected);
  });

  it('should return number of checked bags', () => {
    targetTaskMin.movement.baggage.numberOfCheckedBags = 2;
    const expected = '2 checked bags';
    const output = BaggageUtil.checked(BaggageUtil.get(targetTaskMin));
    expect(output).toEqual(expected);
  });

  it('should return null if no baggage object is found', () => {
    targetTaskMin.movement.baggage = null;
    const output = BaggageUtil.get(targetTaskMin);
    expect(output).toBeNull();
  });

  it('should return baggage weight if present', () => {
    targetTaskMin.movement.baggage.weight = '1kg';
    const output = BaggageUtil.weight(BaggageUtil.get(targetTaskMin));
    expect(output).toEqual('1kg');
  });

  it('should add kg to baggage weight if not present in the payload', () => {
    targetTaskMin.movement.baggage.weight = '5';
    const output = BaggageUtil.weight(BaggageUtil.get(targetTaskMin));
    expect(output).toEqual('5kg');
  });

  it.each(invalidValues)(
    'should return unknown for invalid weight values', (invalidValue, expected) => {
      targetTaskMin.movement.baggage.weight = invalidValue;
      const output = BaggageUtil.weight(BaggageUtil.get(targetTaskMin));
      expect(output).toEqual(expected);
    },
  );

  it('should return unknown for weight returning a text kg & checked bags are greater than 0', () => {
    targetTaskMin.movement.baggage = { weight: 'kg', numberOfCheckedBags: 1 };
    const output = BaggageUtil.weight(BaggageUtil.get(targetTaskMin));
    expect(output).toEqual(UNKNOWN_TEXT);
  });

  it.each(invalidBagsCounts)(
    'should return 0 for invalid checked bags values', (invalidBagsCount, expected) => {
      targetTaskMin.movement.baggage.numberOfCheckedBags = invalidBagsCount;
      const output = BaggageUtil.weight(BaggageUtil.get(targetTaskMin));
      expect(output).toEqual(expected);
    },
  );

  it('should return 0 if baggage weight is 0kg', () => {
    targetTaskMin.movement.baggage.weight = '0kg';
    const output = BaggageUtil.weight(BaggageUtil.get(targetTaskMin));
    expect(output).toEqual(0);
  });

  it('should return Unknown if count of the checked bags return Unknown', () => {
    targetTaskMin.movement.baggage.numberOfCheckedBags = UNKNOWN_TEXT;
    const output = BaggageUtil.checkedCount(BaggageUtil.get(targetTaskMin));
    expect(output).toEqual(UNKNOWN_TEXT);
  });

  it('should return Unknown if no Tags numbers are found', () => {
    const output = BaggageUtil.tags(targetTaskMin.movement.baggage);
    expect(output).toBe('Unknown');
  });

  it('should return tags as comma separated strings if present', () => {
    targetTaskMin.movement.baggage.tags = [
      '739238',
      '739239',
      '739240',
    ];
    const output = BaggageUtil.tags(targetTaskMin.movement.baggage);
    expect(output).toEqual('739238, 739239, 739240');
  });

  it.each(invalidValues)(
    'should return unknown for invalid number of checked bags', (invalidValue, expected) => {
      targetTaskMin.movement.baggage.numberOfCheckedBags = invalidValue;
      const output = BaggageUtil.checkedCount(BaggageUtil.get(targetTaskMin));
      expect(output).toEqual(expected);
    },
  );

  it.each(checkedBagsCounts)(
    'should return formatted checked bag count for valid number of checked bags', (bagCount, expected) => {
      targetTaskMin.movement.baggage.numberOfCheckedBags = bagCount;
      const output = BaggageUtil.formatCheckedCount(BaggageUtil.get(targetTaskMin));
      expect(output).toEqual(expected);
    },
  );

  it.each(invalidValues)(
    'should return formatted checked bag count for valid number of checked bags', (invalidValue, expected) => {
      targetTaskMin.movement.baggage.numberOfCheckedBags = invalidValue;
      const output = BaggageUtil.formatCheckedCount(BaggageUtil.get(targetTaskMin));
      expect(output).toEqual(expected);
    },
  );
});
