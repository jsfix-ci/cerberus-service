import React from 'react';

import { VehicleUtil } from '../../../../utils';
import renderBlock from '../../helper/common';

const Vehicle = ({ version }) => {
  const vehicle = VehicleUtil.get(version);
  return (
    <div className="task-details-container bottom-border-thin govuk-!-margin-bottom-2">
      <h3 className="govuk-heading-m govuk-!-margin-top-0">Vehicle</h3>
      <div className="govuk-task-details-grid-column">
        {renderBlock('Vehicle registration', [VehicleUtil.registration(vehicle)])}
        {renderBlock('Type', [VehicleUtil.type(vehicle)])}
        {renderBlock('Make', [VehicleUtil.make(vehicle)])}
        {renderBlock('Model', [VehicleUtil.model(vehicle)])}
        {renderBlock('Country of registration', [VehicleUtil.nationality(vehicle)])}
        {renderBlock('Colour', [VehicleUtil.colour(vehicle)])}
      </div>
    </div>
  );
};

export default Vehicle;
