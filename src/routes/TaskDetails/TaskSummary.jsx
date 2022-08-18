import React, { useContext } from 'react';
import { MovementUtil } from '../../utils';

import { ICON } from '../../utils/constants';
import { ApplicationContext } from '../../context/ApplicationContext';

const TaskSummary = ({ version }) => {
  const journey = MovementUtil.movementJourney(version);
  const flight = MovementUtil.movementFlight(version);
  const arrivalTime = MovementUtil.arrivalTime(journey);
  const { refDataAirlineCodes } = useContext(ApplicationContext);
  return (
    <section className="task-list--voyage-section overflow-hidden">
      <div className="govuk-grid-row grid-background--greyed">
        <div className="govuk-grid-column-one-quarter govuk-!-padding-left-9">
          <i className={`icon-position--left ${ICON.INDIVIDUAL}`} />
          <p className="govuk-body-s content-line-one govuk-!-margin-bottom-0 govuk-!-padding-left-1">
            {MovementUtil.description(version)}
          </p>
          <span className="govuk-body-s govuk-!-margin-bottom-0 govuk-!-font-weight-bold govuk-!-padding-left-1">
            <span className="govuk-font-weight-bold">
              {MovementUtil.movementType(version)} {MovementUtil.status(version)}
            </span>
          </span>
        </div>
        <div className="govuk-grid-column-three-quarters govuk-!-padding-right-7 align-right">
          <i className="c-icon-aircraft" />
          <p className="content-line-one govuk-!-padding-right-2">
            {`${MovementUtil.airlineName(MovementUtil.airlineOperator(flight), refDataAirlineCodes())} flight, 
              ${MovementUtil.voyageText(arrivalTime, true, MovementUtil.iataToCity(MovementUtil.arrivalLoc(journey)))}
              `}
          </p>
          <p className="govuk-body-s content-line-two govuk-!-padding-right-2">
            <span className="govuk-!-font-weight-bold">{MovementUtil.flightNumber(flight)}</span>
            <span className="dot" />
            {`${MovementUtil.formatDepartureTime(journey)}`}
            <span className="dot" />
            <span className="govuk-!-font-weight-bold">{MovementUtil.departureLoc(journey)}</span> &#8594;
            <span className="govuk-!-font-weight-bold"> {MovementUtil.arrivalLoc(journey)}</span>
            <span className="dot" />
            {MovementUtil.formatArrivalTime(journey)}
          </p>
        </div>
      </div>
    </section>
  );
};

export default TaskSummary;
