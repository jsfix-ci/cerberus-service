import React from 'react';

import * as pluralise from 'pluralise';
import classNames from 'classnames';
import { DATE_FORMATS, ICON, ICON_MAPPING, MOVEMENT_MODES, STRINGS, VIEW } from '../../../utils/constants';

import EnrichmentCount from '../EnrichmentCount';

import {
  AccountUtil,
  BaggageUtil,
  BookingUtil,
  CommonUtil,
  DocumentUtil, EnrichmentUtil,
  GoodsUtil,
  HaulierUtil,
  MovementUtil,
  PersonUtil,
  VehicleUtil,
} from '../../../utils';
import TrailerUtil from '../../../utils/Trailer/trailerUtil';
import DatetimeUtil from '../../../utils/Datetime/datetimeUtil';

const RoRoSection = ({ targetTask }) => {
  const person = PersonUtil.get(targetTask);
  const otherPersons = PersonUtil.getOthers(targetTask);
  const document = DocumentUtil.get(person);
  const vehicle = VehicleUtil.get(targetTask);
  const trailer = TrailerUtil.get(targetTask);
  const haulier = HaulierUtil.get(targetTask);
  const account = AccountUtil.get(targetTask);
  const booking = BookingUtil.get(targetTask);
  const journey = MovementUtil.movementJourney(targetTask);
  const goods = GoodsUtil.get(targetTask);
  const mode = MovementUtil.movementMode(targetTask);
  const description = MovementUtil.iconDescription(targetTask);
  const iconFromDescription = ICON_MAPPING[mode]?.[description];
  const datetimeList = DatetimeUtil.toList(BookingUtil.bookedAt(booking), MovementUtil.departureTime(journey));

  const createCoTravellers = (_otherPersons) => {
    if (Array.isArray(_otherPersons) && !_otherPersons.length) {
      return <li className="govuk-!-font-weight-bold">{STRINGS.NONE_TEXT}</li>;
    }
    const maxToDisplay = 4;
    const remaining = _otherPersons.length > maxToDisplay ? _otherPersons.length - maxToDisplay : 0;
    const coTravellersJsx = _otherPersons.map((_person, index) => {
      if (index < maxToDisplay) {
        return (
          <li key={index}>
            {PersonUtil.firstname(_person)}{(index !== maxToDisplay - 1) && (index !== _otherPersons.length - 1) ? ',' : ''}
            {(remaining > 0 && index + 1 === maxToDisplay) ? ` plus ${remaining} more` : ''}
          </li>
        );
      }
    });
    return (
      { coTravellersJsx }
    );
  };

  return (
    <>
      <div className="govuk-grid-item">
        {mode === MOVEMENT_MODES.ACCOMPANIED_FREIGHT && (
          <>
            <div>
              <EnrichmentCount labelText="Driver details" movementStats={CommonUtil.movementStats(person)} />
              <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0">
                <li className="govuk-!-font-weight-bold">{PersonUtil.fullname(person)}</li>
                <li>DOB: {PersonUtil.dob(person, DATE_FORMATS.SHORT)}</li>
              </ul>
            </div>
            <div>
              <h3
                className="govuk-heading-s govuk-!-margin-top-3 govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular secondary-text"
              >
                Passenger details
              </h3>
              <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0">
                <li className="govuk-!-font-weight-bold">
                  {pluralise.withCount(PersonUtil.othersCount(targetTask), '% passenger', '% passengers', 'None')}
                </li>
              </ul>
            </div>
          </>
        )}
        {mode === MOVEMENT_MODES.UNACCOMPANIED_FREIGHT && (
          <>
            <div>
              <EnrichmentCount
                labelText="Trailer details"
                movementStats={CommonUtil.movementStats(trailer)}
              />
              <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0">
                <li className="govuk-!-font-weight-bold">{TrailerUtil.trailerReg(trailer)}</li>
                <li>{TrailerUtil.type(trailer)}</li>
              </ul>
            </div>
          </>
        )}
        {mode === MOVEMENT_MODES.TOURIST && iconFromDescription === ICON.CAR && (
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
        )}
        {mode === MOVEMENT_MODES.TOURIST && (iconFromDescription === ICON.INDIVIDUAL || iconFromDescription === ICON.GROUP) && (
          <div>
            <EnrichmentCount labelText="Primary traveller" movementStats={CommonUtil.movementStats(person)} />
            <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0">
              <li className="govuk-!-font-weight-bold">{PersonUtil.fullname(person)}</li>
            </ul>
          </div>
        )}
      </div>

      <div className="govuk-grid-item vertical-dotted-line">
        {mode === MOVEMENT_MODES.ACCOMPANIED_FREIGHT && (
          <>
            <div>
              <EnrichmentCount labelText="Vehicle details" movementStats={CommonUtil.movementStats(vehicle)} />
              <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0">
                <li className="govuk-!-font-weight-bold">{VehicleUtil.vehicleReg(vehicle)}</li>
                <li>{VehicleUtil.vehicleColour(vehicle)}</li>
                <li>{VehicleUtil.vehicleMake(vehicle)}</li>
                <li>{VehicleUtil.vehicleModel(vehicle)}</li>
                {/* TODO: Where does vehicle trips stats come from? */}
              </ul>
            </div>
            <div>
              <EnrichmentCount
                labelText="Trailer details"
                movementStats={CommonUtil.movementStats(trailer)}
                classnames="govuk-!-margin-top-3"
              />
              <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0">
                <li className="govuk-!-font-weight-bold">{TrailerUtil.trailerReg(trailer)}</li>
                <li>{TrailerUtil.type(trailer)}</li>
              </ul>
            </div>
          </>
        )}
        {mode === MOVEMENT_MODES.UNACCOMPANIED_FREIGHT && (
          <>
            <div>
              <EnrichmentCount
                labelText="Haulier details"
                movementStats={CommonUtil.movementStats(haulier)}
              />
              <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0">
                <li className="govuk-!-font-weight-bold">{HaulierUtil.name(haulier)}</li>
              </ul>
            </div>
            <div>
              <EnrichmentCount
                labelText="Account details"
                movementStats={CommonUtil.movementStats(account)}
                classnames="govuk-!-margin-top-3"
              />
              <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0">
                <li className="govuk-!-font-weight-bold">{AccountUtil.name(account)}</li>
                <br />
                <li>Booked on {DatetimeUtil.format(BookingUtil.bookedAt(booking), DATE_FORMATS.SHORT)}</li>
                <br />
                <li>{DatetimeUtil.calculateTimeDifference(datetimeList, STRINGS.DEFAULT_BOOKING_STRING_PREFIX)}</li>
              </ul>
            </div>
          </>
        )}
        {mode === MOVEMENT_MODES.TOURIST && iconFromDescription === ICON.CAR && (
          <div>
            <EnrichmentCount
              labelText="VRN"
              movementStats={CommonUtil.movementStats(vehicle)}
            />
            <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0">
              <li className="govuk-!-font-weight-bold">{VehicleUtil.vehicleReg(vehicle)}</li>
            </ul>
          </div>
        )}
        {mode === MOVEMENT_MODES.TOURIST && (iconFromDescription === ICON.INDIVIDUAL || iconFromDescription === ICON.GROUP) && (
          <div>
            <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular secondary-text">
              Document
            </h3>
            <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0">
              <li className="govuk-!-font-weight-bold">{DocumentUtil.docNumber(document)}</li>
            </ul>
          </div>
        )}
      </div>

      <div className="govuk-grid-item vertical-dotted-line">
        {mode === MOVEMENT_MODES.ACCOMPANIED_FREIGHT && (
          <>
            <div>
              <EnrichmentCount
                labelText="Haulier details"
                movementStats={CommonUtil.movementStats(haulier)}
              />
              <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0">
                <li className="govuk-!-font-weight-bold">{HaulierUtil.name(haulier)}</li>
              </ul>
            </div>
            <div>
              <EnrichmentCount
                labelText="Account details"
                movementStats={CommonUtil.movementStats(account)}
                classnames="govuk-!-margin-top-3"
              />
              <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0">
                <li className="govuk-!-font-weight-bold">{AccountUtil.name(account)}</li>
                <br />
                <li>Booked on {DatetimeUtil.format(BookingUtil.bookedAt(booking), DATE_FORMATS.SHORT)}</li>
                <br />
                <li>{DatetimeUtil.calculateTimeDifference(datetimeList, STRINGS.DEFAULT_BOOKING_STRING_PREFIX)}</li>
              </ul>
            </div>
          </>
        )}
        {mode === MOVEMENT_MODES.UNACCOMPANIED_FREIGHT && (
          <div>
            <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular secondary-text">
              Goods description
            </h3>
            <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0">
              <li className="govuk-!-font-weight-bold">{GoodsUtil.description(goods)}</li>
            </ul>
          </div>
        )}
        {mode === MOVEMENT_MODES.TOURIST
          && (iconFromDescription === ICON.CAR || iconFromDescription === ICON.INDIVIDUAL || iconFromDescription === ICON.GROUP)
          && (
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
          )}
      </div>

      <div className="govuk-grid-item vertical-dotted-line">
        {mode === MOVEMENT_MODES.ACCOMPANIED_FREIGHT && (
          <div>
            <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular secondary-text">
              Goods description
            </h3>
            <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0">
              <li className="govuk-!-font-weight-bold">{GoodsUtil.description(goods)}</li>
            </ul>
          </div>
        )}
        {mode === MOVEMENT_MODES.UNACCOMPANIED_FREIGHT && (
          <></>
        )}
        {mode === MOVEMENT_MODES.TOURIST && (
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
        )}
      </div>
    </>
  );
};

