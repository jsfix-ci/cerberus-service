import { NumberUtil } from '../index';

describe('NumberUtil', () => {
  it.each([
    [1000, '1,000'],
    [2500, '2,500'],
    [78632, '78,632'],
    [10000000, '10,000,000'],
    ['10000000', '10,000,000'],
  ])('should format long numbers with commas', (given, expected) => {
    expect(NumberUtil.withComma(given)).toEqual(expected);
  });

  it.each([
    [''],
    [null],
    [undefined],
    ['ABCDEFGHIJ'],
  ])('should return the given value when invalid', (given) => {
    expect(NumberUtil.withComma(given)).toEqual(given);
  });

  it('should validate false if given is a number', () => {
    expect(NumberUtil.notANumber(10)).toBeFalsy();
  });

  it('should validate false if given is a number and is 0', () => {
    expect(NumberUtil.notANumber(0)).toBeFalsy();
  });

  it('should validate false if given is a number, in a string representation', () => {
    expect(NumberUtil.notANumber('10')).toBeFalsy();
  });

  it('should validate true if given is null and not a number', () => {
    expect(NumberUtil.notANumber(null)).toBeTruthy();
  });

  it('should validate true if given is undefined and not a number', () => {
    expect(NumberUtil.notANumber(undefined)).toBeTruthy();
  });

  it('should validate true if given is an empty string and not a number', () => {
    expect(NumberUtil.notANumber('')).toBeTruthy();
  });

  it('should validate true if given is a string of mixed characters and not a number', () => {
    expect(NumberUtil.notANumber('XY1_C!')).toBeTruthy();
  });

  it('should return true if number equates to 0', () => {
    expect(NumberUtil.checkZeroCount(0)).toBeTruthy();
  });

  it('should return true if number equates to a string version of 0', () => {
    expect(NumberUtil.checkZeroCount('0')).toBeTruthy();
  });

  it.each([
    [null],
    [undefined],
    [''],
    ['A'],
    ['_'],
  ])('should return false when value does not equate to 0', (value) => {
    expect(NumberUtil.checkZeroCount(value)).toBeFalsy();
  });

  it('should reset a negative number to 0', () => {
    const output = NumberUtil.resetZero(-1);
    expect(output).toEqual(0);
  });

  it.each([
    [16],
    [1.5],
    [12],
    [2],
    ['2'],
  ])('should evaluate to true when given greater than zero', (value) => {
    expect(NumberUtil.greaterThanZero(value)).toBeTruthy();
  });

  it.each([
    [-1],
    [0],
    ['A'],
    ['-!'],
  ])('should evaluate to false when value is less than or equal to zero', (value) => {
    expect(NumberUtil.greaterThanZero(value)).toBeFalsy();
  });
});
