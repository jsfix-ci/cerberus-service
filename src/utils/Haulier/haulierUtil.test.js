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
});
