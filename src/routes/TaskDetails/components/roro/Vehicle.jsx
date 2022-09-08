import React from 'react';
import classNames from 'classnames';

import { VehicleUtil } from '../../../../utils';
import renderBlock from '../../helper/common';

const Vehicle = ({ version, classModifiers }) => {
  const vehicle = VehicleUtil.get(version);
  return (
    <div className={classNames('task-details-container', 'govuk-!-margin-bottom-2', classModifiers)}>
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
