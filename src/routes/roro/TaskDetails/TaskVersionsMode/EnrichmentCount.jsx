import React from 'react';
import numberWithCommas from '../../../../utils/numberWithCommas';

const EnrichmentCount = ({ enrichmentCount }) => {
  return (
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
  );
};

export default EnrichmentCount;
