import { TaskSummaryDataUtil } from '../index';
import { testInputDataFieldsComplete,
  testInputDataFieldsEmpty,
  testOutputDataFieldsComplete,
  testOutputDataFieldsEmpty } from '../../__fixtures__/taskSummaryRoRoData.fixture';

describe('formatting task summary data', () => {
  it('should return an object of formatted data', () => {
    const formattedData = TaskSummaryDataUtil.format(testInputDataFieldsComplete);
    expect(formattedData).toEqual(testOutputDataFieldsComplete);
  });

  it('should return user friendly results for null/undefined fields', () => {
    const formattedData = TaskSummaryDataUtil.format(testInputDataFieldsEmpty);
    expect(formattedData).toEqual(testOutputDataFieldsEmpty);
  });
});
