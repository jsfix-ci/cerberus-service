import React from 'react';
import * as pluralise from 'pluralise';

import PersonUtil from '../../utils/personUtil';

const CoTraveller = ({ version }) => {
  const coTravllers = PersonUtil.getOthers(version);
  return (
    <>
      <h3 className="title-heading">{pluralise.withCount(PersonUtil.totalPersons(version), '% traveller', '% travellers', undefined)}</h3>
      <div className="govuk-!-margin-bottom-2">
        This is a long line of text, This is a long line of text, This is a long line of text, This is a long line of text.
      </div>
    </>
  );
};

export default CoTraveller;
