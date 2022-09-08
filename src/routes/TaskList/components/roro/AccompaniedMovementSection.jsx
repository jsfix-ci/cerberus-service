import * as pluralise from 'pluralise';
import React from 'react';
import { AccountUtil,
  BookingUtil,
  CommonUtil,
  GoodsUtil,
  HaulierUtil,
  PersonUtil,
  VehicleUtil } from '../../../../utils';
import TrailerUtil from '../../../../utils/Trailer/trailerUtil';
import { DATE_FORMATS, STRINGS } from '../../../../utils/constants';
import DatetimeUtil from '../../../../utils/Datetime/datetimeUtil';
import EnrichmentCount from '../../../../components/EnrichmentCount/EnrichmentCount';

const AccompaniedMovementSection = ({ person,
  vehicle,
  trailer,
  haulier,
  account,
  booking,
  goods,
  bookingDepartureTime,
  othersCount }) => {
  return (
    <>
      <div className="govuk-grid-item">
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
                {pluralise.withCount(othersCount, '% passenger', '% passengers', 'None')}
              </li>
            </ul>
          </div>
        </>
      </div>

      <div className="govuk-grid-item vertical-dotted-line">
        <>
          <div>
            <EnrichmentCount labelText="Vehicle details" movementStats={CommonUtil.movementStats(vehicle)} />
            <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0">
              <li className="govuk-!-font-weight-bold">{VehicleUtil.registration(vehicle)}</li>
              <li>{VehicleUtil.colour(vehicle)}</li>
              <li>{VehicleUtil.make(vehicle)}</li>
              <li>{VehicleUtil.model(vehicle)}</li>
            </ul>
          </div>
          <div>
            <EnrichmentCount
              labelText="Trailer details"
              movementStats={CommonUtil.movementStats(trailer)}
              classnames="govuk-!-margin-top-3"
            />
            <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0">
              <li className="govuk-!-font-weight-bold">{TrailerUtil.registration(trailer)}</li>
              <li>{TrailerUtil.type(trailer)}</li>
            </ul>
          </div>
        </>
      </div>

      <div className="govuk-grid-item vertical-dotted-line">
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
              <li>{DatetimeUtil.timeDiff(bookingDepartureTime, STRINGS.DEFAULT_BOOKING_STRING_PREFIX)}</li>
            </ul>
          </div>
        </>
      </div>

      <div className="govuk-grid-item vertical-dotted-line">
        <div>
          <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular secondary-text">
            Goods description
          </h3>
          <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-0">
            <li className="govuk-!-font-weight-bold">{GoodsUtil.description(goods)}</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default AccompaniedMovementSection;
