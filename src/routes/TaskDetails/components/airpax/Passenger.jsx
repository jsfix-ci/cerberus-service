import React from 'react';

import renderBlock from '../../helper/common';
import { JourneyUtil, MovementUtil, PersonUtil } from '../../../../utils';

const Passenger = ({ version }) => {
  const person = PersonUtil.get(version);
  const departureDate = JourneyUtil.departureTime(JourneyUtil.get(version));
  return (
    <div className="task-details-container bottom-border-thin govuk-!-margin-bottom-2">
      <h3 className="govuk-heading-m govuk-!-margin-top-0">{MovementUtil.movementType(version)}</h3>
      <div className="govuk-task-details-grid-column">
        {renderBlock('Name', [`${PersonUtil.lastname(person)}, ${PersonUtil.firstname(person)}`])}
        {renderBlock(undefined, undefined)}
        {renderBlock('Date of birth', [PersonUtil.dob(person)])}
        {renderBlock('Age at travel', [PersonUtil.travelAge(person, departureDate)])}
        {renderBlock('Gender', [PersonUtil.gender(person)])}
        {renderBlock('Nationality', [`${PersonUtil.countryName(person)} (${PersonUtil.nationality(person)})`])}
        {renderBlock('Departure status', [MovementUtil.status(version, true)])}
        {renderBlock(undefined, undefined)}
        {renderBlock('Frequent flyer number', [PersonUtil.frequentFlyerNumber(person)])}
        {renderBlock(undefined, undefined)}
        {renderBlock('SSR codes', [PersonUtil.ssrCodes(person)])}
      </div>
    </div>
  );
};

export default Passenger;
