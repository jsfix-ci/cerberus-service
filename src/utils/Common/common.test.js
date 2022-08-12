import { UNKNOWN_TEXT } from '../constants';
import Common from './common';

describe('utils.Common', () => {
  it('should convert iso2 country codes to iso3 code', () => {
    const INPUT = 'AU';
    const EXPECTED = 'AUS';
    expect(Common.iso3Code(INPUT)).toEqual(EXPECTED);
  });

  it('should eturn unknown for invalid iso2 codes', () => {
    const INVALID_ISO2_CODES = ['AB', undefined, null, ''];
    INVALID_ISO2_CODES.forEach((code) => {
      expect(Common.iso3Code(code)).toEqual(UNKNOWN_TEXT);
    });
  });
});
