import { useContext } from 'react';

import { ApplicationContext } from '../../../../context/ApplicationContext';

import getVoyageComponent from '../../helper/voyageSection';
import { MovementUtil } from '../../../../utils';

const TaskSummary = ({ version }) => {
  const mode = MovementUtil.movementMode(version);
  const { refDataAirlineCodes } = useContext(ApplicationContext);
  return getVoyageComponent(mode, version, refDataAirlineCodes());
};

export default TaskSummary;
