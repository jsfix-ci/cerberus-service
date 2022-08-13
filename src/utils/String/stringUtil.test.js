import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import {
  STRINGS,
  MOVEMENT_MODES,
  OPERATION,
  TASK_STATUS,
} from '../constants';

import { capitalizeFirstLetter,
  formatMovementModeIconText,
  formatTaskStatusToCamelCase,
  formatTaskStatusToSnakeCase,
  escapeString,
  formatVoyageText,
  replaceInvalidValues } from './stringUtil';

import { testRoroDataTouristWithVehicle,
  testRoroDataAccompaniedFreight,
  testRoroDataUnaccompaniedFreight,
  testRoroDataAccompaniedFreightNoTrailer,
  testRoroDataAccompaniedFreightNoVehicleNoTrailer } from '../__fixtures__/roroData.fixture';

describe('StringUtil', () => {
  dayjs.extend(utc);

  const getDate = (value, unit, op) => {
    if (op === OPERATION.ADD) {
      return dayjs.utc().add(value, unit).format();
    }
    return dayjs.utc().subtract(value, unit).format();
  };

  it('should capitalise first letter of given', () => {
    const output = capitalizeFirstLetter('hello');
    expect(output.charAt(0)).toEqual('H');
  });

  it('should not capitalize first letter of Integer at first position', () => {
    const output = capitalizeFirstLetter('9hello');
    expect(output.charAt(0)).toEqual('9');
  });

  it('should not capitalize first letter of empty given', () => {
    const output = capitalizeFirstLetter('');
    expect(output.charAt(0)).toEqual('');
  });

  it('should return expected text when movement is tourist (car)', () => {
    const output = formatMovementModeIconText(testRoroDataTouristWithVehicle, MOVEMENT_MODES.TOURIST);
    expect(output).toEqual('Vehicle');
  });
  it('should return expected text when is accompanied', () => {
    const output = formatMovementModeIconText(testRoroDataAccompaniedFreight, MOVEMENT_MODES.ACCOMPANIED_FREIGHT);
    expect(output).toEqual('Vehicle with Trailer');
  });

  it('should return expected text when movement is accompanied without trailer', () => {
    const output = formatMovementModeIconText(testRoroDataAccompaniedFreightNoTrailer, MOVEMENT_MODES.ACCOMPANIED_FREIGHT);
    expect(output).toEqual('Vehicle');
  });

  it('should return expected text when movement is unaccompanied freight', () => {
    const output = formatMovementModeIconText(testRoroDataUnaccompaniedFreight, MOVEMENT_MODES.UNACCOMPANIED_FREIGHT);
    expect(output).toEqual('Trailer');
  });

  it('should return expected text when movement is accompanied freight with no vehicle & trailer', () => {
    const output = formatMovementModeIconText(testRoroDataAccompaniedFreightNoVehicleNoTrailer, MOVEMENT_MODES.ACCOMPANIED_FREIGHT);
    expect(output).toEqual('');
  });

  it('should return escaped input', () => {
    const GIVEN = '\nthis \\is a "test" \nnote';
    const EXPECTED = '\\nthis \\\\is a \\"test\\" \\nnote';
    expect(escapeString(GIVEN)).toEqual(EXPECTED);
  });

  it('should return an empty string when input is evaluated to be false', () => {
    const EXPECTED = '';
    expect(escapeString(undefined)).toEqual(EXPECTED);
  });

  it('should return a string version of the input when it is a digit', () => {
    const GIVEN = 0;
    const EXPECTED = '0';
    expect(escapeString(GIVEN)).toEqual(EXPECTED);
  });

  it('should return a relative formatted time text for a past activity', () => {
    const EXPECTED = 'arrived a day ago';
    const TIME = getDate(1, 'day', OPERATION.SUBTRACT);
    expect(formatVoyageText(TIME)).toEqual(EXPECTED);
  });

  it('should return a relative formatted time text for a present/future activity', () => {
    const EXPECTED = 'arriving in a day';
    const TIME = getDate(1, 'day', OPERATION.ADD);
    expect(formatVoyageText(TIME)).toEqual(EXPECTED);
  });

  it('should return unknown for an invalid datetime range', () => {
    const INVALID_DATESTIMES = [undefined, null, ''];
    INVALID_DATESTIMES.forEach((datetime) => expect(formatVoyageText(datetime)).toEqual(STRINGS.UNKNOWN_TEXT));
  });

  it(`should evaluate to false when input is ${STRINGS.UNKNOWN_TEXT}`, () => {
    expect(replaceInvalidValues(STRINGS.UNKNOWN_TEXT)).toBeFalsy();
  });

  it(`should return given when input is not equal to ${STRINGS.UNKNOWN_TEXT}`, () => {
    const GIVEN = 'alpha';
    expect(replaceInvalidValues(GIVEN)).toEqual(GIVEN);
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
    expect(formatTaskStatusToCamelCase(given)).toEqual(expected);
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
    expect(formatTaskStatusToSnakeCase(given)).toEqual(expected);
  });
});
