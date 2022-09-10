import React from 'react';
import * as pluralise from 'pluralise';
import { JourneyUtil, MovementUtil, PersonUtil, StringUtil, TrailerUtil, VehicleUtil, VesselUtil } from '../../../../utils';

import { ICON, ICON_MAPPING, MOVEMENT_MODES, STRINGS } from '../../../../utils/constants';

const toMovementDescriptionContent = (mode, vehicle, trailer, person, totalPersons, iconFromDescription) => {
  switch (mode) {
    case MOVEMENT_MODES.UNACCOMPANIED_FREIGHT:
    case MOVEMENT_MODES.ACCOMPANIED_FREIGHT: {
      return (
        <>
          {vehicle ? VehicleUtil.registration(vehicle) : ''}
          {vehicle && trailer ? <span className="govuk-!-font-weight-regular"> {STRINGS.DESCRIPTIONS.PREPOSITIONS.WITH} </span> : ''}
          {trailer ? TrailerUtil.registration(trailer) : ''}
          {vehicle && person ? <span className="govuk-!-font-weight-regular"> driven by {PersonUtil.fullname(person)}</span> : ''}
        </>
      );
    }
    case MOVEMENT_MODES.TOURIST: {
      if (iconFromDescription === ICON.CAR) {
        return (
          <>
            {vehicle ? VehicleUtil.registration(vehicle) : ''}
            {vehicle && person ? <span className="govuk-!-font-weight-regular"> driven by {PersonUtil.fullname(person)}</span> : ''}
          </>
        );
      }
      if (iconFromDescription === ICON.INDIVIDUAL || iconFromDescription === ICON.GROUP) {
        return (
          <span className="govuk-!-font-weight-bold">
            {pluralise.withCount(totalPersons, `% ${STRINGS.DESCRIPTIONS.FOOT_PASSENGER}`, `% ${STRINGS.DESCRIPTIONS.FOOT_PASSENGER}s`, null)}
          </span>
        );
      }
      break;
    }
    default: {
      return null;
    }
  }
};

const toMovementDescription = (mode, vehicle, trailer, totalPersons) => {
  let description = '';
  switch (mode) {
    case MOVEMENT_MODES.UNACCOMPANIED_FREIGHT:
    case MOVEMENT_MODES.ACCOMPANIED_FREIGHT: {
      description += vehicle ? STRINGS.DESCRIPTIONS.VEHICLE : '';
      description += vehicle && trailer ? ` ${STRINGS.DESCRIPTIONS.PREPOSITIONS.WITH} ` : '';
      description += trailer ? STRINGS.DESCRIPTIONS.TRAILER : '';
      return description;
    }
    case MOVEMENT_MODES.TOURIST: {
      description += vehicle && totalPersons >= 0 ? STRINGS.DESCRIPTIONS.VEHICLE : '';
      description += !vehicle && totalPersons === 1 ? STRINGS.DESCRIPTIONS.SINGLE_PASSENGER : '';
      description += !vehicle && totalPersons > 1 ? STRINGS.DESCRIPTIONS.GROUP : '';
      return description;
    }
    default: {
      return null;
    }
  }
};

const RoRoTaskSummary = ({ version }) => {
  const mode = MovementUtil.movementMode(version);
  const description = MovementUtil.iconDescription(version);
  const iconFromDescription = ICON_MAPPING[mode]?.[description];
  const journey = JourneyUtil.get(version);
  const vessel = VesselUtil.get(version);
  const vehicle = VehicleUtil.get(version);
  const person = PersonUtil.get(version);
  const trailer = TrailerUtil.get(version);
  const arrivalTime = JourneyUtil.arrivalTime(journey);
  const totalPersons = PersonUtil.totalPersons(version);
  return (
    <section className="card">
      <div className="task-list--voyage-section overflow-hidden">
        <div className="govuk-grid-row grid-background--greyed">
          <div className="govuk-grid-column-one-half govuk-!-padding-left-4">
            <i className={`icon-position--left ${ICON_MAPPING[mode]?.[description]}`} />
            <p className="govuk-body-s govuk-!-margin-bottom-0 govuk-!-padding-left-1">
              {toMovementDescription(mode, vehicle, trailer, totalPersons)}
            </p>
            <span className="govuk-body-s govuk-!-margin-bottom-0 govuk-!-font-weight-bold govuk-!-padding-left-1">
              <span className="govuk-font-weight-bold">
                {toMovementDescriptionContent(mode, vehicle, trailer, person, totalPersons, iconFromDescription)}
              </span>
            </span>
          </div>
          <div className="govuk-grid-column-one-half govuk-!-padding-right-1 align-right">
            <i className="c-icon-ship" />
            <p className="govuk-body-s govuk-!-padding-right-2 govuk-!-margin-bottom-0">
              {`${VesselUtil.operator(vessel)} voyage of ${VesselUtil.name(vessel)}`}
            </p>
            <p className="govuk-body-s content-line-two govuk-!-padding-right-2">
              {`${JourneyUtil.formatDepartureTime(journey)}`}
              <span className="dot" />
              <span className="govuk-!-font-weight-bold">{JourneyUtil.departureLoc(journey)}</span> &#8594;
              <span className="govuk-!-font-weight-bold"> {JourneyUtil.arrivalLoc(journey)}</span>
              <span className="dot" />
              {JourneyUtil.formatArrivalTime(journey)}
              <br />
              <span>{StringUtil.voyageText(arrivalTime)}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoRoTaskSummary;
