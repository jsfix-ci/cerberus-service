import React from 'react';
import * as pluralise from 'pluralise';
import Table from '../../../../components/Table';

import { CO_TRAVELLERS_TABLE_HEADERS } from '../../../../constants';

import { PersonUtil, MovementUtil, DocumentUtil } from '../../utils';
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

const toDocumentColumnContent = (person) => {
  const document = DocumentUtil.get(person);
  return (
    <>
      <div className="font__bold">{DocumentUtil.docType(document)}</div>
      <div className="font__light">{DocumentUtil.docNumber(document)}</div>
      <div className="font__light">Issued by {DocumentUtil.docCountryCode(document)}</div>
    </>
  );
};

const toRows = (allPersons, version) => {
  const rows = [];
  allPersons.map((person) => {
    rows.push([
      toTravellerColumnContent(person, version),
      toAgeColumnContent(person),
      toDocumentColumnContent(person),
    ]);
  });
  return rows;
};

const CoTraveller = ({ version }) => {
  const coTravellers = PersonUtil.getOthers(version);
  if (!coTravellers) {
    return null;
  }
  return (
    <div className="co-travellers-container font__bold govuk-!-padding-top-2 govuk-!-margin-bottom-4">
      <h3 className="govuk-heading-m govuk-!-margin-bottom-0">
        {pluralise.withCount(PersonUtil.othersCount(version), '% Co-traveller', '% Co-travellers', undefined)}
      </h3>
      <Table
        className="co-travellers-table"
        headings={CO_TRAVELLERS_TABLE_HEADERS}
        rows={toRows(coTravellers, version)}
      />
    </div>
  );
};

export default CoTraveller;
