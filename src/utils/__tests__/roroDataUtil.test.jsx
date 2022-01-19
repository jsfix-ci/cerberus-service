import { modifyRoRoPassengersTaskList, hasCheckinDate } from '../roroDataUtil';

import testRoroData from '../__fixtures__/roroData.fixture';

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
});
