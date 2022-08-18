import React from 'react';
import getVoyageComponent from './helper/voyageSection';

import { MovementUtil } from '../../utils';

const VoyageSection = ({ targetTask, refDataAirlineCodes }) => {
  const mode = MovementUtil.movementMode(targetTask);
  return (
    <section className="task-list--voyage-section">
      <div>
        <div className="govuk-grid-row grid-background--greyed">
          {getVoyageComponent(mode, targetTask, refDataAirlineCodes)}
        </div>
      </div>
    </section>
  );
};

export default VoyageSection;
