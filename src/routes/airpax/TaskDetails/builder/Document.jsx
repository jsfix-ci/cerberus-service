import React from 'react';
// Utils
import { getDate } from '../../utils/datetimeUtil';
import { getJourney, getArrivalTime } from '../../utils/movementUtil';

import {
  DocumentUtil,
  PersonUtil,
} from '../../utils';

import renderBlock from './helper/common';

const Document = ({ version }) => {
  const person = PersonUtil.get(version);
  const document = DocumentUtil.get(version.movement.person);
  const journey = getJourney(version);
  const validFromExpiry = document ? DocumentUtil.calculateExpiry(document.validFrom, getDate()) : 'Unknown';
  const validToExpiry = document ? DocumentUtil.calculateExpiry(document.expiry, getArrivalTime(journey)) : 'Unknown';

  return (
    <div className="task-details-container">
      <h3 className="govuk-heading-m govuk-!-margin-top-0">Document</h3>
      <div className="govuk-task-details-grid-column">
        {renderBlock('Type', [DocumentUtil.docType(document)])}
        {renderBlock('Number', [DocumentUtil.docNumber(document)])}
        {renderBlock('Document nationality', [DocumentUtil.docNationality(document, true)])}
        {renderBlock('Country of issue', [DocumentUtil.docCountry(document, true)])}
        {renderBlock('Valid from', [DocumentUtil.docValidity(document, true), validFromExpiry])}
        {renderBlock('Valid To', [DocumentUtil.docExpiry(document, true), validToExpiry])}
        {renderBlock('Name', [DocumentUtil.docName(person)])}
        {renderBlock('Date of birth', [PersonUtil.dob(person)])}
      </div>
    </div>
  );
};

export default Document;
