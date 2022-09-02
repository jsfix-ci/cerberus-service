import getFilter from './getFilter';
import Filter from './Filter';

import { VIEW } from '../../../utils/Common/commonUtil';

describe('Custom.getFilter', () => {
  it.each([
    [VIEW.AIRPAX, Filter],
    [VIEW.RORO_V2, Filter],
    ['INVALID_VIEW', undefined],
  ])('should return an appropriate component given view', (view, expected) => {
    const component = getFilter(view,
      'test-user',
      'test-task-status',
      {},
      [],
      { alpha: {} },
      jest.fn(),
      jest.fn());

    expect(component?.type).toEqual(expected);
  });
});
