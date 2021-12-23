import React from 'react';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
// Config
import * as pluralise from 'pluralise';
import * as constants from '../../constants';
// Utils
import targetDatetimeDifference from '../../utils/calculateDatetimeDifference';

const createCoTravellers = (coTravellers) => {
  const maxToDisplay = 4;
  const remaining = coTravellers.length > maxToDisplay && coTravellers.length - maxToDisplay;
  const coTravellersJsx = coTravellers.map((coTraveller, index) => {
    if (index > 0) {
      if (index < maxToDisplay) {
        return (
          <li key={uuidv4()}>{coTraveller.firstName} {coTraveller.lastName}{index !== maxToDisplay - 1 ? ',' : ''} {index === maxToDisplay - 1 ? ` plus ${remaining} more` : ''}</li>
        );
      }
    }
  });
  return (
    <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-2">
      {coTravellersJsx}
    </ul>
  );
};

const renderRoRoTouristCard = (roroData, movementModeIcon) => {
  const passengers = roroData?.passengers;
  if (movementModeIcon && constants.RORO_TOURIST_CAR_ICON) {
    return (
      <>
        <section className="task-list--item-2">
          <div>
            <div className="govuk-grid-row grid-background--greyed">
              <div className="govuk-grid-column-one-quarter govuk-!-padding-left-8">
                <i className={`icon-position--left ${movementModeIcon}`} />
                <p className="govuk-body-s content-line-one govuk-!-margin-bottom-0">Vehicle</p>
                <p className="govuk-body-s govuk-!-margin-bottom-0 govuk-!-font-weight-bold">{!roroData.vehicle.registrationNumber ? '\xa0' : roroData.vehicle.registrationNumber.toUpperCase()}</p>
              </div>

              <div className="govuk-grid-column-three-quarters govuk-!-padding-right-7 align-right">
                <i className="c-icon-ship" />
                <p className="content-line-one">{roroData.vessel.company && `${roroData.vessel.company} voyage of `}{roroData.vessel.name}{', '}arrival {!roroData.eta ? 'unknown' : dayjs.utc(roroData.eta).fromNow()}</p>
                <p className="govuk-body-s content-line-two">
                  {!roroData.departureTime ? 'unknown' : dayjs.utc(roroData.departureTime).format(constants.LONG_DATE_FORMAT)}{' '}
                  <span className="govuk-!-font-weight-bold">{roroData.departureLocation || 'unknown'}</span>{' '}-{' '}
                  <span className="govuk-!-font-weight-bold">{roroData.arrivalLocation || 'unknown'}</span> {!roroData.eta ? 'unknown'
                    : dayjs.utc(roroData.eta).format(constants.LONG_DATE_FORMAT)}
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="task-list--item-3">
          <div className="govuk-grid-row">
            <div className="govuk-grid-item">
              <div>
                <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
                  Driver
                </h3>
                <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-2">
                  {roroData.driver ? (
                    <>
                      <li className="govuk-!-font-weight-bold">
                        {roroData.driver.firstName && roroData.driver.firstName}{' '}
                        {roroData.driver.lastName && roroData.driver.lastName}
                      </li>
                      {roroData.driver.gender && <br />}
                      <li>
                        {roroData.driver.gender === 'M' && 'Male'}
                        {roroData.driver.gender === 'F' && 'Female'}
                      </li>
                    </>
                  ) : (<li className="govuk-!-font-weight-bold">Unknown</li>)}
                </ul>
              </div>
            </div>
            <div className="govuk-grid-item verticel-dotted-line">
              <div>
                <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
                  Document
                </h3>
                <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-2">
                  <li className="govuk-!-font-weight-bold">TBC</li>
                </ul>
              </div>
            </div>
            <div className="govuk-grid-item verticel-dotted-line">
              <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
                Booking
              </h3>
              <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-2">
                {roroData.bookingDateTime ? (
                  <>
                    {roroData.bookingDateTime && <li>Booked on {dayjs.utc(roroData.bookingDateTime.split(',')[0]).format(constants.SHORT_DATE_FORMAT)}</li>}
                    {roroData.bookingDateTime && <br />}
                    {roroData.bookingDateTime && <li>{targetDatetimeDifference(roroData.bookingDateTime)}</li>}
                  </>
                ) : (<li className="govuk-!-font-weight-bold">Unknown</li>)}
              </ul>
            </div>
            <div className="govuk-grid-item verticel-dotted-line">
              <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
                Co-travellers
              </h3>
              <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-2">
                {roroData.passengers ? (
                  createCoTravellers(roroData.passengers)
                ) : (<li className="govuk-!-font-weight-bold">None</li>)}
              </ul>
            </div>
          </div>
        </section>
      </>
    );
  } if (movementModeIcon && constants.RORO_TOURIST_INDIVIDUAL_ICON) {
    // Person Icon
    return (
      <>
        <section className="task-list--item-2">
          <div>
            <div className="govuk-grid-row grid-background--greyed">
              <div className="govuk-grid-column-one-quarter govuk-!-padding-left-8">
                <i className={`icon-position--left ${movementModeIcon}`} />
                <p className="govuk-body-s content-line-one govuk-!-margin-bottom-0">Individual</p>
                <p className="govuk-body-s govuk-!-margin-bottom-0 govuk-!-font-weight-bold">1 foot passenger</p>
              </div>

              <div className="govuk-grid-column-three-quarters govuk-!-padding-right-7 align-right">
                <i className="c-icon-ship" />
                <p className="content-line-one">{roroData.vessel.company && `${roroData.vessel.company} voyage of `}{roroData.vessel.name}{', '}arrival {!roroData.eta ? 'unknown' : dayjs.utc(roroData.eta).fromNow()}</p>
                <p className="govuk-body-s content-line-two">
                  {!roroData.departureTime ? 'unknown' : dayjs.utc(roroData.departureTime).format(constants.LONG_DATE_FORMAT)}{' '}
                  <span className="govuk-!-font-weight-bold">{roroData.departureLocation || 'unknown'}</span>{' '}-{' '}
                  <span className="govuk-!-font-weight-bold">{roroData.arrivalLocation || 'unknown'}</span> {!roroData.eta ? 'unknown'
                    : dayjs.utc(roroData.eta).format(constants.LONG_DATE_FORMAT)}
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="task-list--item-3">
          <div className="govuk-grid-row">
            <div className="govuk-grid-item">
              <div>
                <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
                  Primary traveller
                </h3>
                <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-2">
                  <li className="govuk-!-font-weight-bold">{passengers[0].firstName} {passengers[0].lastName}</li>
                </ul>
              </div>
            </div>
            <div className="govuk-grid-item verticel-dotted-line">
              <div>
                <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
                  Document
                </h3>
                <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-2">
                  <li className="govuk-!-font-weight-bold">TBC</li>
                </ul>
              </div>
            </div>
            <div className="govuk-grid-item verticel-dotted-line">
              <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
                Booking
              </h3>
              <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-2">
                {roroData.bookingDateTime ? (
                  <>
                    {roroData.bookingDateTime && <li>Booked on {dayjs.utc(roroData.bookingDateTime.split(',')[0]).format(constants.SHORT_DATE_FORMAT)}</li>}
                    {roroData.bookingDateTime && <br />}
                    {roroData.bookingDateTime && <li>{targetDatetimeDifference(roroData.bookingDateTime)}</li>}
                  </>
                ) : (<li className="govuk-!-font-weight-bold">Unknown</li>)}
              </ul>
            </div>
            <div className="govuk-grid-item verticel-dotted-line">
              <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
                Co-travellers
              </h3>
              <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-2">
                <li className="govuk-!-font-weight-bold">None</li>
              </ul>
            </div>
          </div>
        </section>
      </>
    );
  } if (movementModeIcon && constants.RORO_TOURIST_GROUP_ICON) {
    return (
      <>
        <section className="task-list--item-2">
          <div>
            <div className="govuk-grid-row grid-background--greyed">
              <div className="govuk-grid-column-one-quarter govuk-!-padding-left-8">
                <i className={`icon-position--left ${movementModeIcon}`} />
                <p className="govuk-body-s content-line-one govuk-!-margin-bottom-0">Group</p>
                <p className="govuk-body-s govuk-!-margin-bottom-0 govuk-!-font-weight-bold">{passengers.length} foot passengers</p>
              </div>
              <div className="govuk-grid-column-three-quarters govuk-!-padding-right-7 align-right">
                <i className="c-icon-ship" />
                <p className="content-line-one">{roroData.vessel.company && `${roroData.vessel.company} voyage of `}{roroData.vessel.name}{', '}arrival {!roroData.eta ? 'unknown' : dayjs.utc(roroData.eta).fromNow()}</p>
                <p className="govuk-body-s content-line-two">
                  {!roroData.departureTime ? 'unknown' : dayjs.utc(roroData.departureTime).format(constants.LONG_DATE_FORMAT)}{' '}
                  <span className="govuk-!-font-weight-bold">{roroData.departureLocation || 'unknown'}</span>{' '}-{' '}
                  <span className="govuk-!-font-weight-bold">{roroData.arrivalLocation || 'unknown'}</span> {!roroData.eta ? 'unknown'
                    : dayjs.utc(roroData.eta).format(constants.LONG_DATE_FORMAT)}
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="task-list--item-3">
          <div className="govuk-grid-row">
            <div className="govuk-grid-item">
              <div>
                <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
                  Primary traveller
                </h3>
                <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-2">
                  <li className="govuk-!-font-weight-bold">{passengers[0].firstName} {passengers[0].lastName}</li>
                </ul>
              </div>
            </div>
            <div className="govuk-grid-item verticel-dotted-line">
              <div>
                <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
                  Document
                </h3>
                <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-2">
                  <li className="govuk-!-font-weight-bold">TBC</li>
                </ul>
              </div>
            </div>
            <div className="govuk-grid-item verticel-dotted-line">
              <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
                Booking
              </h3>
              <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-2">
                {roroData.bookingDateTime ? (
                  <>
                    {roroData.bookingDateTime && <li>Booked on {dayjs.utc(roroData.bookingDateTime.split(',')[0]).format(constants.SHORT_DATE_FORMAT)}</li>}
                    {roroData.bookingDateTime && <br />}
                    {roroData.bookingDateTime && <li>{targetDatetimeDifference(roroData.bookingDateTime)}</li>}
                  </>
                ) : (<li className="govuk-!-font-weight-bold">Unknown</li>)}
              </ul>
            </div>
            <div className="govuk-grid-item verticel-dotted-line">
              <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
                Co-travellers
              </h3>
              {createCoTravellers(passengers)}
            </div>
          </div>
        </section>
      </>
    );
  }
};

