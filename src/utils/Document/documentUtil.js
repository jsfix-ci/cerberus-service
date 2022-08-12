import moment from 'moment';
import lookup from 'country-code-lookup';
import {
  A_TITLE_CASE_TEXT,
  AN_TITLE_CASE_TEXT,
  AGO_TEXT,
  A_SMALL_TEXT,
  AN_SMALL_TEXT,
  AFTER_TRAVEL_TEXT,
  BEFORE_TRAVEL_TEXT,
  SHORT_DATE_FORMAT_ALT,
  UNKNOWN_TEXT,
  UTC_DATE_FORMAT,
} from '../constants';
import { formatField } from '../FieldFormat/fieldFormatterUtil';
import Common from '../Common/common';
import { getFormattedDate, validateDate } from '../Datetime/datetimeUtil';

const calculateExpiry = (passportExpiry, arrivalTime) => {
  if (!validateDate(passportExpiry) || !validateDate(arrivalTime)) {
    return UNKNOWN_TEXT;
  }
  const expiry = `${arrivalTime},${moment(passportExpiry).format(UTC_DATE_FORMAT)}`;
  return formatField('BOOKING_DATETIME', expiry)
    .split(', ')[1]
    .replace(BEFORE_TRAVEL_TEXT, AFTER_TRAVEL_TEXT)
    .replace(AGO_TEXT, BEFORE_TRAVEL_TEXT)
    .replace(A_SMALL_TEXT, A_TITLE_CASE_TEXT)
    .replace(AN_SMALL_TEXT, AN_TITLE_CASE_TEXT);
};

const hasDocument = (person) => {
  return !!person?.document;
};

const getDocument = (person) => {
  if (hasDocument(person)) {
    return person.document;
  }
  return null;
};

const getDocumentExpiryDate = (document) => {
  return document?.expiry || undefined;
};

const getDocumentExpiry = (document, taskDetails = false) => {
  const expiryPrefix = 'Expires';
  if (!document?.expiry) {
    return taskDetails ? UNKNOWN_TEXT : `${expiryPrefix} ${UNKNOWN_TEXT}`;
  }
  return taskDetails ? `${getFormattedDate(document?.expiry, SHORT_DATE_FORMAT_ALT)}` : `${expiryPrefix} ${getFormattedDate(document?.expiry, SHORT_DATE_FORMAT_ALT)}`;
};

const getDocumentValidityDate = (document) => {
  return document?.validFrom || undefined;
};

const getDocumentValidity = (document, taskDetails = false) => {
  const validityPrefix = 'Valid from';
  if (!document?.validFrom) {
    return taskDetails ? UNKNOWN_TEXT : `${validityPrefix} ${UNKNOWN_TEXT}`;
  }
  return taskDetails ? `${getFormattedDate(document?.validFrom, SHORT_DATE_FORMAT_ALT)}` : `${validityPrefix} ${getFormattedDate(document?.validFrom, SHORT_DATE_FORMAT_ALT)}`;
};

const getDocumentType = (document) => {
  if (!document?.type) {
    return UNKNOWN_TEXT;
  }
  return document.type;
};

const getDocumentNumber = (document) => {
  if (!document?.number) {
    return UNKNOWN_TEXT;
  }
  return document.number;
};

const getDocumentName = (person) => {
  if (!person?.name) {
    return UNKNOWN_TEXT;
  }
  const firstNames = person?.name?.first || UNKNOWN_TEXT;
  const lastName = person?.name?.last || UNKNOWN_TEXT;
  return `${lastName.toUpperCase()}, ${firstNames}`;
};

// TODO finish implementation once data flows through
const getDocumentIdentification = (document) => {
  if (!document) {
    return UNKNOWN_TEXT;
  }
  return UNKNOWN_TEXT;
};

const getDocumentCountryOfIssue = (document, taskDetails = false) => {
  const countryOfIssuePrefix = 'Issued by';
  if (!document?.countryOfIssue) {
    return taskDetails ? UNKNOWN_TEXT : `${countryOfIssuePrefix} ${UNKNOWN_TEXT}`;
  }
  if (taskDetails) {
    return lookup.byIso(document.countryOfIssue) !== null
      ? `${lookup.byIso(document.countryOfIssue).country} (${Common.iso3Code(document.countryOfIssue)})`
      : `${countryOfIssuePrefix} ${UNKNOWN_TEXT}`;
  }

  return lookup.byIso(document.countryOfIssue) !== null
    ? `${countryOfIssuePrefix} ${Common.iso3Code(document.countryOfIssue)}`
    : `${countryOfIssuePrefix} ${UNKNOWN_TEXT}`;
};

const getDocumentCountryOfIssueCode = (document) => {
  if (!document?.countryOfIssue) {
    return UNKNOWN_TEXT;
  }
  return Common.iso3Code(document.countryOfIssue);
};

const getDocumentNationality = (document, taskDetails = false) => {
  return getDocumentCountryOfIssue(document, taskDetails);
};

const getDocumentDOB = (document) => {
  if (!document?.dateOfBirth) {
    return UNKNOWN_TEXT;
  }
  return getFormattedDate(document?.dateOfBirth, SHORT_DATE_FORMAT_ALT);
};

const DocumentUtil = {
  get: getDocument,
  docExpiry: getDocumentExpiry,
  docExpiryDate: getDocumentExpiryDate,
  docValidity: getDocumentValidity,
  docValidityDate: getDocumentValidityDate,
  docType: getDocumentType,
  docNumber: getDocumentNumber,
  docName: getDocumentName,
  docIdentification: getDocumentIdentification,
  docCountry: getDocumentCountryOfIssue,
  docCountryCode: getDocumentCountryOfIssueCode,
  docNationality: getDocumentNationality,
  docDOB: getDocumentDOB,
  calculateExpiry,
};

export default DocumentUtil;

export {
  getDocument,
  getDocumentExpiry,
  getDocumentExpiryDate,
  getDocumentValidity,
  getDocumentValidityDate,
  getDocumentType,
  getDocumentNumber,
  getDocumentName,
  getDocumentIdentification,
  getDocumentCountryOfIssue,
  getDocumentCountryOfIssueCode,
  getDocumentNationality,
  getDocumentDOB,
  calculateExpiry,
};
