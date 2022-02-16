import { modifyRoRoPassengersTaskList, hasCheckinDate, hasEta, hasCarrierCounts } from '../roroDataUtil';

import { testRoroData } from '../__fixtures__/roroData.fixture';

describe('RoRoData Util', () => {
  it('should return a modified roroData object with a list of 2 passengers', () => {
    const modifiedRoroData = modifyRoRoPassengersTaskList({ ...testRoroData });
    expect(modifiedRoroData.passengers.length).toEqual(2);
  });

  it('should return false if given empty', () => {
    const result = hasCheckinDate('');
    expect(result).toBeFalsy();
  });

  it('should return false if given null', () => {
    const result = hasCheckinDate(null);
    expect(result).toBeFalsy();
  });

  it('should return false if given undefined', () => {
    const result = hasCheckinDate(undefined);
    expect(result).toBeFalsy();
  });

  it('should return true if given not null, undefined or empty', () => {
    const result = hasCheckinDate('2022-01-22T10:12:55');
    expect(result).toBeTruthy();
  });

  it('should return false for hasEta if given empty', () => {
    const result = hasEta('');
    expect(result).toBeFalsy();
  });

  it('should return false for hasEta if given null', () => {
    const result = hasEta(null);
    expect(result).toBeFalsy();
  });

  it('should return false for hasEta if given undefined', () => {
    const result = hasEta(undefined);
    expect(result).toBeFalsy();
  });

  it('should return true for hasEta if given not null, undefined or empty', () => {
    const result = hasEta('2022-01-22T10:12:55');
    expect(result).toBeTruthy();
  });

  it('should true when all counts have non-null content', () => {
    const suppliedPassengerCounts = [
      {
        propName: 'infantCount',
      },
      {
        propName: 'childCount',
      },
      {
        propName: 'adultCount',
      },
      {
        propName: 'oapCount',
      },
    ];
    const result = hasCarrierCounts(suppliedPassengerCounts);
    expect(result).toBeTruthy();
  });
});
