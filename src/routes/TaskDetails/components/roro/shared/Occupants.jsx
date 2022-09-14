import _ from 'lodash';
import React from 'react';
import classNames from 'classnames';

import Occupant from './Occupant';
import OccupantCount from './OccupantCount';

import { MOVEMENT_ROLE } from '../../../../../utils/constants';

import { DocumentUtil, JourneyUtil, MovementUtil, PersonUtil } from '../../../../../utils';

const Occupants = ({ version, classModifiers }) => {
  const mode = MovementUtil.movementMode(version);
  const journey = JourneyUtil.get(version);
  const departureTime = JourneyUtil.departureTime(journey);
  const allPersons = PersonUtil.allPersons(version);
  const primaryTraveller = PersonUtil.findByRole(allPersons, MOVEMENT_ROLE.DRIVER);
  const otherPersons = allPersons.filter((person) => !_.isEqual(person, primaryTraveller));
  const secondaryCoTraveller = otherPersons[0] || undefined;
  const tertiaryCoTravellers = otherPersons?.slice(1, otherPersons.length);
  const occupantCounts = MovementUtil.occupantCounts(version);

  return (
    <div className={classNames('task-details-container', classModifiers)}>
      <h3 className="govuk-heading-m govuk-!-margin-top-0">Occupants</h3>
      <OccupantCount
        mode={mode}
        primaryTraveller={primaryTraveller}
        coTravellers={otherPersons}
        occupantCounts={occupantCounts}
        classModifiers={primaryTraveller ? ['govuk-!-padding-bottom-1'] : []}
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
            ? ['govuk-!-padding-top-4', 'bottom-border-thin'] : ['govuk-!-padding-top-4']}
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
                    ? ['govuk-!-padding-top-4', 'bottom-border-thin'] : ['govuk-!-padding-top-4']}
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
