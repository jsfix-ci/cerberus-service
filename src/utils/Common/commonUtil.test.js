import { LOCAL_STORAGE_KEYS, STRINGS, TASK_LIST_PATHS, TASK_STATUS, VIEW } from '../constants';
import CommonUtil from './commonUtil';

describe('CommonUtil', () => {
  const BUSINESS_KEY = 'DEV-0123456-789';

  const MOCK_TARGET_TASK = {
    id: BUSINESS_KEY,
  };

  const INVALID_VIEWS = [
    [VIEW.NONE],
    [null],
    [''],
    ['invalid-view'],
  ];

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

  it.each([
    [TASK_LIST_PATHS.AIRPAX, VIEW.AIRPAX],
    [TASK_LIST_PATHS.RORO, VIEW.RORO],
    [TASK_LIST_PATHS.RORO_V2, VIEW.RORO],
    [`${TASK_LIST_PATHS.AIRPAX}/${BUSINESS_KEY}`, VIEW.AIRPAX],
    [`${TASK_LIST_PATHS.RORO}/${BUSINESS_KEY}`, VIEW.RORO],
    [`${TASK_LIST_PATHS.RORO_V2}/${BUSINESS_KEY}`, VIEW.RORO],
  ])('should set & return the view based on location', (location, expected) => {
    localStorage.clear();
    const view = CommonUtil.setViewAndGet(location);
    expect(localStorage.getItem(LOCAL_STORAGE_KEYS.VIEW)).not.toBeNull();
    expect(view).toEqual(expected);
  });

  it.each([
    [''],
    [null],
    [undefined],
  ])('should set & return the view when there is no valid location', (location) => {
    localStorage.clear();
    const view = CommonUtil.setViewAndGet(location);
    expect(localStorage.getItem(LOCAL_STORAGE_KEYS.VIEW)).not.toBeNull();
    expect(view).toEqual(VIEW.NONE);
  });

  it.each([
    [VIEW.AIRPAX, TASK_LIST_PATHS.AIRPAX],
    [VIEW.RORO, TASK_LIST_PATHS.RORO_V2],
  ])('should generate the unclaim redirect URL when view is AirPax', (view, expected) => {
    expect(CommonUtil.unclaimRedirect(view)).toEqual(expected);
  });

  it.each([
    ...INVALID_VIEWS,
  ])('should return undefined when no valid view is provided', (view) => {
    expect(CommonUtil.unclaimRedirect(view)).toBeUndefined();
  });

  it.each([
    [VIEW.AIRPAX, `${TASK_LIST_PATHS.AIRPAX}/${BUSINESS_KEY}`],
    [VIEW.RORO, `${TASK_LIST_PATHS.RORO_V2}/${BUSINESS_KEY}`],
  ])('should generate the task list page URL for each valid view supplied', (view, expected) => {
    expect(CommonUtil.taskListURL(view, BUSINESS_KEY)).toEqual(expected);
  });

  it.each([
    ...INVALID_VIEWS,
  ])('should return undefined in place of the task list page URL when an invalid view is passed', (view) => {
    expect(CommonUtil.taskListURL(view, BUSINESS_KEY)).toBeUndefined();
  });

  it.each([
    [VIEW.AIRPAX, LOCAL_STORAGE_KEYS.AIRPAX_FILTERS],
    [VIEW.RORO, LOCAL_STORAGE_KEYS.RORO_FILTERS],
  ])('should return the appropriate filter key for the view', (view, expected) => {
    expect(CommonUtil.filtersKeyByView(view)).toEqual(expected);
  });

  it.each([
    ...INVALID_VIEWS,
  ])('should not return a filter key for the any invalid view', (view) => {
    expect(CommonUtil.filtersKeyByView(view)).toBeUndefined();
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
    [VIEW.AIRPAX, LOCAL_STORAGE_KEYS.AIRPAX_TASK_STATUS],
    [VIEW.RORO, LOCAL_STORAGE_KEYS.RORO_TASK_STATUS],
  ])('should remove the task status local storage key by for each view', (view, localStorageKey) => {
    localStorage.setItem(localStorageKey, 'test-key');
    expect(localStorage.getItem(localStorageKey)).not.toBeNull();
    CommonUtil.removeTaskStatusByView(view);
    expect(localStorage.getItem(localStorageKey)).toBeNull();
  });

  it.each([
    [VIEW.AIRPAX, LOCAL_STORAGE_KEYS.AIRPAX_FILTERS],
    [VIEW.RORO, LOCAL_STORAGE_KEYS.RORO_FILTERS],
  ])('should remove the filters local storage key by for each view', (view, localStorageKey) => {
    localStorage.setItem(localStorageKey, 'test-filter');
    expect(localStorage.getItem(localStorageKey)).not.toBeNull();
    CommonUtil.removeFiltersByView(view);
    expect(localStorage.getItem(localStorageKey)).toBeNull();
  });

  it.each([
    [VIEW.AIRPAX, TASK_STATUS.NEW],
    [VIEW.AIRPAX, TASK_STATUS.IN_PROGRESS],
    [VIEW.AIRPAX, TASK_STATUS.ISSUED],
    [VIEW.AIRPAX, TASK_STATUS.COMPLETE],
    [VIEW.RORO, TASK_STATUS.NEW],
    [VIEW.RORO, TASK_STATUS.IN_PROGRESS],
    [VIEW.RORO, TASK_STATUS.ISSUED],
    [VIEW.RORO, TASK_STATUS.COMPLETE],
  ])('should set the task status to local storage for each view', (view, taskStatus) => {
    CommonUtil.setTaskStatusByView(view, taskStatus);
    const taskStatusKey = CommonUtil.taskStatusKeyByView(view);
    expect(localStorage.getItem(taskStatusKey)).not.toBeNull();
    expect(localStorage.getItem(taskStatusKey)).toEqual(taskStatus);
  });

  it.each([
    [VIEW.AIRPAX, `${TASK_LIST_PATHS.AIRPAX}/${BUSINESS_KEY}`],
    [VIEW.RORO, `${TASK_LIST_PATHS.RORO_V2}/${BUSINESS_KEY}`],
  ])('should generate the source redirect URL from view', (view, expected) => {
    expect(CommonUtil.sourceRedirect(view, BUSINESS_KEY)).toEqual(expected);
  });

  it.each([
    ...INVALID_VIEWS,
  ])('should not generate the source redirect URL from view', (view) => {
    expect(CommonUtil.sourceRedirect(view, BUSINESS_KEY)).toBeUndefined();
  });

  it.each([
    [VIEW.AIRPAX, TASK_STATUS.NEW],
    [VIEW.AIRPAX, TASK_STATUS.IN_PROGRESS],
    [VIEW.AIRPAX, TASK_STATUS.ISSUED],
    [VIEW.AIRPAX, TASK_STATUS.COMPLETE],
    [VIEW.RORO, TASK_STATUS.NEW],
    [VIEW.RORO, TASK_STATUS.IN_PROGRESS],
    [VIEW.RORO, TASK_STATUS.ISSUED],
    [VIEW.RORO, TASK_STATUS.COMPLETE],
  ])('should set the task status by view', (view, taskStatus) => {
    CommonUtil.setTaskStatusByView(view, taskStatus);
    const taskStatusKey = CommonUtil.taskStatusKeyByView(view);
    expect(localStorage.getItem(taskStatusKey)).not.toBeNull();
    expect(localStorage.getItem(taskStatusKey)).toEqual(taskStatus);
  });

  it.each([
    [VIEW.AIRPAX, LOCAL_STORAGE_KEYS.AIRPAX_TASK_STATUS],
    [VIEW.RORO, LOCAL_STORAGE_KEYS.RORO_TASK_STATUS],
  ])('should return the task status key by view', (view, key) => {
    expect(CommonUtil.taskStatusKeyByView(view)).toEqual(key);
  });

  it.each([
    ...INVALID_VIEWS,
  ])('should return undefined for the task status key when view is invalid', (view) => {
    expect(CommonUtil.taskStatusKeyByView(view)).toBeUndefined();
  });

  it.each([
    [VIEW.AIRPAX, `${TASK_LIST_PATHS.AIRPAX}/${BUSINESS_KEY}`],
    [VIEW.RORO, `${TASK_LIST_PATHS.RORO_V2}/${BUSINESS_KEY}`],
  ])('should return the view details URL for each view', (view, expected) => {
    expect(CommonUtil.viewDetailsURL(view, MOCK_TARGET_TASK)).toEqual(expected);
  });

  it.each([
    ...INVALID_VIEWS,
  ])('should return undefined for the view details URL for each invalid view', (view) => {
    expect(CommonUtil.viewDetailsURL(view, MOCK_TARGET_TASK)).toBeUndefined();
  });
});
