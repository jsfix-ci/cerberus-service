/* eslint-disable no-unused-vars */
import { NumberUtil } from '../index';

describe('NumberUtil', () => {
  it('should do something', () => {
    // TODO What does the number util do?
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
});
