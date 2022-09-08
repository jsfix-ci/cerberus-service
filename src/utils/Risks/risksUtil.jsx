import React from 'react';
import * as pluralise from 'pluralise';
import { STRINGS } from '../constants';
import { capitalizeFirstLetter } from '../String/stringUtil';

const getIndicatorsTotalScore = (entity) => {
  if (!entity) {
    return 0;
  }
  return entity?.score || 0;
};

const getIndicatorsTotalCount = (entity) => {
  if (!entity) {
    return 0;
  }
  return entity?.count || 0;
};

const getIndicatorDescription = (targetingIndicator) => {
  if (!targetingIndicator) {
    return 0;
  }
  return targetingIndicator?.description || 0;
};

const calculateTaskVersionTotalRiskScore = (fieldChildsets) => {
  let totalRiskScore = 0;
  fieldChildsets.map((childSet) => {
    let targetingIndicator = childSet.contents.filter(({ propName }) => propName === 'score');
    if (targetingIndicator.length > 0) {
      totalRiskScore += targetingIndicator[0]?.content || 0;
    }
  });
  return totalRiskScore;
};

const calculateTaskListTotalRiskScore = (target) => {
  let totalRiskScore = 0;
  if (target.threatIndicators?.length > 0) {
    target.threatIndicators.map((threatIndicatorScore) => {
      totalRiskScore += threatIndicatorScore?.score || 0;
    });
  }
  return (
    totalRiskScore > 0 ? <span className="govuk-!-font-weight-bold">Risk Score: {totalRiskScore}</span> : <span>Risk Score: 0</span>
  );
};

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

const getIndicators = (targetingIndicators) => {
  return targetingIndicators?.indicators || [];
};

const getTargetingIndicators = (risks) => {
  return risks?.targetingIndicators || null;
};

const getRisk = (targetTask) => {
  return targetTask?.risks || null;
};

const getSelectorWarning = (selector) => {
  let warning;
  let warningDetails;
  const warningStatus = selector.warning.status;
  if (warningStatus?.toLowerCase() === STRINGS.NO_TEXT.toLowerCase()) warning = 'No warnings';
  if (warningStatus?.toLowerCase() === STRINGS.CURRENTLY_UNAVAILABLE_TEXT.toLowerCase()) {
    warning = 'Warnings currently unavailable';
  }
  if (warningStatus?.toLowerCase() === STRINGS.YES_TEXT.toLowerCase()) {
    const warningTypes = selector.warning.types;
    if (warningTypes.length > 0) {
      warning = warningTypes.map((w) => (w === 'O' ? warningDetails?.substring(0, 500) : capitalizeFirstLetter(w.toLowerCase().replace(/_/g, ' ')))).join(', ');
    }
  }
  return warning;
};

const getIndicatorMatches = (selector) => {
  return selector?.indicatorMatches || null;
};

const getSelectorGroups = (version) => {
  return version?.risks?.matchedSelectorGroups || null;
};

const getMatchedRules = (version) => {
  return version?.risks?.matchedRules || null;
};

const getHighestThreatLevel = (risks) => {
  return risks?.highestThreatLevel || null;
};

const getRiskMatchedSelectorGroups = (risks) => {
  return risks?.matchedSelectorGroups || null;
};

const getRiskMatchedRules = (risks) => {
  return risks?.matchedRules || null;
};

const extractRiskType = (risks, highestRisk) => {
  const riskType = [];
  if (highestRisk.type.toLowerCase() === 'selector') {
    const selectors = getRiskMatchedSelectorGroups(risks).groups;
    selectors.forEach(({ category, threatType }) => {
      if (category.toLowerCase() === (highestRisk.value.toLowerCase())) {
        riskType.push(threatType);
      }
    });
  } else {
    const rules = getRiskMatchedRules(risks);
    rules.forEach(({ priority, abuseTypes }) => {
      if (priority.toLowerCase() === (highestRisk.value.toLowerCase())) {
        riskType.push(abuseTypes[0]);
      }
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
    <h4 className="govuk-heading-s task-highest-risk govuk-!-margin-bottom-0">
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
  extractHighestRisk: extractRiskType,
  formatHighestThreat: formatHighestThreatLevel,
  format: formatTargetIndicators,
  getIndicators: getTargetingIndicators,
  getWarning: getSelectorWarning,
  getMatches: getIndicatorMatches,
  getGroups: getSelectorGroups,
  getRules: getMatchedRules,
  getHighestThreat: getHighestThreatLevel,
  getMatchedSelectorGroups: getRiskMatchedSelectorGroups,
  getMatchedRules: getRiskMatchedRules,
  indicators: getIndicators, // TODO
  indicatorScore: getIndicatorsTotalScore, // TODO
  indicatorCount: getIndicatorsTotalCount, // TODO
  indicatorDescription: getIndicatorDescription, // TODO
  roro: {
    taskListTotalRiskScore: calculateTaskListTotalRiskScore,
    taskDetailsTotalRiskScore: calculateTaskVersionTotalRiskScore,
  },
};

export default RisksUtil;

export {
  calculateTaskListTotalRiskScore,
  calculateTaskVersionTotalRiskScore,
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
  extractRiskType,
  formatHighestThreatLevel,
};
