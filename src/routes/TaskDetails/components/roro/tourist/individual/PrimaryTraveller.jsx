import React from 'react';
import classNames from 'classnames';

import renderBlock from '../../../../helper/common';
import { DocumentUtil, PersonUtil } from '../../../../../../utils';

const PrimaryTraveller = ({ version, classModifiers }) => {
  const person = PersonUtil.get(version);
  const document = DocumentUtil.get(person);
  return (
    <div className={classNames('task-details-container', 'govuk-!-margin-bottom-2', classModifiers)}>
      <h3 className="govuk-heading-m govuk-!-margin-top-0">Primary traveller</h3>
      <div className="govuk-task-details-grid-column">
        {renderBlock('Name', [PersonUtil.fullname(person)])}
        {renderBlock('Date of birth', [PersonUtil.dob(person)])}
        {renderBlock('Gender', [PersonUtil.gender(person)])}
        {renderBlock('Nationality', [PersonUtil.nationality(person)])}
        {renderBlock('Travel document type', [DocumentUtil.docType(document)])}
        {renderBlock('Travel document number', [DocumentUtil.docNumber(document)])}
        {renderBlock('Travel document expiry', [DocumentUtil.docExpiry(document, true)])}
      </div>
    </div>
  );
};

export default PrimaryTraveller;
