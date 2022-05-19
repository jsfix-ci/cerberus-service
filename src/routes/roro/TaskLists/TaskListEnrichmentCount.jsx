import React from 'react';

const hasPreviousSeizures = (enrichmentCounts) => {
  const seizure = enrichmentCounts?.split('/')[2];
  return seizure >= 1;
};

const EnrichmentCount = ({ labelText, enrichmentCountText }) => {
  return (
    <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
      {labelText}
      {enrichmentCountText && <span className={`govuk-!-margin-left-3 ${hasPreviousSeizures(enrichmentCountText) ? 'font--red' : ''}`}>({enrichmentCountText})</span>}
    </h3>
  );
};

export default EnrichmentCount;
