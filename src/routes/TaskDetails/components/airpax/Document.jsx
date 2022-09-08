import React from 'react';
// Utils
import { getDate } from '../../../../utils/Datetime/datetimeUtil';
import { getJourney, getArrivalTime } from '../../../../utils/Movement/movementUtil';

import {
  DocumentUtil,
  PersonUtil,
} from '../../../../utils';

import renderBlock from '../../helper/common';

const Document = ({ version }) => {
  const person = PersonUtil.get(version);
  const document = DocumentUtil.get(person);
  const journey = getJourney(version);

  return (
    <div className="task-details-container bottom-border-thin govuk-!-margin-bottom-2">
      <h3 className="govuk-heading-m govuk-!-margin-top-0">Document</h3>
      <div className="govuk-task-details-grid-column">
        {renderBlock('Type', [DocumentUtil.docType(document)])}
        {renderBlock('Number', [DocumentUtil.docNumber(document)])}
        {renderBlock('Document nationality', [DocumentUtil.docNationality(document, true)])}
        {renderBlock('Country of issue', [DocumentUtil.docCountry(document, true)])}
        {renderBlock('Valid from', [DocumentUtil.docValidity(document, true),
          DocumentUtil.calculateExpiry(DocumentUtil.docValidityDate(document), getDate())])}
        {renderBlock('Valid To', [DocumentUtil.docExpiry(document, true),
          DocumentUtil.calculateExpiry(DocumentUtil.docExpiryDate(document), getArrivalTime(journey))])}
        {renderBlock('Name', [DocumentUtil.docName(person)])}
        {renderBlock('Date of birth', [PersonUtil.dob(person)])}
      </div>
    </div>
  );
};

export default Document;
