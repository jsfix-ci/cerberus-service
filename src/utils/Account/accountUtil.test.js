import _ from 'lodash';
import { AccountUtil } from '../index';

// Mock Data
import mockTargetTask from '../../__fixtures__/taskData_RoRo_Accompanied_AssigneeCurrentUser.fixture.json';
import { STRINGS } from '../constants';

describe('AccountUtil', () => {
  let TARGET_TASK = {};

  beforeEach(() => {
    TARGET_TASK = _.cloneDeep(mockTargetTask);
  });

  it('should get account if present', () => {
    const account = AccountUtil.get(TARGET_TASK);
    expect(account).toMatchObject(mockTargetTask.movement.account);
  });

  it('should return undefined when account is not present', () => {
    TARGET_TASK.movement.account = null;
    expect(AccountUtil.get(TARGET_TASK)).toBeUndefined();
  });

  it('should get account name if present', () => {
    const account = AccountUtil.get(TARGET_TASK);
    expect(AccountUtil.name(account)).toEqual(mockTargetTask.movement.account.name);
  });

  it.each([
    [null],
    [undefined],
    [''],
  ])(`should return ${STRINGS.UNKNOWN_TEXT} when account name is not present`, (given) => {
    TARGET_TASK.movement.account = given;
    const account = AccountUtil.get(TARGET_TASK);
    expect(AccountUtil.name(account)).toEqual(STRINGS.UNKNOWN_TEXT);
  });
});
