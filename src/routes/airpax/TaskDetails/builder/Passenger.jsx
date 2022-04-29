import React from 'react';
import MovementUtils from '../../utils/movementUtil';
import PersonUtils from '../../utils/personUtil';

const renderField = (displayName, value) => {
  return (
    <div>
      <ul>
        <li className="govuk-grid-key font__light">
          <span className="govuk-grid-key font__light">{displayName}</span>
        </li>
        <li className="govuk-grid-value font__bold">
          {value}
        </li>
      </ul>
    </div>
  );
};

const Passenger = ({ version }) => {
  const person = PersonUtils.get(version);

  return (
    <div className="task-details-container bottom-border-thick">
      <h3 className="title-heading">Passenger</h3>
      <div className="govuk-task-details-grid-column">
        {renderField('Name', `${PersonUtils.lastname(person)}, ${PersonUtils.firstname(person)}`)}
        {renderField('Date of birth', PersonUtils.dob(person))}
        {renderField('Nationality', `${PersonUtils.countryName(person)} (${PersonUtils.nationality(person)})`)}
        {renderField('Age at travel', PersonUtils.age(person))}
        {renderField('Gender', PersonUtils.gender(person))}
        {renderField('Departure status', MovementUtils.status(version, true))}
        {renderField('Frequent flyer number', PersonUtils.frequentFlyerNumber(person))}
        {renderField('SSR codes', PersonUtils.ssrCodes(person))}
      </div>
    </div>
  );
};

export default Passenger;
