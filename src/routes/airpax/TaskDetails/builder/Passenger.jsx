import React from 'react';
import renderBlock from './helper/common';
import MovementUtils from '../../utils/movementUtil';
import PersonUtils from '../../utils/personUtil';

const Passenger = ({ version }) => {
  const person = PersonUtils.get(version);
  return (
    <div className="task-details-container bottom-border-thin govuk-!-margin-bottom-2">
      <h3 className="govuk-heading-m govuk-!-margin-top-0">Passenger</h3>
      <div className="govuk-task-details-grid-column">
        {renderBlock('Name', [`${PersonUtils.lastname(person)}, ${PersonUtils.firstname(person)}`])}
        {renderBlock(undefined, undefined)}
        {renderBlock('Date of birth', [PersonUtils.dob(person)])}
        {renderBlock('Age at travel', [PersonUtils.age(person)])}
        {renderBlock('Gender', [PersonUtils.gender(person)])}
        {renderBlock('Nationality', [`${PersonUtils.countryName(person)} (${PersonUtils.nationality(person)})`])}
        {renderBlock('Departure status', [MovementUtils.status(version, true)])}
        {renderBlock(undefined, undefined)}
        {renderBlock('Frequent flyer number', [PersonUtils.frequentFlyerNumber(person)])}
        {renderBlock(undefined, undefined)}
        {renderBlock('SSR codes', [PersonUtils.ssrCodes(person)])}
      </div>
    </div>
  );
};

export default Passenger;
