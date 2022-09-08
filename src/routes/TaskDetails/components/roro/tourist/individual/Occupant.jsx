import React from 'react';
import classNames from 'classnames';

import { DocumentUtil, PersonUtil } from '../../../../../../utils';
import renderBlock from '../../../../helper/common';

const Occupant = ({ person, document, classModifiers }) => {
  return (
    <div className={classNames('govuk-task-details-grid-column', classModifiers)}>
      {renderBlock('Name', [PersonUtil.fullname(person)])}
      {renderBlock('Date of birth', [PersonUtil.dob(person)])}
      {renderBlock('Gender', [PersonUtil.gender(person)])}
      {renderBlock('Nationality', [PersonUtil.nationality(person)])}
      {renderBlock('Travel document type', [DocumentUtil.docType(document)])}
      {renderBlock('Travel document number', [DocumentUtil.docNumber(document)])}
      {renderBlock('Travel document expiry', [DocumentUtil.docExpiry(document, true)])}
    </div>
  );
};

export default Occupant;
