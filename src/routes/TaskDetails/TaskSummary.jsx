import React from 'react';
import dayjs from 'dayjs';
import { LONG_DATE_FORMAT } from '../../constants';

import '../__assets__/TaskDetailsPage.scss';

const TaskSummary = ({ taskSummaryData }) => {
  const roroData = taskSummaryData.roro.details;

  return (
    <section className="card">
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <span className="govuk-caption-m">
            {roroData.vehicle && 'Vehicle'}
            {(roroData.vehicle && roroData.vehicle?.trailer?.regNumber) && ' with '}
            {roroData?.vehicle?.trailer?.regNumber && 'Trailer'}
          </span>
          <h3 className="govuk-heading-m govuk-!-margin-bottom-3">
            {roroData.vehicle && roroData.vehicle.registrationNumber}
            {(roroData.vehicle?.registrationNumber && roroData.vehicle?.trailer?.regNumber) && <span className="govuk-!-font-weight-regular"> with </span>}
            {roroData.vehicle?.trailer?.regNumber && roroData.vehicle.trailer.regNumber}
          </h3>
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-half">
          <dl className="mode-details">
            <dt>Ferry</dt>
            <dd>{roroData.vessel?.company && `${roroData.vessel?.company} voyage of `}{roroData.vessel.name}</dd>
            <dt>Departure</dt>
            <dd>{roroData.departureLocation && `${roroData.departureLocation}, `}{!roroData.departureTime ? 'unknown' : dayjs(roroData.departureTime).format(LONG_DATE_FORMAT)}</dd>
            <dt>Arrival</dt>
            <dd>{roroData.arrivalLocation && `${roroData.arrivalLocation}, `}{!roroData.eta ? 'unknown' : dayjs(roroData.eta).format(LONG_DATE_FORMAT)}</dd>
          </dl>
        </div>
        <div className="govuk-grid-column-one-half">
          <dl className="mode-details">
            <dt>Account</dt>
            <dd>{!roroData.account?.name ? 'unknown' : roroData.account.name}</dd>
            <dt>Haulier</dt>
            <dd>{!roroData.haulier?.name ? 'unknown' : roroData.haulier.name}, <span className="govuk-!-font-weight-regular">booked on {!roroData.bookingDate ? 'unknown' : roroData.bookingDate}</span></dd>
          </dl>
        </div>
      </div>
    </section>
  );
};

export default TaskSummary;
