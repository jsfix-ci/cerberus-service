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

  it('should get the account address', () => {
    const account = AccountUtil.get(TARGET_TASK);
    expect(AccountUtil.address(account)).toMatchObject(mockTargetTask.movement.account.address);
  });

  it.each([
    [undefined],
    [null],
  ])('should return undefined when the account address is not present', (address) => {
    TARGET_TASK.movement.account.address = address;
    const account = AccountUtil.get(TARGET_TASK);
    expect(AccountUtil.address(account)).toBeUndefined();
  });

  it('should get the account mobile number', () => {
    const account = AccountUtil.get(TARGET_TASK);
    expect(AccountUtil.mobile(account)).toEqual(mockTargetTask.movement.account.contacts.mobile.value);
  });

  it.each([
    [undefined],
    [null],
    [''],
  ])('should return unknown when the account mobile number is not found.', (mobile) => {
    TARGET_TASK.movement.account.contacts.mobile.value = mobile;
    const account = AccountUtil.get(TARGET_TASK);
    expect(AccountUtil.mobile(account)).toEqual(STRINGS.UNKNOWN_TEXT);
  });

  it('should get the account telephone number', () => {
    const account = AccountUtil.get(TARGET_TASK);
    expect(AccountUtil.telephone(account)).toEqual(mockTargetTask.movement.account.contacts.phone.value);
  });

  it.each([
    [undefined],
    [null],
    [''],
  ])('should return unknown when the account mobile number is not found.', (phone) => {
    TARGET_TASK.movement.account.contacts.phone.value = phone;
    const account = AccountUtil.get(TARGET_TASK);
    expect(AccountUtil.telephone(account)).toEqual(STRINGS.UNKNOWN_TEXT);
  });

  it('should get the account reference number', () => {
    const account = AccountUtil.get(TARGET_TASK);
    expect(AccountUtil.reference(account)).toEqual(mockTargetTask.movement.account.reference);
  });

  it.each([
    [undefined],
    [null],
    [''],
  ])('should return unknown when the account reference number is not found.', (reference) => {
    TARGET_TASK.movement.account.reference = reference;
    const account = AccountUtil.get(TARGET_TASK);
    expect(AccountUtil.reference(account)).toEqual(STRINGS.UNKNOWN_TEXT);
  });

  it('should get the account short name', () => {
    const account = AccountUtil.get(TARGET_TASK);
    expect(AccountUtil.shortName(account)).toEqual(mockTargetTask.movement.account.shortName);
  });

  it.each([
    [undefined],
    [null],
    [''],
  ])('should return unknown when the account reference number is not found.', (shortName) => {
    TARGET_TASK.movement.account.shortName = shortName;
    const account = AccountUtil.get(TARGET_TASK);
    expect(AccountUtil.shortName(account)).toEqual(STRINGS.UNKNOWN_TEXT);
  });
});
