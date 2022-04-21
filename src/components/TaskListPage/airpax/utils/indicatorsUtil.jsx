import React from 'react';
import * as pluralise from 'pluralise';

const formatTargetIndicators = (targetingIndicators) => {
  if (targetingIndicators.indicators?.length > 0) {
    const threatIndicatorList = targetingIndicators.indicators.map((threatIndicator) => {
      return threatIndicator.description;
    });
    return (
      <ul className="govuk-list item-list--bulleted">
        <li className="govuk-!-font-weight-bold govuk-!-font-size-16">{`${pluralise.withCount(threatIndicatorList.length, '% indicator', '% indicators')}`}</li>
        {threatIndicatorList.map((threat) => {
          return <li key={threat} className="threat-indicator-bullet govuk-!-font-size-16">{threat}</li>;
        })}
      </ul>
    );
  }
};

const hasTargetingIndicators = (risks) => {
  return !!risks.targetingIndicators;
};

const getTargetingIndicators = (risks) => {
  return hasTargetingIndicators(risks) && risks.targetingIndicators;
};

const getRisk = (targetTask) => {
  return targetTask.risks;
};

const hasRisk = (targetTask) => {
  return !!targetTask?.risks;
};

const IndicatorsUtil = {
  get: getRisk,
  has: hasRisk,
  format: formatTargetIndicators,
  hasIndicatiors: hasTargetingIndicators,
  getIndicators: getTargetingIndicators,
};

export default IndicatorsUtil;

export { formatTargetIndicators, getRisk, hasRisk, getTargetingIndicators };
