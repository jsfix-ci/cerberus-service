import React from 'react';
import { AccountUtil,
  BookingUtil,
  CommonUtil,
  GoodsUtil,
  HaulierUtil } from '../../../../../utils';
import DatetimeUtil from '../../../../../utils/Datetime/datetimeUtil';
import TrailerUtil from '../../../../../utils/Trailer/trailerUtil';

import { DATE_FORMATS, STRINGS } from '../../../../../utils/constants';

import EnrichmentCount from '../../../../../components/EnrichmentCount/EnrichmentCount';

const UnaccompaniedMovementSection = ({ trailer,
  haulier,
  account,
  booking,
  goods,
  bookingDepartureTime }) => {
  return (
    <>
      <div className="govuk-grid-item">
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
      <div className="govuk-grid-item vertical-dotted-line" />
    </>
  );
};

export default UnaccompaniedMovementSection;
