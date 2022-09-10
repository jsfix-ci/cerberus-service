import React from 'react';
import classNames from 'classnames';

import { CommonUtil, DocumentUtil, PersonUtil } from '../../../../utils';
import renderBlock from '../../helper/common';

const Occupant = ({ person, document, departureTime, labelText, classModifiers }) => {
  return (
    <div className={classNames('govuk-task-details-grid-column', classModifiers)}>
      {renderBlock(labelText, [{
        content: PersonUtil.fullname(person),
        entitySearchURL: CommonUtil.entitySearchURL(person),
      },
      `${PersonUtil.gender(person)}, born ${PersonUtil.dob(person)}, ${PersonUtil.nationality(person)}`])}
      {renderBlock(undefined, undefined)}
      {renderBlock('Passport', [DocumentUtil.docNumber(document), DocumentUtil.docCountry(document, true)])}
      {renderBlock('Validity', [DocumentUtil.docExpiry(document, false),
        DocumentUtil.calculateExpiry(DocumentUtil.docExpiryDate(document), departureTime)])}
    </div>
  );
};

export default Occupant;
