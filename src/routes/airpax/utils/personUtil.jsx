import React from 'react';
import lookup from 'country-code-lookup';
import dayjs from 'dayjs';
import formatGender from '../../../utils/genderFormatter';
import Common from './common';
import { getFormattedDate } from './datetimeUtil';
import { SHORT_DATE_FORMAT_ALT, UNKNOWN_TEXT } from '../../../constants';

const getNationality = (person) => {
  if (!person?.nationality) {
    return UNKNOWN_TEXT;
  }
  return Common.iso3Code(person.nationality);
};

const getCountryName = (person) => {
  if (!person?.nationality) {
    return UNKNOWN_TEXT;
  }
  return lookup.byIso(person.nationality).country;
};

const getDateOfBirth = (person, format = SHORT_DATE_FORMAT_ALT) => {
  if (!person?.dateOfBirth) {
    return UNKNOWN_TEXT;
  }
  return getFormattedDate(person.dateOfBirth, format);
};

const getAge = (person) => {
  if (!person?.dateOfBirth) {
    return UNKNOWN_TEXT;
  }
  return dayjs.utc().diff(dayjs(person.dateOfBirth), 'year');
};

const getTravelAge = (person, departureDate) => {
  const dateFormat = 'YYYY-MM-DD';
  const dateOfBirth = getDateOfBirth(person, dateFormat);
  if (!dateOfBirth || dateOfBirth === UNKNOWN_TEXT) {
    return UNKNOWN_TEXT;
  }
  if (!departureDate) {
    return UNKNOWN_TEXT;
  }
  const formattedDob = dayjs(dayjs(dateOfBirth));
  const formattedDepartureDate = dayjs(dayjs(departureDate).format(dateFormat));
  return formattedDepartureDate.diff(formattedDob, 'year');
};

const getGender = (person) => {
  if (!person) {
    return UNKNOWN_TEXT;
  }
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

const getFrequentFlyerNumber = (person) => {
  if (!person?.frequentFlyerNumber) {
    return UNKNOWN_TEXT;
  }
  return person.frequentFlyerNumber;
};

const hasSSRCodes = (person) => {
  return !!person?.ssrCodes?.length > 0;
};

const getSSRCodes = (person) => {
  if (!hasSSRCodes(person)) {
    return UNKNOWN_TEXT;
  }
  return person.ssrCodes.join(', ');
};

const toCoTravellers = (otherPersons) => {
  if (!otherPersons) {
    return <li className="govuk-!-font-weight-bold">None</li>;
  }
  const maxToDisplay = 4;
  const remaining = otherPersons.length > maxToDisplay ? otherPersons.length - maxToDisplay : 0;
  return otherPersons.map((person, index) => {
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
};

const getAllPersons = (person, otherPersons) => {
  let allPersons = [];
  if (person) {
    allPersons.push(person);
  }
  if (otherPersons) {
    allPersons = allPersons.concat(otherPersons);
  }
  return allPersons;
};

const getTotalNumberOfPersons = (targetTask) => {
  return targetTask?.movement?.groupSize || 0;
};

const getTotalNumberOfOtherPersons = (targetTask) => {
  return targetTask?.movement?.otherPersons?.length || 0;
};

const hasOtherPersons = (targetTask) => {
  return !!targetTask?.movement?.otherPersons?.length;
};

const getOtherPersons = (targetTask) => {
  if (hasOtherPersons(targetTask)) {
    return targetTask.movement.otherPersons;
  }
  return null;
};

const hasPerson = (targetTask) => {
  return !!targetTask?.movement?.person;
};

const getPerson = (targetTask) => {
  if (hasPerson(targetTask)) {
    return targetTask.movement.person;
  }
  return null;
};

const PersonUtil = {
  get: getPerson,
  getOthers: getOtherPersons,
  totalPersons: getTotalNumberOfPersons,
  othersCount: getTotalNumberOfOtherPersons,
  toOthers: toCoTravellers,
  allPersons: getAllPersons,
  firstname: getFirstName,
  lastname: getLastName,
  gender: getGender,
  dob: getDateOfBirth,
  age: getAge,
  travelAge: getTravelAge,
  nationality: getNationality,
  countryName: getCountryName,
  frequentFlyerNumber: getFrequentFlyerNumber,
  ssrCodes: getSSRCodes,
};

export default PersonUtil;

export {
  getNationality,
  getCountryName,
  getDateOfBirth,
  getAge,
  getPerson,
  getGender,
  getFirstName,
  getLastName,
  toCoTravellers,
  getTotalNumberOfPersons,
  getTotalNumberOfOtherPersons,
  getOtherPersons,
  getFrequentFlyerNumber,
  getSSRCodes,
  getTravelAge,
};
