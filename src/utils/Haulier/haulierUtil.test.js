import _ from 'lodash';

import { HaulierUtil } from '../index';

import mockTaskData from '../../__fixtures__/taskData_RoRo_Accompanied_AssigneeCurrentUser.fixture.json';
import { STRINGS } from '../constants';

describe('HaulierUtil', () => {
  let MOCK_TARGET_TASK = {};

  const INVALID_VALUES = [
    [undefined],
    [null],
    [''],
  ];

  beforeEach(() => {
    MOCK_TARGET_TASK = _.cloneDeep(mockTaskData);
  });

  it('should extract the haulier node if present', () => {
    expect(HaulierUtil.get(MOCK_TARGET_TASK)).toMatchObject(mockTaskData.movement.haulier);
  });

  it.each([
    [undefined],
    [null],
  ])('should return undefined when the haulier node is not present', (haulier) => {
    MOCK_TARGET_TASK.movement.haulier = haulier;
    expect(HaulierUtil.get(MOCK_TARGET_TASK)).toBeUndefined();
  });

  it('should extract the haulier name if present', () => {
    const haulier = HaulierUtil.get(MOCK_TARGET_TASK);
    expect(HaulierUtil.name(haulier)).toEqual(mockTaskData.movement.haulier.name);
  });

  it.each([
    ...INVALID_VALUES,
  ])(`should return ${STRINGS.UNKNOWN_TEXT} when haulier name is invalid`, (name) => {
    MOCK_TARGET_TASK.movement.haulier.name = name;
    const haulier = HaulierUtil.get(MOCK_TARGET_TASK);
    expect(HaulierUtil.name(haulier)).toEqual(STRINGS.UNKNOWN_TEXT);
  });

  it('should extract the haulier address if present', () => {
    const haulier = HaulierUtil.get(MOCK_TARGET_TASK);
    expect(HaulierUtil.address(haulier)).toMatchObject(mockTaskData.movement.haulier.address);
  });

  it.each([
    [undefined],
    [null],
  ])('should return undefined when the haulier address is not present', (address) => {
    MOCK_TARGET_TASK.movement.haulier.address = address;
    const haulier = HaulierUtil.get(MOCK_TARGET_TASK);
    expect(HaulierUtil.address(haulier)).toBeUndefined();
  });

  it('should extract the haulier phone number if present', () => {
    const haulier = HaulierUtil.get(MOCK_TARGET_TASK);
    expect(HaulierUtil.telephone(haulier)).toEqual(mockTaskData.movement.haulier.contacts.phone.value);
  });

  it.each([
    ...INVALID_VALUES,
  ])('should return unknown when the haulier phone number is not present', (phone) => {
    MOCK_TARGET_TASK.movement.haulier.contacts.phone.value = phone;
    const haulier = HaulierUtil.get(MOCK_TARGET_TASK);
    expect(HaulierUtil.telephone(haulier)).toEqual(STRINGS.UNKNOWN_TEXT);
  });

  it('should extract the haulier mobile number if present', () => {
    const haulier = HaulierUtil.get(MOCK_TARGET_TASK);
    expect(HaulierUtil.mobile(haulier)).toEqual(mockTaskData.movement.haulier.contacts.mobile.value);
  });

  it.each([
    ...INVALID_VALUES,
  ])('should return unknown when the haulier mobile number is not present', (mobile) => {
    MOCK_TARGET_TASK.movement.haulier.contacts.mobile.value = mobile;
    const haulier = HaulierUtil.get(MOCK_TARGET_TASK);
    expect(HaulierUtil.mobile(haulier)).toEqual(STRINGS.UNKNOWN_TEXT);
  });
});
