import _ from 'lodash';
import VesselUtil from './vesselUtil';

import mockTaskData from '../../__fixtures__/taskData_RoRo_Accompanied_AssigneeCurrentUser.fixture.json';

import { STRINGS } from '../constants';

describe('VesselUtil', () => {
  let MOCK_TARGET_TASK = {};

  const INVALID_VALUES = [
    [undefined],
    [null],
    [''],
  ];

  beforeEach(() => {
    MOCK_TARGET_TASK = _.cloneDeep(mockTaskData);
  });

  it('should extract the vessel node if present', () => {
    expect(VesselUtil.get(MOCK_TARGET_TASK)).toMatchObject(mockTaskData.movement.vessel);
  });

  it.each([
    [undefined],
    [null],
  ])('should return undefined when the vessel node is not present', (vessel) => {
    MOCK_TARGET_TASK.movement.vessel = vessel;
    expect(VesselUtil.get(MOCK_TARGET_TASK)).toBeUndefined();
  });

  it('should extract the vessel name if present', () => {
    const vessel = VesselUtil.get(MOCK_TARGET_TASK);
    expect(VesselUtil.name(vessel)).toEqual(mockTaskData.movement.vessel.name);
  });

  it.each([
    ...INVALID_VALUES,
  ])(`should return ${STRINGS.UNKNOWN_TEXT} when vessel name is invalid`, (name) => {
    MOCK_TARGET_TASK.movement.vessel.name = name;
    const vessel = VesselUtil.get(MOCK_TARGET_TASK);
    expect(VesselUtil.name(vessel)).toEqual(STRINGS.UNKNOWN_TEXT);
  });

  it('should extract the vessel operator if present', () => {
    const vessel = VesselUtil.get(MOCK_TARGET_TASK);
    expect(VesselUtil.operator(vessel)).toEqual(mockTaskData.movement.vessel.operator);
  });

  it.each([
    ...INVALID_VALUES,
  ])(`should return ${STRINGS.UNKNOWN_TEXT} when vessel operator is invalid`, (operator) => {
    MOCK_TARGET_TASK.movement.vessel.operator = operator;
    const vessel = VesselUtil.get(MOCK_TARGET_TASK);
    expect(VesselUtil.operator(vessel)).toEqual(STRINGS.UNKNOWN_TEXT);
  });
});
