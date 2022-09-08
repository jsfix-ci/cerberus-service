import React from 'react';
import classNames from 'classnames';

// Utils
import { DocumentUtil, PersonUtil } from '../../../../utils';

import renderBlock from '../../helper/common';

const Account = ({ version, classModifiers }) => {
  const person = PersonUtil.get(version);
  const document = DocumentUtil.get(person);
  return (
    <div className={classNames('task-details-container', 'govuk-!-margin-bottom-2', classModifiers)}>
      <h3 className="govuk-heading-m govuk-!-margin-top-0">Document</h3>
      <div className="govuk-task-details-grid-column">
        {renderBlock('Travel document type', [DocumentUtil.docType(document)])}
        {renderBlock('Travel document number', [DocumentUtil.docNumber(document)])}
        {renderBlock('Travel document expiry', [DocumentUtil.docExpiry(document, true)])}
      </div>
    </div>
  );
};

export default Account;
