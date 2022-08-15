import React from 'react';
import { DESCRIPTION_MAPPING, ICON, ICON_MAPPING, MOVEMENT_MODES, VIEW } from '../../../utils/constants';
import { MovementUtil, PersonUtil, VehicleUtil, VesselUtil } from '../../../utils';
import TrailerUtil from '../../../utils/Trailer/trailerUtil';

const AirpaxVoyage = ({ targetTask, refDataAirlineCodes }) => {
  const renderModeSection = () => {
    return (
      <div className="govuk-grid-column-one-quarter govuk-!-padding-left-9">
        <i className={`icon-position--left ${ICON.INDIVIDUAL}`} />
        <p className="govuk-body-s content-line-one govuk-!-margin-bottom-0 govuk-!-padding-left-1">
          {MovementUtil.description(targetTask)}
        </p>
        <span className="govuk-body-s govuk-!-margin-bottom-0 govuk-!-font-weight-bold govuk-!-padding-left-1">
          <span className="govuk-font-weight-bold">
            {MovementUtil.movementType(targetTask)} {MovementUtil.status(targetTask)}
          </span>
        </span>
      </div>
    );
  };

  const renderVoyageSection = () => {
    const journey = MovementUtil.movementJourney(targetTask);
    const flight = MovementUtil.movementFlight(targetTask);
    const arrivalTime = MovementUtil.arrivalTime(journey);
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

const RoRoVoyage = ({ targetTask }) => {
  const getMovementModeTypeContent = (description, _mode, _targetTask) => {
    const vehicle = VehicleUtil.get(_targetTask);
    const totalPersons = PersonUtil.totalPersons(_targetTask);
    const iconFromDescription = ICON_MAPPING[_mode]?.[description];

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
    const mode = MovementUtil.movementMode(targetTask);
    const description = MovementUtil.iconDescription(targetTask);
    const vehicle = VehicleUtil.get(targetTask);
    const trailer = TrailerUtil.get(targetTask);

    if (mode === MOVEMENT_MODES.ACCOMPANIED_FREIGHT) {
      return (
        <div className="govuk-grid-column-one-quarter govuk-!-padding-left-9">
          <i className={`icon-position--left ${ICON_MAPPING[mode]?.[description]}`} />
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
          <i className={`icon-position--left ${ICON_MAPPING[mode]?.[description]}`} />
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
          <i className={`icon-position--left ${ICON_MAPPING[mode]?.[description]}`} />
          <p className="govuk-body-s content-line-one govuk-!-margin-bottom-0 govuk-!-padding-left-1">
            {DESCRIPTION_MAPPING[description]}
          </p>
          <span className="govuk-body-s govuk-!-margin-bottom-0 govuk-!-font-weight-bold govuk-!-padding-left-1">
            <span className="govuk-font-weight-bold">
              {getMovementModeTypeContent(description, mode, targetTask)}
            </span>
          </span>
        </div>
      );
    }
  };

  const renderVoyageSection = () => {
    const vessel = VesselUtil.get(targetTask);
    const journey = MovementUtil.movementJourney(targetTask);
    const arrivalTime = MovementUtil.arrivalTime(journey);
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

const VoyageSection = ({ view, targetTask, refDataAirlineCodes }) => {
  let voyageJsx;
  if (view === VIEW.AIRPAX) {
    voyageJsx = (
      <AirpaxVoyage
        targetTask={targetTask}
        refDataAirlineCodes={refDataAirlineCodes}
      />
    );
  }
  if (view === VIEW.RORO_V2) {
    voyageJsx = (
      <RoRoVoyage
        targetTask={targetTask}
      />
    );
  }
  return (
    <section className="task-list--voyage-section">
      <div>
        <div className="govuk-grid-row grid-background--greyed">
          {voyageJsx}
        </div>
      </div>
    </section>
  );
};

export default VoyageSection;
