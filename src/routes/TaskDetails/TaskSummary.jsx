import React from 'react';
import moment from 'moment';

import { LONG_DATE_FORMAT } from '../../constants';

import '../__assets__/TaskDetailsPage.scss';

const TaskSummary = ({ taskSummaryData }) => {
  const accountValue = taskSummaryData?.organisations.find(({ type }) => type === 'ORGACCOUNT')?.name;
  const driver = taskSummaryData?.people?.find(({ role }) => role === 'DRIVER')?.name || '';
  const haulierValue = taskSummaryData?.organisations.find(({ type }) => type === 'ORGHAULIER')?.name;
  const trailerRegistration = taskSummaryData?.trailers[0]?.registrationNumber;
  const trailerTitle = taskSummaryData?.trailers.length > 0 ? 'with trailer' : '';
  const vehicleRegistration = taskSummaryData?.vehicles[0].registrationNumber;
  const vehicleTitle = taskSummaryData?.vehicles.length > 0 ? 'Vehicle' : '';

  // List section consts
  const ferry = {
    label: 'Ferry',
    value: `${taskSummaryData?.voyage?.description}`,
  };
  const departure = {
    label: 'Departure',
    value: `${taskSummaryData?.voyage?.departFrom}${taskSummaryData?.departureTime ? `, ${moment(taskSummaryData?.departureTime).format(LONG_DATE_FORMAT)}` : ''}`,
  };
  const arrival = {
    label: 'Arrival due',
    value: `${taskSummaryData?.voyage?.arriveAt}${taskSummaryData?.arrivalTime ? `, ${moment(taskSummaryData?.arrivalTime).format(LONG_DATE_FORMAT)}` : ''}`,
  };
  const account = {
    label: 'Account',
    value: accountValue || '',
  };
  const haulier = {
    label: 'Haulier',
    value: haulierValue || '',
  };

  return (
    <section className="card">
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <span className="govuk-caption-m">{`${vehicleTitle} ${trailerTitle}`}</span>
          <h3 className="govuk-heading-m govuk-!-margin-bottom-3">
            <span>{vehicleRegistration}</span>
            {taskSummaryData?.trailers.length > 0
              && (
              <>
                <span className="govuk-!-font-weight-regular">with &nbsp;</span>
                <span>{trailerRegistration} &nbsp;</span>
              </>
              )}
            {driver
            && (
            <>
              <span className="govuk-!-font-weight-regular">&nbsp;driven by&nbsp;</span>
              <span id="driver-name">{driver}</span>
            </>
            )}
          </h3>
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-half">
          <dl className="mode-details">
            <dt>{ferry.label}</dt>
            <dd>{ferry.value}</dd>
            <dt>{departure.label}</dt>
            <dd>{departure.value}</dd>
            <dt>{arrival.label}</dt>
            <dd>{arrival.value}</dd>
          </dl>
        </div>
        <div className="govuk-grid-column-one-half">
          <dl className="mode-details">
            <dt>{account.label}</dt>
            <dd>{account.value}</dd>
            <dt>{haulier.label}</dt>
            <dd>{haulier.value}</dd>
          </dl>
        </div>
      </div>
    </section>
  );
};

export default TaskSummary;
