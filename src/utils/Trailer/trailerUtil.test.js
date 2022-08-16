import _ from 'lodash';
import TrailerUtil from './trailerUtil';

import mockTaskData from '../../__fixtures__/taskData_RoRo_Accompanied_AssigneeCurrentUser.fixture.json';
import { STRINGS } from '../constants';

describe('TrailerUtil', () => {
  let MOCK_TARGET_TASK = {};

  const INVALID_VALUES = [
    [undefined],
    [null],
    [''],
  ];

  beforeEach(() => {
    MOCK_TARGET_TASK = _.cloneDeep(mockTaskData);
  });

  it('should extract the trailer node if present', () => {
    expect(TrailerUtil.get(MOCK_TARGET_TASK)).toMatchObject(mockTaskData.movement.trailer);
  });

  it.each([
    [undefined],
    [null],
  ])('should return undefined when the trailer node is not present', (trailer) => {
    MOCK_TARGET_TASK.movement.trailer = trailer;
    expect(TrailerUtil.get(MOCK_TARGET_TASK)).toBeUndefined();
  });

  it('should extract the trailer type if present', () => {
    const trailer = TrailerUtil.get(MOCK_TARGET_TASK);
    expect(TrailerUtil.type(trailer)).toEqual(mockTaskData.movement.trailer.type);
  });

  it.each([
    ...INVALID_VALUES,
  ])(`should return ${STRINGS.UNKNOWN_TEXT} when trailer type is invalid`, (type) => {
    MOCK_TARGET_TASK.movement.trailer.type = type;
    const trailer = TrailerUtil.get(MOCK_TARGET_TASK);
    expect(TrailerUtil.type(trailer)).toEqual(STRINGS.UNKNOWN_TEXT);
  });
});
