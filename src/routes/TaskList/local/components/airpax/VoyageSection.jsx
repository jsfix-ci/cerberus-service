import React from 'react';
import { ICON } from '../../../../../utils/constants';
import { MovementUtil } from '../../../../../utils';

const VoyageSection = ({ refDataAirlineCodes,
  journey,
  flight,
  arrivalTime,
  description,
  movementType,
  movementStatus }) => {
  const renderModeSection = () => {
    return (
      <div className="govuk-grid-column-one-quarter govuk-!-padding-left-9">
        <i className={`icon-position--left ${ICON.INDIVIDUAL}`} />
        <p className="govuk-body-s content-line-one govuk-!-margin-bottom-0 govuk-!-padding-left-1">
          {description}
        </p>
        <span className="govuk-body-s govuk-!-margin-bottom-0 govuk-!-font-weight-bold govuk-!-padding-left-1">
          <span className="govuk-font-weight-bold">
            {movementType} {movementStatus}
          </span>
        </span>
      </div>
    );
  };

  const renderVoyageSection = () => {
    return (
      <div className="govuk-grid-column-three-quarters govuk-!-padding-right-7 align-right">
        <i className="c-icon-aircraft" />
        <p className="content-line-one govuk-!-padding-right-2">
          {`${MovementUtil.airlineName(MovementUtil.airlineOperator(flight), refDataAirlineCodes)}, 
        flight ${MovementUtil.flightNumber(flight)}, 
        ${MovementUtil.voyageText(arrivalTime)}`}
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
    );
  };

  return (
    <>
      {renderModeSection()}
      {renderVoyageSection()}
    </>
  );
};

export default VoyageSection;
