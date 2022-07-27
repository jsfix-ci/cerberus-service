import React from 'react';
import { VisuallyHidden } from '@ukhomeoffice/cop-react-components';

const hasPreviousSeizures = (enrichmentCounts) => {
  const seizure = enrichmentCounts?.split('/')[2];
  return seizure >= 1;
};

const EnrichmentCount = ({ labelText, enrichmentCountText }) => {
  return (
    <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
      {labelText}
      <VisuallyHidden>
        {enrichmentCountText && (
        <span className={`govuk-!-margin-left-3 ${hasPreviousSeizures(enrichmentCountText)
          ? 'font--red' : ''}`}
        >({enrichmentCountText})
        </span>
        )}
      </VisuallyHidden>
    </h3>
  );
};

export default EnrichmentCount;
