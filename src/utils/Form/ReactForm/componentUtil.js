import { TASK_STATUS } from '../../constants';

const showAssigneeComponent = (taskStatus) => {
  return ![TASK_STATUS.NEW, TASK_STATUS.ISSUED, TASK_STATUS.COMPLETE].includes(taskStatus);
};

const ComponentUtil = {
  showAssignee: showAssigneeComponent,
};

export default ComponentUtil;

export {
  showAssigneeComponent,
};
