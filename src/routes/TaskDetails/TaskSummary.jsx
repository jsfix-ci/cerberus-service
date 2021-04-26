import React, { useEffect, useState } from 'react';

import formatTaskData from '../../utils/formatTaskData';

import '../__assets__/TaskDetailsPage.scss';

const TaskSummary = ({ taskSummaryData }) => {
  const [formattedData, setFormattedData] = useState();

  useEffect(() => {
    setFormattedData(formatTaskData(taskSummaryData));
  }, []);

  if (!formattedData) { return null; }

  return (
    <section className="card">
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <span className="govuk-caption-m">{`${formattedData.vehicleTitle} ${formattedData.trailerTitle}`}</span>
          <h3 className="govuk-heading-m govuk-!-margin-bottom-3">
            <span>{formattedData.vehicleRegistration}</span>
            {taskSummaryData?.trailers.length > 0
              && (
              <>
                <span className="govuk-!-font-weight-regular">with &nbsp;</span>
                <span>{formattedData.trailerRegistration} &nbsp;</span>
              </>
              )}
            {formattedData.driver
            && (
            <>
              <span className="govuk-!-font-weight-regular">&nbsp;driven by&nbsp;</span>
              <span id="driver-name">{formattedData.driver}</span>
            </>
            )}
          </h3>
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-half">
          <dl className="mode-details">
            <dt>{formattedData.ferry.label}</dt>
            <dd>{formattedData.ferry.value}</dd>
            <dt>{formattedData.departure.label}</dt>
            <dd>{formattedData.departure.value}</dd>
            <dt>{formattedData.arrival.label}</dt>
            <dd>{formattedData.arrival.value}</dd>
          </dl>
        </div>
        <div className="govuk-grid-column-one-half">
          <dl className="mode-details">
            <dt>{formattedData.account.label}</dt>
            <dd>{formattedData.account.value}</dd>
            <dt>{formattedData.haulier.label}</dt>
            <dd>{formattedData.haulier.value}</dd>
          </dl>
        </div>
      </div>
    </section>
  );
};

export default TaskSummary;
