import { RORO_ACCOMPANIED_FREIGHT, RORO_TOURIST, RORO_UNACCOMPANIED_FREIGHT } from '../../constants';
import { capitalizeFirstLetter, formatMovementModeIconText, escapeJSON } from '../stringConversion';
import { testRoroDataTouristWithVehicle, testRoroDataAccompaniedFreight, testRoroDataUnaccompaniedFreight,
  testRoroDataAccompaniedFreightNoTrailer,
  testRoroDataAccompaniedFreightNoVehicleNoTrailer } from '../__fixtures__/roroData.fixture';

describe('String Conversion', () => {
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
    const output = formatMovementModeIconText(testRoroDataTouristWithVehicle, RORO_TOURIST);
    expect(output).toEqual('Vehicle');
  });
  it('should return expected text when is accompanied', () => {
    const output = formatMovementModeIconText(testRoroDataAccompaniedFreight, RORO_ACCOMPANIED_FREIGHT);
    expect(output).toEqual('Vehicle with Trailer');
  });

  it('should return expected text when movement is accompanied without trailer', () => {
    const output = formatMovementModeIconText(testRoroDataAccompaniedFreightNoTrailer, RORO_ACCOMPANIED_FREIGHT);
    expect(output).toEqual('Vehicle');
  });

  it('should return expected text when movement is unaccompanied freight', () => {
    const output = formatMovementModeIconText(testRoroDataUnaccompaniedFreight, RORO_UNACCOMPANIED_FREIGHT);
    expect(output).toEqual('Trailer');
  });

  it('should return expected text when movement is accompanied freight with no vehicle & trailer', () => {
    const output = formatMovementModeIconText(testRoroDataAccompaniedFreightNoVehicleNoTrailer, RORO_ACCOMPANIED_FREIGHT);
    expect(output).toEqual('');
  });

  it('should return escaped input', () => {
    const GIVEN = '\nthis \\is a "test" \nnote';
    const EXPECTED = '\\nthis \\\\is a \\"test\\" \\nnote';
    expect(escapeJSON(GIVEN)).toEqual(EXPECTED);
  });

  it('should return an empty string when input is evaluated to be false', () => {
    const EXPECTED = '';
    expect(escapeJSON(undefined)).toEqual(EXPECTED);
  });

  it('should return a string version of the input when it is a digit', () => {
    const GIVEN = 0;
    const EXPECTED = '0';
    expect(escapeJSON(GIVEN)).toEqual(EXPECTED);
  });
});
