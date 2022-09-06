import getTisForm from './getTisForm';

import { VIEW } from '../../Common/commonUtil';

// JSON
import airpaxTisCerberus from '../../../forms/airpaxTisCerberus';

describe('components.utils.getTisForm', () => {
  it('should load the airpax tis form', () => {
    expect(getTisForm(VIEW.AIRPAX)).toMatchObject(airpaxTisCerberus);
  });

  it.each([
    [null],
    [undefined],
    [''],
  ])('should return null when the given view is invalid', (view) => {
    expect(getTisForm(view)).toBeNull();
  });
});
