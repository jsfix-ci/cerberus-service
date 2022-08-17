import React from 'react';

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

export { calculateTaskVersionTotalRiskScore, calculateTaskListTotalRiskScore };