const AirpaxSection = ({ targetTask }) => {
  const person = PersonUtil.get(targetTask);
  const baggage = BaggageUtil.get(targetTask);
  const booking = BookingUtil.get(targetTask);
  const journey = MovementUtil.movementJourney(targetTask);
  const flight = MovementUtil.movementFlight(targetTask);
  const document = DocumentUtil.get(person);
  const otherPersons = PersonUtil.getOthers(targetTask);
  return (
    <>
      <div className="govuk-grid-item">
        <div>
          <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular secondary-text">
            {MovementUtil.movementType(targetTask)}
          </h3>
          <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0">
            <li className="govuk-!-font-weight-bold">{PersonUtil.lastname(person)}, </li>
            <li className="govuk-!-font-weight-regular">{PersonUtil.firstname(person)}</li>
          </ul>
          <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0">
            <li className="govuk-!-font-weight-regular">{PersonUtil.gender(person)}, </li>
            <li className="govuk-!-font-weight-regular">{PersonUtil.dob(person)}, </li>
            <li className="govuk-!-font-weight-regular">{PersonUtil.nationality(person)}</li>
          </ul>
          <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0 secondary-text">
            <li className="govuk-!-font-weight-regular">{BaggageUtil.checked(baggage)}, </li>
            <li className="govuk-!-font-weight-regular">{BaggageUtil.weight(baggage)} </li>
          </ul>
          <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0 secondary-text">
            <li className="govuk-!-font-weight-regular">{BookingUtil.toCheckInText(booking)}, </li>
            <li className="govuk-!-font-weight-regular">{MovementUtil.seatNumber(flight)} </li>
          </ul>
        </div>
      </div>

      <div className="govuk-grid-item vertical-dotted-line">
        <div>
          <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular secondary-text">
            Document
          </h3>
          <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0">
            <li className="govuk-!-font-weight-bold">{DocumentUtil.docNumber(document)} ({PersonUtil.nationality(person)})</li>
          </ul>
          <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0 secondary-text">
            <li className="govuk-!-font-weight-regular">{DocumentUtil.docValidity(document)}</li>
          </ul>
          <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0 secondary-text">
            <li className="govuk-!-font-weight-regular">{DocumentUtil.docExpiry(document)}</li>
          </ul>
          <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0 secondary-text">
            <li className="govuk-!-font-weight-regular">{DocumentUtil.docCountry(document)}</li>
          </ul>
        </div>
      </div>

      <div className="govuk-grid-item vertical-dotted-line">
        <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular secondary-text">
          Booking
        </h3>
        <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0">
          <li className="govuk-!-font-weight-bold">{BookingUtil.bookingRef(booking)}</li>
        </ul>
        <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0">
          <li className="govuk-!-font-weight-regular">{BookingUtil.toBookingText(booking)}</li>
        </ul>
        <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0 secondary-text">
          <li className="govuk-!-font-weight-regular">{BookingUtil.bookedPrior(BookingUtil.bookedAt(booking), MovementUtil.departureTime(journey))}</li>
        </ul>
      </div>

      <div className="govuk-grid-item vertical-dotted-line">
        <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular secondary-text">
          Co-travellers
        </h3>
        <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0">
          {PersonUtil.toOthers(otherPersons)}
        </ul>
        <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular secondary-text">
          Route
        </h3>
        <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0">
          <li className="govuk-!-font-weight-regular">{MovementUtil.convertMovementRoute(MovementUtil.movementRoute(journey))}</li>
        </ul>
      </div>
    </>
  );
};

const MovementSection = ({ view, targetTask }) => {
  if (view === VIEW.AIRPAX) {
    return <AirpaxSection targetTask={targetTask} />;
  }
  if (view === VIEW.RORO_V2) {
    return <RoRoSection targetTask={targetTask} />;
  }
};

export default MovementSection;
