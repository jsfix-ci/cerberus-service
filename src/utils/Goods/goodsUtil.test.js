import _ from 'lodash';

import { GoodsUtil } from '../index';

import mockTaskData from '../../__fixtures__/taskData_RoRo_Accompanied_AssigneeCurrentUser.fixture.json';
import { STRINGS } from '../constants';

describe('GoodsUtil', () => {
  let MOCK_TARGET_TASK = {};

  const INVALID_VALUES = [
    [undefined],
    [null],
    [''],
  ];

  beforeEach(() => {
    MOCK_TARGET_TASK = _.cloneDeep(mockTaskData);
  });

  it('should extract the goods node if present', () => {
    expect(GoodsUtil.get(MOCK_TARGET_TASK)).toMatchObject(mockTaskData.movement.goods);
  });

  it.each([
    [undefined],
    [null],
  ])('should return undefined when the goods node is not present', (goods) => {
    MOCK_TARGET_TASK.movement.goods = goods;
    expect(GoodsUtil.get(MOCK_TARGET_TASK)).toBeUndefined();
  });

  it('should extract the goods description if present', () => {
    const goods = GoodsUtil.get(MOCK_TARGET_TASK);
    expect(GoodsUtil.description(goods)).toEqual(mockTaskData.movement.goods.description);
  });

  it.each([
    ...INVALID_VALUES,
  ])(`should return ${STRINGS.UNKNOWN_TEXT} when description is invalid`, (description) => {
    MOCK_TARGET_TASK.movement.goods.description = description;
    const goods = GoodsUtil.get(MOCK_TARGET_TASK);
    expect(GoodsUtil.description(goods)).toEqual(STRINGS.UNKNOWN_TEXT);
  });

  it.each([
    [true, 'Yes'],
    [false, 'No'],
    [undefined, 'No'],
    [null, 'No'],
    ['', 'No'],
  ])('should extract the hazardous value if present', (hazardous, expected) => {
    const goods = GoodsUtil.get(MOCK_TARGET_TASK);
    goods.hazardous = hazardous;
    expect(GoodsUtil.hazardous(goods)).toEqual(expected);
  });
});
