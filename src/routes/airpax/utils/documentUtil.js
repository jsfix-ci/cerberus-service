import moment from 'moment';
import lookup from 'country-code-lookup';
import {
  A_TITLE_CASE_TEXT,
  AN_TITLE_CASE_TEXT,
  AGO_TEXT,
  A_SMALL_TEXT,
  AN_SMALL_TEXT,
  UNKNOWN_TEXT,
  AFTER_TRAVEL_TEXT,
  BEFORE_TRAVEL_TEXT,
  SHORT_DATE_FORMAT_ALT,
} from '../../../constants';
import { formatField } from '../../../utils/formatField';
import { getFormattedDate } from './datetimeUtil';

const calculateExpiry = (passportExpiry, arrivalTime) => {
  const expiry = arrivalTime
    && passportExpiry !== 'Unknown'
    && `${arrivalTime},${moment(passportExpiry).format('YYYY-MM-DDTHH:mm:ss')}`;
  if (expiry) {
    return formatField('BOOKING_DATETIME', expiry)
      .split(', ')[1]
      .replace(BEFORE_TRAVEL_TEXT, AFTER_TRAVEL_TEXT)
      .replace(AGO_TEXT, BEFORE_TRAVEL_TEXT)
      .replace(A_SMALL_TEXT, A_TITLE_CASE_TEXT)
      .replace(AN_SMALL_TEXT, AN_TITLE_CASE_TEXT);
  }
  return UNKNOWN_TEXT;
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

const getDocumentExpiry = (document, taskDetails = false) => {
  const expiryPrefix = 'Expires';
  if (!document?.expiry) {
    return taskDetails ? UNKNOWN_TEXT : `${expiryPrefix} ${UNKNOWN_TEXT}`;
  }
  return taskDetails ? `${getFormattedDate(document?.expiry, SHORT_DATE_FORMAT_ALT)}` : `${expiryPrefix} ${getFormattedDate(document?.expiry, SHORT_DATE_FORMAT_ALT)}`;
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
      ? `${lookup.byIso(document.countryOfIssue).country} (${document.countryOfIssue})`
      : `${countryOfIssuePrefix} ${UNKNOWN_TEXT}`;
  }

  return lookup.byIso(document.countryOfIssue) !== null
    ? `${countryOfIssuePrefix} ${document.countryOfIssue}`
    : `${countryOfIssuePrefix} ${UNKNOWN_TEXT}`;
};

const getDocumentCountryOfIssueCode = (document) => {
  if (!document?.countryOfIssue) {
    return UNKNOWN_TEXT;
  }
  return document.countryOfIssue;
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
  docValidity: getDocumentValidity,
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
  getDocumentValidity,
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
