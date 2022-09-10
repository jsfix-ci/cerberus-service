import React from 'react';
import classNames from 'classnames';

import { UNITS } from '../../../../utils/constants';

import { CommonUtil, FieldFormatterUtil, TrailerUtil } from '../../../../utils';
import renderBlock from '../../helper/common';

const Trailer = ({ version, classModifiers }) => {
  const trailer = TrailerUtil.get(version);
  return (
    <div className={classNames('task-details-container', 'govuk-!-margin-bottom-2', classModifiers)}>
      <h3 className="govuk-heading-m govuk-!-margin-top-0">Trailer</h3>
      <div className="govuk-task-details-grid-column">
        {renderBlock('Trailer registration number', [TrailerUtil.registration(trailer)])}
        {renderBlock('Trailer type', [TrailerUtil.type(trailer)])}
        {renderBlock('Trailer country of registration', [CommonUtil.iso3Code(TrailerUtil.nationality(trailer))])}
        {renderBlock('Empty or loaded', [TrailerUtil.loadStatus(trailer)])}
        {renderBlock('Trailer length', [FieldFormatterUtil.format.field(UNITS.DISTANCE.name, TrailerUtil.length(trailer))])}
        {renderBlock('Trailer height', [FieldFormatterUtil.format.field(UNITS.DISTANCE.name, TrailerUtil.height(trailer))])}
      </div>
    </div>
  );
};

export default Trailer;
