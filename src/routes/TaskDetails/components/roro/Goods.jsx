import React from 'react';

import { UNITS } from '../../../../utils/constants';

// Utils
import { FieldFormatterUtil, GoodsUtil } from '../../../../utils';
import renderBlock from '../../helper/common';

const Goods = ({ version }) => {
  const goods = GoodsUtil.get(version);
  return (
    <div className="task-details-container">
      <h3 className="govuk-heading-m govuk-!-margin-top-0">Goods</h3>
      <div className="govuk-task-details-grid-column">
        {renderBlock('Description', [GoodsUtil.description(goods)])}
        {renderBlock('Is cargo hazardous?', [GoodsUtil.hazardous(goods)])}
        {renderBlock('Weight of goods', [FieldFormatterUtil.format.field(UNITS.WEIGHT.value, GoodsUtil.weight(goods))])}
      </div>
    </div>
  );
};

export default Goods;
