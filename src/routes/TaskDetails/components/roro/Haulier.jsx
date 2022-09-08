import React from 'react';

// Utils
import { HaulierUtil, StringUtil } from '../../../../utils';

import renderBlock from '../../helper/common';

const Haulier = ({ version }) => {
  const haulier = HaulierUtil.get(version);
  return (
    <div className="task-details-container bottom-border-thin govuk-!-margin-bottom-2">
      <h3 className="govuk-heading-m govuk-!-margin-top-0">Haulier details</h3>
      <div className="govuk-task-details-grid-column">
        {renderBlock('Name', [HaulierUtil.name(haulier)])}
        {renderBlock('Address', [StringUtil.format.address(HaulierUtil.address(haulier))])}
        {renderBlock('Telephone', [HaulierUtil.telephone(haulier)])}
        {renderBlock('Mobile', [HaulierUtil.mobile(haulier)])}
      </div>
    </div>
  );
};

export default Haulier;
