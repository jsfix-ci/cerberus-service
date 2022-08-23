import React from 'react';
import { MovementUtil, VehicleUtil, VesselUtil } from '../../../../../utils';
import { DESCRIPTION_MAPPING, ICON, ICON_MAPPING, MOVEMENT_MODES } from '../../../../../utils/constants';
import TrailerUtil from '../../../../../utils/Trailer/trailerUtil';

const VoyageSection = ({ mode,
  journey,
  vessel,
  vehicle,
  trailer,
  description,
  iconDescription,
  arrivalTime,
  totalPersons }) => {
  const getMovementModeTypeContent = () => {
    const iconFromDescription = ICON_MAPPING[mode]?.[iconDescription];

    if (iconFromDescription === ICON.CAR) {
      const vehicleReg = VehicleUtil.vehicleReg(vehicle);
      return vehicleReg || '\xa0';
    }
    if (iconFromDescription === ICON.INDIVIDUAL) {
      return '1 foot passenger';
    }
    return totalPersons ? `${totalPersons} foot passengers` : '0';
  };

  const renderModeSection = () => {
    if (mode === MOVEMENT_MODES.ACCOMPANIED_FREIGHT) {
      return (
        <div className="govuk-grid-column-one-quarter govuk-!-padding-left-9">
          <i className={`icon-position--left ${ICON_MAPPING[mode]?.[iconDescription]}`} />
          <p className="govuk-body-s content-line-one govuk-!-margin-bottom-0 govuk-!-padding-left-1">
            {VehicleUtil.vehicleMake(vehicle)} {VehicleUtil.vehicleModel(vehicle)}
          </p>
          <span className="govuk-body-s govuk-!-margin-bottom-0 govuk-!-font-weight-bold govuk-!-padding-left-1">
            <span className="govuk-font-weight-bold">
              {TrailerUtil.trailerReg(trailer)}
            </span>
          </span>
        </div>
      );
    }
    if (mode === MOVEMENT_MODES.UNACCOMPANIED_FREIGHT) {
      return (
        <div className="govuk-grid-column-one-quarter govuk-!-padding-left-9">
          <i className={`icon-position--left ${ICON_MAPPING[mode]?.[iconDescription]}`} />
          <p className="govuk-body-s content-line-one govuk-!-margin-bottom-0 govuk-!-padding-left-1">{'\xa0'}</p>
          <span className="govuk-body-s govuk-!-margin-bottom-0 govuk-!-font-weight-bold govuk-!-padding-left-1">
            <span className="govuk-font-weight-bold">
              {VehicleUtil.vehicleReg(vehicle)}
            </span>
          </span>
        </div>
      );
    }
    if (mode === MOVEMENT_MODES.TOURIST) {
      return (
        <div className="govuk-grid-column-one-quarter govuk-!-padding-left-9">
          <i className={`icon-position--left ${ICON_MAPPING[mode]?.[iconDescription]}`} />
          <p className="govuk-body-s content-line-one govuk-!-margin-bottom-0 govuk-!-padding-left-1">
            {DESCRIPTION_MAPPING[description]}
          </p>
          <span className="govuk-body-s govuk-!-margin-bottom-0 govuk-!-font-weight-bold govuk-!-padding-left-1">
            <span className="govuk-font-weight-bold">
              {getMovementModeTypeContent()}
            </span>
          </span>
        </div>
      );
    }
  };

  const renderVoyageSection = () => {
    return (
      <div className="govuk-grid-column-three-quarters govuk-!-padding-right-7 align-right">
        <i className="c-icon-ship" />
        <p className="content-line-one govuk-!-padding-right-2">
          {`${VesselUtil.operator(vessel)} voyage of ${VesselUtil.name(vessel)}, ${MovementUtil.voyageText(arrivalTime)}`}
        </p>
        <p className="govuk-body-s content-line-two govuk-!-padding-right-2">
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
