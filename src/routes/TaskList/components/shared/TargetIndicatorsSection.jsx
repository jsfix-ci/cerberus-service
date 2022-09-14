import { Link } from 'react-router-dom';
import React from 'react';
import { RisksUtil } from '../../../../utils';

const TargetIndicatorsSection = ({ targetTask, redirectPath }) => {
  const targetingIndicators = RisksUtil.targetingIndicators(RisksUtil.getRisks(targetTask));
  return (
    <section className="task-list--target-indicator-section">
      <div className="govuk-grid-row">
        <div className="govuk-grid-item">
          <div className="govuk-grid-column">
            <ul className="govuk-list task-labels govuk-!-margin-top-2">
              <li className="task-labels-item">
                <strong className="govuk-!-font-weight-bold govuk-!-font-size-16">
                  Risk Score: {targetingIndicators.score}
                </strong>
              </li>
            </ul>
          </div>
          <div className="govuk-grid-column">
            <ul className="govuk-list task-labels govuk-!-margin-top-0">
              <li className="task-labels-item">
                {RisksUtil.format(targetingIndicators)}
              </li>
            </ul>
          </div>
        </div>
        <div className="govuk-grid-item task-link-container">
          <div>
            <Link
              className="govuk-link govuk-link--no-visited-state govuk-!-font-weight-bold"
              to={`${redirectPath}/${targetTask.id}`}
            >
              View details
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TargetIndicatorsSection;
