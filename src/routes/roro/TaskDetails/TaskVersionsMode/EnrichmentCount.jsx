import React from 'react';
import { VisuallyHidden } from '@ukhomeoffice/cop-react-components';
import { numberWithCommas } from '../../../../utils/Number/numberUtil';

const EnrichmentCount = ({ enrichmentCount }) => {
  return (
    <VisuallyHidden>
      <div className="govuk-grid-row enrichment-counts">
        <div className="labels">
          <div className="govuk-grid-column-one-third">
            <span className="font__light">Previous RoRo movements</span>
          </div>
          <div className="govuk-grid-column-one-third">
            <span className="font__light">Examinations</span>
          </div>
          <div className="govuk-grid-column-one-third">
            <span className="font__light">Seizures</span>
          </div>
        </div>
        <div className="values">
          <div className="govuk-grid-column-one-third">
            <span className="font__bold">{numberWithCommas(enrichmentCount?.split('/')[0]) || '-' }</span>
          </div>
          <div className="govuk-grid-column-one-third">
            <span className="font__bold">{numberWithCommas(enrichmentCount?.split('/')[1]) || '-' }</span>
          </div>
          <div className="govuk-grid-column-one-third">
            <span className="font__bold">{numberWithCommas(enrichmentCount?.split('/')[2]) || '-' }</span>
          </div>
        </div>
      </div>
    </VisuallyHidden>
  );
};

export default EnrichmentCount;
