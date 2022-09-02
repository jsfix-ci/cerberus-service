import _ from 'lodash';
import { EnrichmentUtil } from '../index';

const DEFAULT_STATS = {
  seizureCount: 0,
  movementCount: 0,
  examinationCount: 0,
};

describe('EnrichmentUtil', () => {
  let MOVEMENT_STATS = {};

  beforeEach(() => {
    MOVEMENT_STATS = _.cloneDeep(DEFAULT_STATS);
  });

  it('should return dash when examination count is 0', () => {
    expect(EnrichmentUtil.examinationCount(MOVEMENT_STATS)).toEqual('-');
  });

  it('should return a positive number when examination count is greater than 0', () => {
    MOVEMENT_STATS.examinationCount = 2;
    expect(EnrichmentUtil.examinationCount(MOVEMENT_STATS)).toEqual(2);
  });

  it.each([
    [null],
    [undefined],
    [''],
  ])('should return a dash when examination count is invalid', (given) => {
    MOVEMENT_STATS.examinationCount = given;
    expect(EnrichmentUtil.examinationCount(MOVEMENT_STATS)).toEqual('-');
  });

  it('should return dash when movement count is 0', () => {
    expect(EnrichmentUtil.movementCount(MOVEMENT_STATS)).toEqual('-');
  });

  it('should return a positive number when movement count is greater than 0', () => {
    MOVEMENT_STATS.movementCount = 2;
    expect(EnrichmentUtil.movementCount(MOVEMENT_STATS)).toEqual(2);
  });

  it.each([
    [null],
    [undefined],
    [''],
  ])('should return a dash when examination count is invalid', (given) => {
    MOVEMENT_STATS.movementCount = given;
    expect(EnrichmentUtil.movementCount(MOVEMENT_STATS)).toEqual('-');
  });

  it('should return dash when seizure count is 0', () => {
    expect(EnrichmentUtil.seizureCount(MOVEMENT_STATS)).toEqual('-');
  });

  it('should return a positive number when seizure count is greater than 0', () => {
    MOVEMENT_STATS.seizureCount = 2;
    expect(EnrichmentUtil.seizureCount(MOVEMENT_STATS)).toEqual(2);
  });

  it.each([
    [null],
    [undefined],
    [''],
  ])('should return a dash when seizure count is invalid', (given) => {
    MOVEMENT_STATS.seizureCount = given;
    expect(EnrichmentUtil.seizureCount(MOVEMENT_STATS)).toEqual('-');
  });

  it('should return a formatted enrichment count string', () => {
    expect(EnrichmentUtil.format.taskList(MOVEMENT_STATS)).toEqual('-/-/-');
  });

  it.each([
    [{
      ...MOVEMENT_STATS,
      movementCount: 2,
    }, '2/-/-'],
    [{
      ...MOVEMENT_STATS,
      movementCount: 4,
      examinationCount: 2,
      seizureCount: 0,
    }, '4/2/-'],
    [{
      ...MOVEMENT_STATS,
      seizureCount: 2,
      examinationCount: 5,
    }, '-/5/2'],
    [{
      ...MOVEMENT_STATS,
      seizureCount: -5,
      examinationCount: 5,
    }, '-/5/-'],
  ])('should return a varied movement stats payload', (given, expected) => {
    expect(EnrichmentUtil.format.taskList(given)).toEqual(expected);
  });
});