const TaskListModeCard = ({ roroData, target, movementModeIcon }) => {
  const passengers = roroData.passengers;
  const movementMode = target.movementMode.toUpperCase();
  return (
    <>
      {movementMode === constants.RORO_UNACCOMPANIED_FREIGHT.toUpperCase() && (
        <>
          <section className="task-list--item-2">
            <div>
              <div className="govuk-grid-row grid-background--greyed">
                <div className="govuk-grid-column-one-quarter govuk-!-padding-left-8">
                  <i className={`icon-position--left ${movementModeIcon}`} />
                  <p className="govuk-body-s content-line-one govuk-!-margin-bottom-0">{!roroData.vehicle.make ? '\xa0' : roroData.vehicle.make} {roroData.vehicle.model}</p>
                  <p className="govuk-body-s govuk-!-margin-bottom-0 govuk-!-font-weight-bold">{!roroData.vehicle.registrationNumber ? '\xa0' : roroData.vehicle.registrationNumber.toUpperCase()}</p>
                </div>

                <div className="govuk-grid-column-three-quarters govuk-!-padding-right-7 align-right">
                  <i className="c-icon-ship" />
                  <p className="content-line-one">{roroData.vessel.company && `${roroData.vessel.company} voyage of `}{roroData.vessel.name}{', '}arrival {!roroData.eta ? 'unknown' : dayjs.utc(roroData.eta).fromNow()}</p>
                  <p className="govuk-body-s content-line-two">
                    {!roroData.departureTime ? 'unknown' : dayjs.utc(roroData.departureTime).format(constants.LONG_DATE_FORMAT)}{' '}
                    <span className="govuk-!-font-weight-bold">{roroData.departureLocation || 'unknown'}</span>{' '}-{' '}
                    <span className="govuk-!-font-weight-bold">{roroData.arrivalLocation || 'unknown'}</span> {!roroData.eta ? 'unknown'
                      : dayjs.utc(roroData.eta).format(constants.LONG_DATE_FORMAT)}
                  </p>
                </div>
              </div>
            </div>
          </section>
          <section className="task-list--item-3">
            <div className="govuk-grid-row">
              <div className="govuk-grid-item">
                <div>
                  <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
                    Driver details
                  </h3>
                  <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-2">
                    {roroData.driver ? (
                      <>
                        {roroData.driver.firstName && <li className="govuk-!-font-weight-bold">{roroData.driver.firstName}</li>}
                        {roroData.driver.middleName && <li className="govuk-!-font-weight-bold">{roroData.driver.middleName}</li>}
                        {roroData.driver.lastName && <li className="govuk-!-font-weight-bold">{roroData.driver.lastName}</li>}
                        {roroData.driver.dob && <li>DOB: {roroData.driver.dob}</li>}
                        <li>{pluralise.withCount(target.aggregateDriverTrips || '?', '% trip', '% trips')}</li>
                      </>
                    ) : (<li className="govuk-!-font-weight-bold">Unknown</li>)}
                  </ul>
                  <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
                    Passenger details
                  </h3>
                  <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-2">
                    {roroData.passengers && roroData.passengers.length > 0 ? (
                      <>
                        <li className="govuk-!-font-weight-bold">{pluralise.withCount(passengers.length, '% passenger', '% passengers')}</li>
                      </>
                    ) : (<li className="govuk-!-font-weight-bold">None</li>)}
                  </ul>
                </div>
              </div>
              <div className="govuk-grid-item verticel-dotted-line">
                <div>
                  <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
                    Trailer details
                  </h3>
                  <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-2">
                    {roroData.vehicle.trailer ? (
                      <>
                        {roroData.vehicle.trailer.regNumber && <li className="govuk-!-font-weight-bold">{roroData.vehicle.trailer.regNumber}</li>}
                        {roroData.vehicle.trailerType && <li>{roroData.vehicle.trailerType}</li>}
                        <li>{pluralise.withCount(target.aggregateTrailerTrips || 0, '% trip', '% trips')}</li>
                      </>
                    ) : (<li className="govuk-!-font-weight-bold">No trailer</li>)}
                  </ul>
                </div>
              </div>
              <div className="govuk-grid-item verticel-dotted-line">
                <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
                  Haulier details
                </h3>
                <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-2">
                  {roroData.haulier?.name ? (
                    <>
                      {roroData.haulier.name && <li className="govuk-!-font-weight-bold">{roroData.haulier.name}</li>}
                    </>
                  ) : (<li className="govuk-!-font-weight-bold">Unknown</li>)}
                </ul>
                <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
                  Account details
                </h3>
                <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-2">
                  {roroData.account ? (
                    <>
                      {roroData.account.name && <li className="govuk-!-font-weight-bold">{roroData.account.name}</li>}
                      {roroData.bookingDateTime && <li>Booked on {dayjs.utc(roroData.bookingDateTime.split(',')[0]).format(constants.SHORT_DATE_FORMAT)}</li>}
                      {roroData.bookingDateTime && <br />}
                      {roroData.bookingDateTime && <li>{targetDatetimeDifference(roroData.bookingDateTime)}</li>}
                    </>
                  ) : (<li className="govuk-!-font-weight-bold">Unknown</li>)}
                </ul>
              </div>
              <div className="govuk-grid-item verticel-dotted-line">
                <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
                  Goods description
                </h3>
                <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-2">
                  {roroData.load.manifestedLoad ? (
                    <>
                      {roroData.load.manifestedLoad && <li className="govuk-!-font-weight-bold">{roroData.load.manifestedLoad}</li>}
                    </>
                  ) : (<li className="govuk-!-font-weight-bold">Unknown</li>)}
                </ul>
              </div>
            </div>
          </section>
        </>
      )}
      {movementMode === constants.RORO_ACCOMPANIED_FREIGHT.toUpperCase() && (
        <>
          <section className="task-list--item-2">
            <div>
              <div className="govuk-grid-row grid-background--greyed">
                <div className="govuk-grid-column-one-quarter govuk-!-padding-left-8">
                  <i className={`icon-position--left ${movementModeIcon}`} />
                  <p className="govuk-body-s content-line-one govuk-!-margin-bottom-0">{!roroData.vehicle.make ? '\xa0' : roroData.vehicle.make} {roroData.vehicle.model}</p>
                  <p className="govuk-body-s govuk-!-margin-bottom-0 govuk-!-font-weight-bold">{!roroData.vehicle.registrationNumber ? '\xa0' : roroData.vehicle.registrationNumber.toUpperCase()}</p>
                </div>

                <div className="govuk-grid-column-three-quarters govuk-!-padding-right-7 align-right">
                  <i className="c-icon-ship" />
                  <p className="content-line-one">{roroData.vessel.company && `${roroData.vessel.company} voyage of `}{roroData.vessel.name}{', '}arrival {!roroData.eta ? 'unknown' : dayjs.utc(roroData.eta).fromNow()}</p>
                  <p className="govuk-body-s content-line-two">
                    {!roroData.departureTime ? 'unknown' : dayjs.utc(roroData.departureTime).format(constants.LONG_DATE_FORMAT)}{' '}
                    <span className="govuk-!-font-weight-bold">{roroData.departureLocation || 'unknown'}</span>{' '}-{' '}
                    <span className="govuk-!-font-weight-bold">{roroData.arrivalLocation || 'unknown'}</span> {!roroData.eta ? 'unknown'
                      : dayjs.utc(roroData.eta).format(constants.LONG_DATE_FORMAT)}
                  </p>
                </div>
              </div>
            </div>
          </section>
          <section className="task-list--item-3">
            <div className="govuk-grid-row">
              <div className="govuk-grid-item">
                <div>
                  <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
                    Driver details
                  </h3>
                  <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-2">
                    {roroData.driver ? (
                      <>
                        {roroData.driver.firstName && <li className="govuk-!-font-weight-bold">{roroData.driver.firstName}</li>}
                        {roroData.driver.middleName && <li className="govuk-!-font-weight-bold">{roroData.driver.middleName}</li>}
                        {roroData.driver.lastName && <li className="govuk-!-font-weight-bold">{roroData.driver.lastName}</li>}
                        {roroData.driver.dob && <li>DOB: {roroData.driver.dob}</li>}
                        <li>{pluralise.withCount(target.aggregateDriverTrips || '?', '% trip', '% trips')}</li>
                      </>
                    ) : (<li className="govuk-!-font-weight-bold">Unknown</li>)}
                  </ul>
                  <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
                    Passenger details
                  </h3>
                  <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-2">
                    {roroData.passengers && roroData.passengers.length > 0 ? (
                      <>
                        <li className="govuk-!-font-weight-bold">{pluralise.withCount(passengers.length, '% passenger', '% passengers')}</li>
                      </>
                    ) : (<li className="govuk-!-font-weight-bold">None</li>)}
                  </ul>
                </div>
              </div>

              <div className="govuk-grid-item verticel-dotted-line">
                <div>
                  <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
                    Vehicle details
                  </h3>
                  <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-2">
                    {roroData.vehicle ? (
                      <>
                        {roroData.vehicle.registrationNumber && <li className="govuk-!-font-weight-bold">{roroData.vehicle.registrationNumber}</li>}
                        {roroData.vehicle.colour && <li>{roroData.vehicle.colour}</li>}
                        {roroData.vehicle.make && <li>{roroData.vehicle.make}</li>}
                        {roroData.vehicle.model && <li>{roroData.vehicle.model}</li>}
                        <li>{pluralise.withCount(target.aggregateVehicleTrips || 0, '% trip', '% trips')}</li>
                      </>
                    ) : (<li className="govuk-!-font-weight-bold">No vehicle</li>)}
                  </ul>
                  <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
                    Trailer details
                  </h3>
                  <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-2">
                    {roroData.vehicle.trailer ? (
                      <>
                        {roroData.vehicle.trailer.regNumber && <li className="govuk-!-font-weight-bold">{roroData.vehicle.trailer.regNumber}</li>}
                        {roroData.vehicle.trailerType && <li>{roroData.vehicle.trailerType}</li>}
                        <li>{pluralise.withCount(target.aggregateTrailerTrips || 0, '% trip', '% trips')}</li>
                      </>
                    ) : (<li className="govuk-!-font-weight-bold">No trailer</li>)}
                  </ul>
                </div>
              </div>

              <div className="govuk-grid-item verticel-dotted-line">
                <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
                  Haulier details
                </h3>
                <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-2">
                  {roroData.haulier?.name ? (
                    <>
                      {roroData.haulier.name && <li className="govuk-!-font-weight-bold">{roroData.haulier.name}</li>}
                    </>
                  ) : (<li className="govuk-!-font-weight-bold">Unknown</li>)}
                </ul>
                <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
                  Account details
                </h3>
                <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-2">
                  {roroData.account ? (
                    <>
                      {roroData.account.name && <li className="govuk-!-font-weight-bold">{roroData.account.name}</li>}
                      {roroData.bookingDateTime && <li>Booked on {dayjs.utc(roroData.bookingDateTime.split(',')[0]).format(constants.SHORT_DATE_FORMAT)}</li>}
                      {roroData.bookingDateTime && <br />}
                      {roroData.bookingDateTime && <li>{targetDatetimeDifference(roroData.bookingDateTime)}</li>}
                    </>
                  ) : (<li className="govuk-!-font-weight-bold">Unknown</li>)}
                </ul>
              </div>

              <div className="govuk-grid-item verticel-dotted-line">
                <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
                  Goods description
                </h3>
                <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-2">
                  {roroData.load.manifestedLoad ? (
                    <>
                      {roroData.load.manifestedLoad && <li className="govuk-!-font-weight-bold">{roroData.load.manifestedLoad}</li>}
                    </>
                  ) : (<li className="govuk-!-font-weight-bold">Unknown</li>)}
                </ul>
              </div>
            </div>
          </section>
        </>
      )}
      {movementMode === constants.RORO_TOURIST.toUpperCase() && (
        renderRoRoTouristCard(roroData, movementModeIcon)
      )}
    </>
  );
};

export default TaskListModeCard;
