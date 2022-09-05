import meetsAllConditions from './meetsAllConditions';
import meetsCondition from './meetsCondition';
import meetsOneCondition from './meetsOneCondition';

const Condition = {
  met: meetsCondition,
  meetsAll: meetsAllConditions,
  meetsOne: meetsOneCondition,
};

export default Condition;
