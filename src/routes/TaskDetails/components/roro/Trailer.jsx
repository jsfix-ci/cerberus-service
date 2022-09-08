import React from 'react';

import { UNITS } from '../../../../utils/constants';

import { FieldFormatterUtil, TrailerUtil } from '../../../../utils';
import renderBlock from '../../helper/common';

const Trailer = ({ version }) => {
  const trailer = TrailerUtil.get(version);
  return (
    <div className="task-details-container bottom-border-thin govuk-!-margin-bottom-2">
      <h3 className="govuk-heading-m govuk-!-margin-top-0">Trailer</h3>
      <div className="govuk-task-details-grid-column">
        {renderBlock('Trailer registration number', [TrailerUtil.registration(trailer)])}
        {renderBlock('Trailer type', [TrailerUtil.type(trailer)])}
        {renderBlock('Trailer country of registration', [TrailerUtil.nationality(trailer)])}
        {renderBlock('Empty or loaded', [TrailerUtil.loadStatus(trailer)])}
        {renderBlock('Trailer length', [FieldFormatterUtil.format.field(UNITS.DISTANCE.value, TrailerUtil.length(trailer))])}
        {renderBlock('Trailer height', [FieldFormatterUtil.format.field(UNITS.DISTANCE.value, TrailerUtil.height(trailer))])}
      </div>
    </div>
  );
};

export default Trailer;
