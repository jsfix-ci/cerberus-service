import classNames from 'classnames';
import React from 'react';

import { BookingUtil,
  CommonUtil,
  DocumentUtil,
  EnrichmentUtil,
  MovementUtil,
  PersonUtil,
  VehicleUtil } from '../../../../../utils';
import DatetimeUtil from '../../../../../utils/Datetime/datetimeUtil';

import { DATE_FORMATS, ICON, ICON_MAPPING, MOVEMENT_MODES, STRINGS } from '../../../../../utils/constants';

import EnrichmentCount from '../../../../../components/EnrichmentCount/EnrichmentCount';

const TouristMovementSection = ({ targetTask }) => {
  const person = PersonUtil.get(targetTask);
  const otherPersons = PersonUtil.getOthers(targetTask);
  const document = DocumentUtil.get(person);
  const vehicle = VehicleUtil.get(targetTask);
  const booking = BookingUtil.get(targetTask);
  const journey = MovementUtil.movementJourney(targetTask);
  const mode = MovementUtil.movementMode(targetTask);
  const description = MovementUtil.iconDescription(targetTask);
  const iconFromDescription = ICON_MAPPING[mode]?.[description];
  const datetimeList = DatetimeUtil.toList(BookingUtil.bookedAt(booking), MovementUtil.departureTime(journey));

  const createCoTravellers = () => {
    if (Array.isArray(otherPersons) && !otherPersons.length) {
      return <li className="govuk-!-font-weight-bold">{STRINGS.NONE_TEXT}</li>;
    }
    const maxToDisplay = 4;
    const remaining = otherPersons.length > maxToDisplay ? otherPersons.length - maxToDisplay : 0;
    const coTravellersJsx = otherPersons.map((_person, index) => {
      if (index < maxToDisplay) {
        return (
          <li key={index}>
            {PersonUtil.firstname(_person)}{(index !== maxToDisplay - 1) && (index !== otherPersons.length - 1) ? ',' : ''}
            {(remaining > 0 && index + 1 === maxToDisplay) ? ` plus ${remaining} more` : ''}
          </li>
        );
      }
    });
    return (
      { coTravellersJsx }
    );
  };

  const TouristCar = () => {
    return (
      <>
        <div className="govuk-grid-item">
          <div>
            <EnrichmentCount
              labelText="Driver"
              movementStats={CommonUtil.movementStats(person)}
            />
            <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0">
              <li className="govuk-!-font-weight-bold">{PersonUtil.fullname(person)}</li>
              <li>{PersonUtil.gender(person)}</li>
            </ul>
          </div>
        </div>
        <div className="govuk-grid-item vertical-dotted-line">
          <div>
            <EnrichmentCount
              labelText="VRN"
              movementStats={CommonUtil.movementStats(vehicle)}
            />
            <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0">
              <li className="govuk-!-font-weight-bold">{VehicleUtil.vehicleReg(vehicle)}</li>
            </ul>
          </div>
        </div>
        <div className="govuk-grid-item vertical-dotted-line">
          <div>
            <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular secondary-text">
              Booking
            </h3>
            <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0">
              <li>Booked on {DatetimeUtil.format(BookingUtil.bookedAt(booking), DATE_FORMATS.SHORT)}</li>
              <br />
              <li>{DatetimeUtil.calculateTimeDifference(datetimeList, STRINGS.DEFAULT_BOOKING_STRING_PREFIX)}</li>
            </ul>
          </div>
        </div>
        <div className="govuk-grid-item vertical-dotted-line">
          <div>
            <h3
              className={
                classNames('govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular secondary-text',
                  EnrichmentUtil.personsWithPreviousSeizures(otherPersons) ? 'font--red' : '')
              }
            >
              Co-travellers
            </h3>
            <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0">
              {(iconFromDescription === ICON.CAR || iconFromDescription === ICON.INDIVIDUAL)
                && <li className="govuk-!-font-weight-bold">{STRINGS.NONE_TEXT}</li>}
              {iconFromDescription === ICON.GROUP && createCoTravellers(otherPersons)}
            </ul>
          </div>
        </div>
      </>
    );
  };

  const TouristFootPassengers = () => {
    return (
      <>
        <div className="govuk-grid-item">
          <div>
            <EnrichmentCount labelText="Primary traveller" movementStats={CommonUtil.movementStats(person)} />
            <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0">
              <li className="govuk-!-font-weight-bold">{PersonUtil.fullname(person)}</li>
            </ul>
          </div>
        </div>
        <div className="govuk-grid-item vertical-dotted-line">
          <div>
            <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular secondary-text">
              Document
            </h3>
            <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0">
              <li className="govuk-!-font-weight-bold">{DocumentUtil.docNumber(document)}</li>
            </ul>
          </div>
        </div>
        <div className="govuk-grid-item vertical-dotted-line">
          <div>
            <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular secondary-text">
              Booking
            </h3>
            <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0">
              <li>Booked on {DatetimeUtil.format(BookingUtil.bookedAt(booking), DATE_FORMATS.SHORT)}</li>
              <br />
              <li>{DatetimeUtil.calculateTimeDifference(datetimeList, STRINGS.DEFAULT_BOOKING_STRING_PREFIX)}</li>
            </ul>
          </div>
        </div>
        <div className="govuk-grid-item vertical-dotted-line">
          <div>
            <h3
              className={
                classNames('govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular secondary-text',
                  EnrichmentUtil.personsWithPreviousSeizures(otherPersons) ? 'font--red' : '')
              }
            >
              Co-travellers
            </h3>
            <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0">
              {(iconFromDescription === ICON.CAR || iconFromDescription === ICON.INDIVIDUAL)
                && <li className="govuk-!-font-weight-bold">{STRINGS.NONE_TEXT}</li>}
              {iconFromDescription === ICON.GROUP && createCoTravellers(otherPersons)}
            </ul>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      {mode === MOVEMENT_MODES.TOURIST && iconFromDescription === ICON.CAR && (
        <TouristCar />
      )}
      {mode === MOVEMENT_MODES.TOURIST
        && (iconFromDescription === ICON.INDIVIDUAL || iconFromDescription === ICON.GROUP) && (
        <TouristFootPassengers />
      )}
    </>
  );
};

export default TouristMovementSection;
