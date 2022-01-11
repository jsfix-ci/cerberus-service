import React from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';
import { LONG_DATE_FORMAT } from '../../constants';
import getMovementModeIcon from '../../utils/getVehicleModeIcon';
import modify from '../../utils/roroDataUtil';

import '../__assets__/TaskDetailsPage.scss';

const TaskSummary = ({ movementMode, taskSummaryData }) => {
  dayjs.extend(utc);
  dayjs.extend(relativeTime);
  const roroData = modify({ ...taskSummaryData.roro.details });

  return (
    <section className="card">
      <div>
        <div className="govuk-grid-row grid-background--greyed">
          <div className="govuk-grid-column-one-half">
            <div className="summary-data-list">
              <i className={`icon-position--left align-middle ${getMovementModeIcon(movementMode, roroData.vehicle, roroData.passengers)}`} />
              <div className="first-half">
                <ul>
                  <li>
                    <span className="govuk-caption-m">
                      {roroData.vehicle?.registrationNumber && 'Vehicle'}
                      {(roroData.vehicle?.registrationNumber && roroData.vehicle?.trailer?.regNumber) && ' with '}
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
            </div>
          </div>
          <div className="govuk-grid-column-one-half align-right">
            <div className="summary-data-list">
              <i className="c-icon-ship align-middle" />
              <div className="second-half">
                <ul>
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TaskSummary;
