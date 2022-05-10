import React from 'react';
import * as pluralise from 'pluralise';
import { Link } from '@ukhomeoffice/cop-react-components';
import Table from '../../../../components/Table';

import { CO_TRAVELLERS_TABLE_HEADERS,
  LONG_DATE_FORMAT, DAYJS_FUTURE,
  DAYJS_FUTURE_AIXPAX_REPLACE,
  UNKNOWN_TEXT } from '../../../../constants';

import { PersonUtil, MovementUtil, BookingUtil, DateTimeUtil, DocumentUtil, BaggageUtil } from '../../utils';
import calculateTimeDifference from '../../../../utils/calculateDatetimeDifference';
import '../../../../components/__assets__/Table.scss';

const toTravellerColumnContent = (person, version) => {
  return (
    <>
      <div className="font__bold">
        {PersonUtil.lastname(person)}, {PersonUtil.firstname(person)} {MovementUtil.status(version)}
      </div>
      <div className="font__light">
        {PersonUtil.gender(person)}, {PersonUtil.dob(person)},&nbsp;
        {PersonUtil.countryName(person)} ({PersonUtil.nationality(person)})
      </div>
    </>
  );
};

const toAgeColumnContent = (person) => {
  return (
    <div className="font__bold">{PersonUtil.age(person)}</div>
  );
};

const toCheckinColumnContent = (version) => {
  const booking = BookingUtil.get(version);
  const journey = MovementUtil.movementJourney(version);
  const checkInAt = BookingUtil.checkInAt(booking);
  const departureTime = MovementUtil.departureTime(journey);
  return (
    <>
      <div className="font__bold">{DateTimeUtil.format(checkInAt, LONG_DATE_FORMAT)}</div>
      <div className="font__light">
        {calculateTimeDifference(DateTimeUtil.toList(checkInAt, departureTime)).replace(
          DAYJS_FUTURE,
          DAYJS_FUTURE_AIXPAX_REPLACE,
        )}
      </div>
    </>
  );
};

const toSeatColumnContent = (version) => {
  const seatNumber = MovementUtil.seatNumber(MovementUtil.movementFlight(version), true);
  return (
    <div className="font__bold">{seatNumber}</div>
  );
};

const toDocumentColumnContent = (person) => {
  const document = DocumentUtil.get(person);
  return (
    <>
      <div className="font__bold">{DocumentUtil.docType(document)}</div>
      <div className="font__light">Issued by {DocumentUtil.docCountryCode(document)}</div>
    </>
  );
};

const toBaggageColumnContent = (version) => {
  const baggage = BaggageUtil.get(version);
  const checkedBags = BaggageUtil.formatCheckedCount(baggage);
  const checkedWeight = BaggageUtil.weight(baggage);
  return (
    <>
      <div className="font__bold">
        {(checkedBags !== UNKNOWN_TEXT && checkedWeight !== UNKNOWN_TEXT)
          ? (BaggageUtil.formatCheckedCount(baggage), BaggageUtil.weight(baggage)) : UNKNOWN_TEXT}
      </div>
    </>
  );
};

// Update this once we start receiving data
const toMovementDetailsColumnContent = (index) => {
  return (
    <>
      {index === 0 && <div className="font__light">This movement</div>}
      {index !== 0 && <Link href="/" target="_blank">Movement detail</Link>}
    </>
  );
};

const toRows = (allPersons, version) => {
  const rows = [];
  allPersons.map((person, index) => {
    rows.push([
      toTravellerColumnContent(person, version),
      toAgeColumnContent(person),
      toCheckinColumnContent(version),
      toSeatColumnContent(version),
      toDocumentColumnContent(person),
      toBaggageColumnContent(version),
      toMovementDetailsColumnContent(index),
    ]);
  });
  return rows;
};

const CoTraveller = ({ version }) => {
  const allPersons = PersonUtil.allPersons(PersonUtil.get(version), PersonUtil.getOthers(version));
  return (
    <div className="font__bold">
      <h3 className="title-heading govuk-!-margin-top-0 govuk-!-margin-bottom-0">
        {pluralise.withCount(PersonUtil.totalPersons(version), '% traveller', '% travellers', undefined)}
      </h3>
      <Table
        className="co-travellers-table"
        headings={CO_TRAVELLERS_TABLE_HEADERS}
        rows={toRows(allPersons, version)}
      />
    </div>
  );
};

export default CoTraveller;
