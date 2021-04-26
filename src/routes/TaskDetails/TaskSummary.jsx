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
          <span className="govuk-caption-m">{`${formattedData.vehicle.label} ${formattedData.trailer.label}`}</span>
          <h3 className="govuk-heading-m govuk-!-margin-bottom-3">
            <span>{formattedData.vehicle.registration}</span>
            {taskSummaryData?.trailers.length > 0
              && (
              <>
                <span className="govuk-!-font-weight-regular">with &nbsp;</span>
                <span>{formattedData.trailerRegistration} &nbsp;</span>
              </>
              )}
            {formattedData.driver.dataExists
            && (
            <>
              <span className="govuk-!-font-weight-regular">&nbsp;driven by&nbsp;</span>
              <span id="driver-name">{formattedData.driver.name}</span>
            </>
            )}
          </h3>
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-half">
          <dl className="mode-details">
            <dt>{formattedData.ferry.label}</dt>
            <dd>{formattedData.ferry.description}</dd>
            <dt>{formattedData.departure.label}</dt>
            <dd>{formattedData.departure.description}</dd>
            <dt>{formattedData.arrival.label}</dt>
            <dd>{formattedData.arrival.description}</dd>
          </dl>
        </div>
        <div className="govuk-grid-column-one-half">
          <dl className="mode-details">
            <dt>{formattedData.account.label}</dt>
            <dd>{formattedData.account.name}</dd>
            <dt>{formattedData.haulier.label}</dt>
            <dd>{formattedData.haulier.name}</dd>
          </dl>
        </div>
      </div>
    </section>
  );
};

export default TaskSummary;
