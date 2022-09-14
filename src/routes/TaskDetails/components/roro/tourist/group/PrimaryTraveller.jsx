import React from 'react';
import classNames from 'classnames';

import renderBlock from '../../../../helper/common';
import { CommonUtil, PersonUtil } from '../../../../../../utils';

const PrimaryTraveller = ({ version, classModifiers }) => {
  const person = PersonUtil.get(version);
  return (
    <div className={classNames('task-details-container', 'govuk-!-margin-bottom-2', classModifiers)}>
      <h3 className="govuk-heading-m govuk-!-margin-top-0">Primary traveller</h3>
      <div className="govuk-task-details-grid-column">
        {renderBlock('Name', [{
          content: PersonUtil.fullname(person),
          entitySearchURL: CommonUtil.entitySearchURL(person),
        }])}
        {renderBlock('Date of birth', [PersonUtil.dob(person)])}
        {renderBlock('Gender', [PersonUtil.gender(person)])}
        {renderBlock('Nationality', [PersonUtil.nationality(person)])}
      </div>
    </div>
  );
};

export default PrimaryTraveller;
