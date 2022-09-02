import React from 'react';
import { VisuallyHidden } from '@ukhomeoffice/cop-react-components';
import classNames from 'classnames';
import { EnrichmentUtil } from '../../utils';

const hasPreviousSeizures = (seizureCount) => {
  return seizureCount >= 1;
};

const EnrichmentCount = ({ labelText, movementStats, classnames }) => {
  return (
    <h3
      className={classNames('govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular', classnames)}
    >
      {labelText}
      <VisuallyHidden>
        <span className={`govuk-!-margin-left-3 ${hasPreviousSeizures(EnrichmentUtil.seizureCount(movementStats))
          ? 'font--red' : ''}`}
        >({EnrichmentUtil.format.taskList(movementStats)})
        </span>
      </VisuallyHidden>
    </h3>
  );
};

export default EnrichmentCount;
