import { resetToZero } from '../Number/numberUtil';
import { getMovementStats } from '../Common/commonUtil';

const examinationCount = (movementStats) => {
  return resetToZero(movementStats?.examinationCount) || '-';
};

const movementCount = (movementStats) => {
  return resetToZero(movementStats?.movementCount) || '-';
};

const seizureCount = (movementStats) => {
  return resetToZero(movementStats?.seizureCount) || '-';
};

const hasPersonsWithPreviousSeizures = (otherPersons) => {
  if (!otherPersons && otherPersons?.length) {
    return otherPersons.find((person) => {
      const _seizureCount = seizureCount(getMovementStats(person));
      return _seizureCount >= 1;
    });
  }
};

const formatToTaskList = (movementStats) => {
  return `${movementCount(movementStats)}/${examinationCount(movementStats)}/${seizureCount(movementStats)}`;
};

const EnrichmentUtil = {
  examinationCount,
  movementCount,
  seizureCount,
  personsWithPreviousSeizures: hasPersonsWithPreviousSeizures,
  format: {
    taskList: formatToTaskList,
  },
};

export default EnrichmentUtil;

export { examinationCount, hasPersonsWithPreviousSeizures, movementCount, seizureCount, formatToTaskList };
