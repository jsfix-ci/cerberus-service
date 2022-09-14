import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import {
  STRINGS,
  MOVEMENT_MODES,
  OPERATION,
  TASK_STATUS,
} from '../constants';

import { StringUtil } from '../index';

import { testRoroDataTouristWithVehicle,
  testRoroDataAccompaniedFreight,
  testRoroDataUnaccompaniedFreight,
  testRoroDataAccompaniedFreightNoTrailer,
  testRoroDataAccompaniedFreightNoVehicleNoTrailer } from '../../__fixtures__/roroData.fixture';

describe('StringUtil', () => {
  dayjs.extend(utc);

  const getDate = (value, unit, op) => {
    if (op === OPERATION.ADD) {
      return dayjs.utc().add(value, unit).format();
    }
    return dayjs.utc().subtract(value, unit).format();
  };

  it('should capitalise first letter of given', () => {
    const output = StringUtil.capitalizeFirst('hello');
    expect(output.charAt(0)).toEqual('H');
  });

  it('should not capitalize first letter of Integer at first position', () => {
    const output = StringUtil.capitalizeFirst('9hello');
    expect(output.charAt(0)).toEqual('9');
  });

  it('should not capitalize first letter of empty given', () => {
    const output = StringUtil.capitalizeFirst('');
    expect(output.charAt(0)).toEqual('');
  });

  it('should return expected text when movement is tourist (car)', () => {
    const output = StringUtil.modeIconText(testRoroDataTouristWithVehicle, MOVEMENT_MODES.TOURIST);
    expect(output).toEqual('Vehicle');
  });
  it('should return expected text when is accompanied', () => {
    const output = StringUtil.modeIconText(testRoroDataAccompaniedFreight, MOVEMENT_MODES.ACCOMPANIED_FREIGHT);
    expect(output).toEqual('Vehicle with Trailer');
  });

  it('should return expected text when movement is accompanied without trailer', () => {
    const output = StringUtil.modeIconText(testRoroDataAccompaniedFreightNoTrailer, MOVEMENT_MODES.ACCOMPANIED_FREIGHT);
    expect(output).toEqual('Vehicle');
  });

  it('should return expected text when movement is unaccompanied freight', () => {
    const output = StringUtil.modeIconText(testRoroDataUnaccompaniedFreight, MOVEMENT_MODES.UNACCOMPANIED_FREIGHT);
    expect(output).toEqual('Trailer');
  });

  it('should return expected text when movement is accompanied freight with no vehicle & trailer', () => {
    const output = StringUtil.modeIconText(testRoroDataAccompaniedFreightNoVehicleNoTrailer, MOVEMENT_MODES.ACCOMPANIED_FREIGHT);
    expect(output).toEqual('');
  });

  it('should return escaped input', () => {
    const GIVEN = '\nthis \\is a "test" \nnote';
    const EXPECTED = '\\nthis \\\\is a \\"test\\" \\nnote';
    expect(StringUtil.escape(GIVEN)).toEqual(EXPECTED);
  });

  it('should return an empty string when input is evaluated to be false', () => {
    const EXPECTED = '';
    expect(StringUtil.escape(undefined)).toEqual(EXPECTED);
  });

  it('should return a string version of the input when it is a digit', () => {
    const GIVEN = 0;
    const EXPECTED = '0';
    expect(StringUtil.escape(GIVEN)).toEqual(EXPECTED);
  });

  it('should return a relative formatted time text for a past activity', () => {
    const EXPECTED = 'arrived a day ago';
    const TIME = getDate(1, 'day', OPERATION.SUBTRACT);
    expect(StringUtil.voyageText(TIME)).toEqual(EXPECTED);
  });

  it('should return a relative formatted time text for a present/future activity', () => {
    const EXPECTED = 'arriving in a day';
    const TIME = getDate(1, 'day', OPERATION.ADD);
    expect(StringUtil.voyageText(TIME)).toEqual(EXPECTED);
  });

  it('should return unknown for an invalid datetime range', () => {
    const INVALID_DATESTIMES = [undefined, null, ''];
    INVALID_DATESTIMES.forEach((datetime) => expect(StringUtil.voyageText(datetime)).toEqual(STRINGS.UNKNOWN_TEXT));
  });

  it(`should evaluate to false when input is ${STRINGS.UNKNOWN_TEXT}`, () => {
    expect(StringUtil.replaceInvalid(STRINGS.UNKNOWN_TEXT)).toBeFalsy();
  });

  it(`should return given when input is not equal to ${STRINGS.UNKNOWN_TEXT}`, () => {
    const GIVEN = 'alpha';
    expect(StringUtil.replaceInvalid(GIVEN)).toEqual(GIVEN);
  });

  it.each([
    ['IN_PROGRESS', TASK_STATUS.IN_PROGRESS],
    [TASK_STATUS.NEW, TASK_STATUS.NEW],
    [TASK_STATUS.ISSUED, TASK_STATUS.ISSUED],
    [TASK_STATUS.COMPLETE, TASK_STATUS.COMPLETE],
    ['', ''],
    [null, null],
    [undefined, undefined],
  ])('should format input to camelCase', (given, expected) => {
    expect(StringUtil.format.camelCase(given)).toEqual(expected);
  });

  it.each([
    [TASK_STATUS.IN_PROGRESS, 'IN_PROGRESS'],
    [TASK_STATUS.NEW, TASK_STATUS.NEW.toUpperCase()],
    [TASK_STATUS.ISSUED, TASK_STATUS.ISSUED.toUpperCase()],
    [TASK_STATUS.COMPLETE, TASK_STATUS.COMPLETE.toUpperCase()],
    ['', ''],
    [null, null],
    [undefined, undefined],
  ])('should format input to snakeCase', (given, expected) => {
    expect(StringUtil.format.snakeCase(given)).toEqual(expected);
  });

  it('should return a formatted address', () => {
    const address = {
      entitySearchUrl: null,
      line1: 'University of Portsmouth',
      line2: null,
      line3: null,
      city: 'Portsmouth',
      postcode: 'PO1 2EF',
      country: 'GB',
    };
    expect(StringUtil.format.address(address)).toEqual('University of Portsmouth, Portsmouth, PO1 2EF, GB');
  });

  it.each([
    [undefined],
    [null],
    [''],
  ])('should unknown when address to format is invalid', (address) => {
    expect(StringUtil.format.address(address)).toEqual(STRINGS.UNKNOWN_TEXT);
  });
});
