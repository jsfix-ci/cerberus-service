import React from 'react';

import Occupant from './Occupant';
import OccupantCount from './OccupantCount';

import { DocumentUtil, MovementUtil, PersonUtil } from '../../../../utils';

const Occupants = ({ version }) => {
  const mode = MovementUtil.movementMode(version);
  const journey = MovementUtil.movementJourney(version);
  const departureTime = MovementUtil.departureTime(journey);
  const otherPersons = PersonUtil.getOthers(version);
  const primaryTraveller = PersonUtil.get(version);
  const secondaryCoTraveller = otherPersons[0] || undefined;
  const tertiaryCoTravellers = otherPersons?.slice(1, otherPersons.length);
  const occupantCounts = MovementUtil.occupantCounts(version);

  return (
    <div className="task-details-container govuk-!-margin-bottom-2">
      <h3 className="govuk-heading-m govuk-!-margin-top-0">Occupant</h3>
      <OccupantCount
        mode={mode}
        primaryTraveller={primaryTraveller}
        coTravellers={otherPersons}
        occupantCounts={occupantCounts}
      />
      <Occupant
        person={primaryTraveller}
        document={DocumentUtil.get(primaryTraveller)}
        departureTime={departureTime}
        classModifiers={secondaryCoTraveller ? ['bottom-border-thin'] : []}
        labelText="Driver"
      />

      {secondaryCoTraveller ? (
        <Occupant
          person={secondaryCoTraveller}
          document={DocumentUtil.get(secondaryCoTraveller)}
          departureTime={departureTime}
          classModifiers={tertiaryCoTravellers?.length
            ? ['govuk-!-padding-top-2', 'bottom-border-thin'] : ['govuk-!-padding-top-2']}
          labelText="Occupant"
        />
      ) : null}

      {tertiaryCoTravellers?.length ? (
        <details className="govuk-details govuk-!-padding-top-2" data-module="govuk-details">
          <summary className="govuk-details__summary">
            <span className="govuk-details__summary-text">Show more</span>
          </summary>
          <div className="govuk-hidden-passengers">
            {tertiaryCoTravellers.map((_person, index) => {
              return (
                <Occupant
                  key={_person?.id}
                  person={_person}
                  document={DocumentUtil.get(_person)}
                  departureTime={departureTime}
                  classModifiers={index !== tertiaryCoTravellers.length - 1
                    ? ['govuk-!-padding-top-2', 'bottom-border-thin'] : ['govuk-!-padding-top-2']}
                  labelText="Occupant"
                />
              );
            })}
          </div>
        </details>
      ) : null}
    </div>
  );
};

export default Occupants;
