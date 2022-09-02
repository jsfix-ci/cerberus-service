import { LOCAL_STORAGE_KEYS, STRINGS, PATHS, TASK_STATUS } from '../constants';
import CommonUtil, { VIEW } from './commonUtil';

describe('CommonUtil', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should convert iso2 country codes to iso3 code', () => {
    const INPUT = 'AU';
    const EXPECTED = 'AUS';
    expect(CommonUtil.iso3Code(INPUT)).toEqual(EXPECTED);
  });

  it.each([
    ['AB'],
    [undefined],
    [null],
    [''],
  ])('should return unknown for invalid iso2 codes', (given) => {
    expect(CommonUtil.iso3Code(given)).toEqual(STRINGS.UNKNOWN_TEXT);
  });

  it('should return the movement stats node within an entity', () => {
    const entity = {
      movementStats: { alpha: 'alpha' },
    };
    expect(CommonUtil.movementStats(entity)).toMatchObject((entity.movementStats));
  });

  it.each([
    [undefined],
    [null],
  ])('should not return the movement stats node when it does not exist within an entity', (value) => {
    const entity = {
      movementStats: value,
    };
    expect(CommonUtil.movementStats(entity)).toBeUndefined();
  });

  it.each([
    [PATHS.AIRPAX, VIEW.AIRPAX],
    [PATHS.RORO, VIEW.RORO],
    [PATHS.RORO_V2, VIEW.RORO_V2],
    [undefined, VIEW.RORO],
  ])('should return the view based on the path', (path, expected) => {
    expect(CommonUtil.viewByPath(path)).toEqual(expected);
  });

  it.each([
    [0, TASK_STATUS.NEW],
    [1, TASK_STATUS.IN_PROGRESS],
    [2, TASK_STATUS.ISSUED],
    [3, TASK_STATUS.COMPLETE],
    [4, 'undefined'],
  ])('should set the correct task status by the selected tab index', (taskManagementTabIndex, expected) => {
    CommonUtil.setStatus(taskManagementTabIndex);
    expect(localStorage.getItem(LOCAL_STORAGE_KEYS.TASK_STATUS)).toEqual(expected);
  });
});
