import { showAssigneeComponent } from './componentUtil';
import { TASK_STATUS } from '../../constants';

describe('ComponentUtil', () => {
  it(`should false if task status is ${TASK_STATUS.NEW}`, () => {
    expect(showAssigneeComponent(TASK_STATUS.NEW)).toBeFalsy();
  });

  it(`should false if task status is ${TASK_STATUS.ISSUED}`, () => {
    expect(showAssigneeComponent(TASK_STATUS.ISSUED)).toBeFalsy();
  });

  it(`should false if task status is ${TASK_STATUS.COMPLETE}`, () => {
    expect(showAssigneeComponent(TASK_STATUS.COMPLETE)).toBeFalsy();
  });

  it(`should true if task status is ${TASK_STATUS.IN_PROGRESS}`, () => {
    expect(showAssigneeComponent(TASK_STATUS.IN_PROGRESS)).toBeTruthy();
  });
});
