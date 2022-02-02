import formatGender from '../genderFormatter';

describe('Gender Formatter', () => {
  it('should return Male for M given', () => {
    const gender = formatGender('M');
    expect(gender).toEqual('Male');
  });

  it('should return Female for F given', () => {
    const gender = formatGender('F');
    expect(gender).toEqual('Female');
  });

  it('should return Unknown for an empty string given', () => {
    const gender = formatGender('');
    expect(gender).toEqual('Unknown');
  });

  it('should return Unknown for a null given', () => {
    const gender = formatGender(null);
    expect(gender).toEqual('Unknown');
  });

  it('should return Unknown for a undefined given', () => {
    const gender = formatGender(undefined);
    expect(gender).toEqual('Unknown');
  });

  it('should return Unknown for an integer given', () => {
    const gender = formatGender(1);
    expect(gender).toEqual('Unknown');
  });
});
