import React from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';
import { RORO_ACCOMPANIED_FREIGHT, RORO_UNACCOMPANIED_FREIGHT, LONG_DATE_FORMAT } from '../../constants';

import '../__assets__/TaskDetailsPage.scss';

const getMovementModeIcon = (movementMode, roroData) => {
  const vehicle = roroData?.vehicle;
  const trailer = roroData.vehicle?.trailer?.regNumber;

  if (movementMode.toUpperCase() === RORO_ACCOMPANIED_FREIGHT.toUpperCase()
  || movementMode.toUpperCase() === RORO_UNACCOMPANIED_FREIGHT.toUpperCase()) {
    if (vehicle === undefined && trailer !== undefined) {
      // 'This is a TRAILER icon';
      return (
        <div className="movement-mode-icon">
          <i className="c-icon-ship" />
        </div>
      );
    } if (vehicle !== undefined && trailer === undefined) {
      // return 'This is a VAN icon';
      return (
        <div className="movement-mode-icon">
          <i className="c-icon-ship" />
        </div>
      );
    } if (vehicle !== undefined && trailer !== undefined) {
      // return 'This is a LORRY with TRAILER icon';
      return (
        <div className="movement-mode-icon">
          <i className="c-icon-ship" />
        </div>
      );
    }
  }
  // 'Default to RORO Tourist icon';
  return (
    <div className="movement-mode-icon">
      <i className="c-icon-car" />
    </div>
  );
};

const TaskSummary = ({ movementMode, taskSummaryData }) => {
  dayjs.extend(utc);
  dayjs.extend(relativeTime);
  const roroData = taskSummaryData.roro.details;

  return (
    <section className="card">
      <div className="govuk-task-summary-grid">
        {getMovementModeIcon(movementMode, roroData)}
        <div className="grid-item-col-1">
          <ul className="summary-data-list">
            <li>
              <span className="govuk-caption-m">
                {roroData.vehicle && 'Vehicle'}
                {(roroData.vehicle && roroData.vehicle?.trailer?.regNumber) && ' with '}
                {roroData?.vehicle?.trailer?.regNumber && 'Trailer'}
              </span>
              <h3 className="govuk-heading-s">
                {roroData.vehicle && roroData.vehicle.registrationNumber}
                {(roroData.vehicle?.registrationNumber && roroData.vehicle?.trailer?.regNumber) && <span className="govuk-!-font-weight-regular"> with </span>}
                {roroData.vehicle?.trailer?.regNumber && roroData.vehicle.trailer.regNumber}
                {roroData.driver?.name && <span className="govuk-!-font-weight-regular"> driven by </span>}
                {roroData.driver?.name && roroData.driver.name}
              </h3>
            </li>
          </ul>
        </div>
        <div className="grid-item-col-2">
          <ul className="summary-data-list">
            <li><span>{roroData.vessel?.company && `${roroData.vessel?.company} voyage of `}{roroData.vessel.name}</span></li>
            <li>
              <span>{!roroData.departureTime ? 'unknown' : dayjs.utc(roroData.departureTime).format(LONG_DATE_FORMAT)}{' '}
                <span className="dot" />  <span className="font__bold">{roroData.departureLocation && `${roroData.departureLocation} `}</span>{' - '}
              </span> <span className="font__bold">{roroData.arrivalLocation && `${roroData.arrivalLocation} `} </span>{'  '}
              <span className="dot" />  {!roroData.eta ? 'unknown' : dayjs.utc(roroData.eta).format(LONG_DATE_FORMAT)}
            </li>
            <li><span>Arrival {!roroData.eta ? 'unknown' : (dayjs.utc(roroData.eta).fromNow())}</span></li>
          </ul>
        </div>
        <div className="freight-icon">
          <i className="c-icon-ship" />
        </div>
      </div>

    </section>
  );
};

export default TaskSummary;
