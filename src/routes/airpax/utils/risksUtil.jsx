import React from 'react';
import * as pluralise from 'pluralise';
import { WARNING_CODES_MAPPING, NO_TEXT, YES_TEXT, CURRENTLY_UNAVAILABLE_TEXT } from '../../../constants';

const formatTargetIndicators = (targetingIndicators) => {
  if (targetingIndicators?.indicators?.length > 0) {
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
  return !!risks?.targetingIndicators;
};

const getTargetingIndicators = (risks) => {
  if (hasTargetingIndicators(risks)) {
    return risks.targetingIndicators;
  }
  return null;
};

const hasRisk = (targetTask) => {
  return !!targetTask?.risks;
};

const getRisk = (targetTask) => {
  if (hasRisk(targetTask)) {
    return targetTask.risks;
  }
  return null;
};

const getSelectorWarning = (selector) => {
  let warning;
  let warningDetails;
  const warningStatus = selector.warning.status;
  if (warningStatus?.toLowerCase() === NO_TEXT.toLowerCase()) warning = 'No warnings';
  if (warningStatus?.toLowerCase() === CURRENTLY_UNAVAILABLE_TEXT.toLowerCase()) warning = 'Warnings currently unavailable';
  if (warningStatus?.toLowerCase() === YES_TEXT.toLowerCase()) {
    const warningTypes = selector.warning.types;
    const containsOther = warningTypes.indexOf('O') > -1;
    if (warningTypes.length > 0) {
      if (containsOther) {
        warningDetails = selector.warning.detail;
      }
      warning = warningTypes.map((w) => (w === 'O' ? warningDetails?.substring(0, 500) : WARNING_CODES_MAPPING[w])).join(', ');
    }
  }
  return warning;
};

const hasIndicatorMatches = (selector) => {
  return !!selector?.indicatorMatches;
};

const getIndicatorMatches = (selector) => {
  if (hasIndicatorMatches(selector)) {
    return selector.indicatorMatches;
  }
  return null;
};

const hasSelectorGroups = (version) => {
  return !!version?.risks?.matchedSelectorGroups;
};

const getSelectorGroups = (version) => {
  if (hasSelectorGroups(version)) {
    return version.risks.matchedSelectorGroups;
  }
  return null;
};

const hasMatchedRules = (version) => {
  return !!version?.risks?.matchedRules;
};

const getMatchedRules = (version) => {
  if (hasMatchedRules(version)) {
    return version.risks.matchedRules;
  }
  return null;
};

const hasHighestThreatLevel = (risks) => {
  return !!risks?.highestThreatLevel;
};

const getHighestThreatLevel = (risks) => {
  if (hasHighestThreatLevel(risks)) {
    return risks.highestThreatLevel;
  }
  return null;
};

const hasRiskMatchedSelectorGroups = (risks) => {
  return !!risks?.matchedSelectorGroups;
};

const getRiskMatchedSelectorGroups = (risks) => {
  if (hasRiskMatchedSelectorGroups(risks)) {
    return risks.matchedSelectorGroups;
  }
  return null;
};

const hasRiskMatchedRules = (risks) => {
  return !!risks?.matchedRules;
};

const getRiskMatchedRules = (risks) => {
  if (hasRiskMatchedRules(risks)) {
    return risks.matchedRules;
  }
  return null;
};

const extractRiskType = (risks, highestRisk) => {
  const riskType = [];
  if (highestRisk.type.toLowerCase() === 'selector') {
    const selectors = [getRiskMatchedSelectorGroups(risks).groups];
    selectors.forEach((selector) => {
      Object.values(selector).every((s) => {
        if (s.category.toLowerCase() === (highestRisk.value.toLowerCase())) {
          riskType.push(s.threatType);
        }
      });
    });
  } else {
    const rules = [getRiskMatchedRules(risks)];
    rules.forEach((rule) => {
      Object.values(rule).every((r) => {
        if (r.priority.toLowerCase() === (highestRisk.value.toLowerCase())) {
          riskType.push(r.abuseTypes[0]);
        }
      });
    });
  }
  return riskType[0];
};

const formatTargetRisk = (risks, highestThreatLevel) => {
  const risksRules = getRiskMatchedRules(risks).length + getRiskMatchedSelectorGroups(risks).totalNumberOfSelectors;
  if (highestThreatLevel) {
    const topRisk = extractRiskType(risks, highestThreatLevel);
    const count = risksRules > 0 && risksRules - 1;
    return `${topRisk} and ${pluralise.withCount(
      count,
      '% other rule',
      '% other rules',
    )}`;
  }
  return null;
};

const formatHighestThreatLevel = (targetTask) => {
  const risks = getRisk(targetTask);
  const highestThreatLevel = getHighestThreatLevel(risks);
  if (!highestThreatLevel) {
    return;
  }
  return (
    <h4 className="govuk-heading-s task-highest-risk">
      {highestThreatLevel.type.toLowerCase() === 'rule' ? '' : highestThreatLevel.type}
      {' '}
      <span className="govuk-tag govuk-tag--riskTier">
        {highestThreatLevel.value}
      </span>
      <span className="govuk-body task-risk-statement">
        {formatTargetRisk(risks, highestThreatLevel)}
      </span>
    </h4>
  );
};

const RisksUtil = {
  getRisks: getRisk,
  format: formatTargetIndicators,
  getIndicators: getTargetingIndicators,
  getWarning: getSelectorWarning,
  getMatches: getIndicatorMatches,
  getGroups: getSelectorGroups,
  getRules: getMatchedRules,
  getHighestThreat: getHighestThreatLevel,
  getMatchedSelectorGroups: getRiskMatchedSelectorGroups,
  getMatchedRules: getRiskMatchedRules,
  formatHighestThreat: formatHighestThreatLevel,
};

export default RisksUtil;

export {
  getRisk,
  formatTargetIndicators,
  getTargetingIndicators,
  getSelectorWarning,
  getIndicatorMatches,
  getSelectorGroups,
  getMatchedRules,
  getHighestThreatLevel,
  getRiskMatchedSelectorGroups,
  getRiskMatchedRules,
  formatHighestThreatLevel,
};
