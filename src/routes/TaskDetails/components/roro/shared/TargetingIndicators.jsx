import React from 'react';
import classNames from 'classnames';

import { RisksUtil } from '../../../../../utils';

const toTargetingIndicatorsBlock = (indicators) => {
  return indicators.map((indicator, index) => {
    const classModifiers = index !== indicators.length - 1
      ? 'govuk-task-details-grid-row bottom-border'
      : 'govuk-task-details-grid-row';
    return (
      <div key={index} className={classNames(classModifiers)}>
        <ul className="govuk-!-margin-bottom-0 govuk-!-padding-left-3">
          <li className="govuk-grid-key list-bullet font__light">
            {RisksUtil.indicatorDescription(indicator)}
          </li>
        </ul>
        <span className="govuk-grid-value font__bold">
          {RisksUtil.indicatorScore(indicator)}
        </span>
      </div>
    );
  });
};

const TargetingIndicators = ({ version, classModifiers }) => {
  const targetingIndicators = RisksUtil.targetingIndicators(RisksUtil.getRisks(version));
  const indicators = RisksUtil.indicators(targetingIndicators);
  return (
    <>
      <h3 className="govuk-heading-m govuk-!-margin-top-0">Targeting indicators</h3>
      <div className={classNames('govuk-task-details-indicator-container govuk-!-margin-bottom-2', classModifiers)}>
        <div className="govuk-task-details-grid-row bottom-border">
          <span className="govuk-grid-key font__light">Indicators</span>
          <span className="govuk-grid-value font__light">Total score</span>
        </div>
        <div className="govuk-task-details-grid-row govuk-!-padding-bottom-1">
          <span className="govuk-grid-key font__bold">{RisksUtil.indicatorCount(targetingIndicators)}</span>
          <span className="govuk-grid-key font__bold">{RisksUtil.indicatorScore(targetingIndicators)}</span>
        </div>
        {indicators && indicators?.length ? (
          <>
            <div className="govuk-task-details-grid-row bottom-border">
              <span className="govuk-grid-key font__bold">Indicator</span>
              <span className="govuk-grid-value font__bold">Score</span>
            </div>
            <div className="task-details-container">
              {toTargetingIndicatorsBlock(indicators)}
            </div>
          </>
        ) : null}
      </div>
    </>
  );
};

export default TargetingIndicators;
