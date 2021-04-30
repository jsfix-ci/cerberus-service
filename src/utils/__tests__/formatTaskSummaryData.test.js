import formatTaskData from '../formatTaskSummaryData';
import { testInputDataFieldsComplete, testInputDataFieldsEmpty, testOutputDataFieldsComplete, testOutputDataFieldsEmpty } from '../__fixtures__/taskSummaryData.fixture';

describe('formatting task summary data', () => {
  it('should return an object of formatted data', () => {
    const formattedData = formatTaskData(testInputDataFieldsComplete);
    expect(formattedData).toEqual(testOutputDataFieldsComplete);
  });

  it('should return user friendly results for null/undefined fields', () => {
    const formattedData = formatTaskData(testInputDataFieldsEmpty);
    expect(formattedData).toEqual(testOutputDataFieldsEmpty);
  });
});
