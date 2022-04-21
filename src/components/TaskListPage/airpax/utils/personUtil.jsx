import React from 'react';

import formatGender from '../../../../utils/genderFormatter';
import { getFormattedDate } from './datetimeUtil';

import { SHORT_DATE_FORMAT_ALT, UNKNOWN_TEXT } from '../../../../constants';

const getNationality = (person) => {
  if (!person?.nationality) {
    return UNKNOWN_TEXT;
  }
  return person.nationality;
};

const getDateOfBirth = (person) => {
  if (!person?.dateOfBirth) {
    return UNKNOWN_TEXT;
  }
  return getFormattedDate(person.dateOfBirth, SHORT_DATE_FORMAT_ALT);
};

const getGender = (person) => {
  return formatGender(person.gender);
};

const getLastName = (person, capitalize = true) => {
  if (!person?.name?.last) {
    return capitalize ? UNKNOWN_TEXT.toUpperCase() : UNKNOWN_TEXT;
  }
  return capitalize ? person.name.last.toUpperCase() : person.name.last;
};

const getFirstName = (person) => {
  if (!person?.name?.first) {
    return UNKNOWN_TEXT;
  }
  return person.name.first;
};

const toCoTravellers = (otherPersons) => {
  if (!otherPersons) {
    return <li className="govuk-!-font-weight-bold">None</li>;
  }
  const maxToDisplay = 4;
  const remaining = otherPersons.length > maxToDisplay ? otherPersons.length - maxToDisplay : 0;
  const coTravellersJsx = otherPersons.map((person, index) => {
    if (index < maxToDisplay) {
      return (
        <li key={index} className="govuk-!-font-weight-bold">
          {getLastName(person)}, {getFirstName(person)}{(index !== maxToDisplay - 1)
                && (index !== otherPersons.length - 1) ? ',' : ''} {(remaining > 0 && index + 1 === maxToDisplay)
                  ? ` plus ${remaining} more` : ''}
        </li>
      );
    }
  });
  return (
    <>
      {coTravellersJsx}
    </>
  );
};

const getTotalNumberOfPersons = (targetTask) => {
  if (!targetTask?.movement?.person) {
    return 0;
  }
  // Should the code above not run, count is defaulted to 1 as we can assume there at least someone in the movement.
  let personsCount = 1;
  personsCount += targetTask.movement.otherPersons.length;
  return personsCount;
};

const hasOtherPersons = (targetTask) => {
  return !!targetTask?.movement?.otherPersons.length;
};

const getOtherPersons = (targetTask) => {
  return targetTask.movement.otherPersons;
};

const getPerson = (targetTask) => {
  return targetTask.movement.person;
};

const hasPerson = (targetTask) => {
  return !!targetTask?.movement?.person;
};

const PersonUtil = {
  get: getPerson,
  has: hasPerson,
  getOthers: getOtherPersons,
  hasOthers: hasOtherPersons,
  totalPersons: getTotalNumberOfPersons,
  toOthers: toCoTravellers,
  firstname: getFirstName,
  lastname: getLastName,
  gender: getGender,
  dob: getDateOfBirth,
  nationality: getNationality,
};

export default PersonUtil;

export { getNationality, getDateOfBirth, getPerson, hasPerson, getGender, getFirstName, getLastName,
  toCoTravellers, getTotalNumberOfPersons, hasOtherPersons, getOtherPersons };
