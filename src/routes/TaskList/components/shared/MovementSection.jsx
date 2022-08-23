import React from 'react';

import { MovementUtil } from '../../../../utils';

import getMovementComponent from '../../helper/movementSection';

const MovementSection = ({ targetTask }) => {
  const mode = MovementUtil.movementMode(targetTask);
  return (
    <section className="task-list--movement-info-section">
      <div className="govuk-grid-row">
        {getMovementComponent(mode, targetTask)}
      </div>
    </section>
  );
};

export default MovementSection;
