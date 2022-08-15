import { STRINGS } from '../constants';
import CommonUtil from './commonUtil';

describe('utils.Common', () => {
  it('should convert iso2 country codes to iso3 code', () => {
    const INPUT = 'AU';
    const EXPECTED = 'AUS';
    expect(CommonUtil.iso3Code(INPUT)).toEqual(EXPECTED);
  });

  it('should return unknown for invalid iso2 codes', () => {
    const INVALID_ISO2_CODES = ['AB', undefined, null, ''];
    INVALID_ISO2_CODES.forEach((code) => {
      expect(CommonUtil.iso3Code(code)).toEqual(STRINGS.UNKNOWN_TEXT);
    });
  });
});
