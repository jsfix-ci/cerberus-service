import modify from '../roroDataUtil';

import testRoroData from '../__fixtures__/roroData.fixture';

describe('RoRoData Util', () => {
  it('should return a modified roroData object with a list of 2 passengers', () => {
    const modifiedRoroData = modify({ ...testRoroData });
    expect(modifiedRoroData.passengers.length).toEqual(2);
  });
});
