import moment from 'moment';
import lookup from 'country-code-lookup';
import {
  DATE_FORMATS,
  STRINGS,
} from '../constants';
import { formatField } from '../FieldFormat/fieldFormatterUtil';
import CommonUtil from '../Common/commonUtil';
import { getFormattedDate, validateDate } from '../Datetime/datetimeUtil';

const calculateExpiry = (passportExpiry, arrivalTime) => {
  if (!validateDate(passportExpiry) || !validateDate(arrivalTime)) {
    return STRINGS.UNKNOWN_TEXT;
  }
  const expiry = `${arrivalTime},${moment(passportExpiry).format(DATE_FORMATS.UTC)}`;
  return formatField('BOOKING_DATETIME', expiry)
    .split(', ')[1]
    .replace(STRINGS.BEFORE_TRAVEL_TEXT, STRINGS.AFTER_TRAVEL_TEXT)
    .replace(STRINGS.AGO_TEXT, STRINGS.BEFORE_TRAVEL_TEXT)
    .replace(STRINGS.A_SMALL_TEXT, STRINGS.A_TITLE_CASE_TEXT)
    .replace(STRINGS.AN_SMALL_TEXT, STRINGS.AN_TITLE_CASE_TEXT);
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
    return taskDetails ? STRINGS.UNKNOWN_TEXT : `${expiryPrefix} ${STRINGS.UNKNOWN_TEXT}`;
  }
  return taskDetails ? `${getFormattedDate(document?.expiry, DATE_FORMATS.SHORT_ALT)}` : `${expiryPrefix} ${getFormattedDate(document?.expiry, DATE_FORMATS.SHORT_ALT)}`;
};

const getDocumentValidityDate = (document) => {
  return document?.validFrom || undefined;
};

const getDocumentValidity = (document, taskDetails = false) => {
  const validityPrefix = 'Valid from';
  if (!document?.validFrom) {
    return taskDetails ? STRINGS.UNKNOWN_TEXT : `${validityPrefix} ${STRINGS.UNKNOWN_TEXT}`;
  }
  return taskDetails ? `${getFormattedDate(document?.validFrom, DATE_FORMATS.SHORT_ALT)}` : `${validityPrefix} ${getFormattedDate(document?.validFrom, DATE_FORMATS.SHORT_ALT)}`;
};

const getDocumentType = (document) => {
  if (!document?.type) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return document.type;
};

const getDocumentNumber = (document) => {
  if (!document?.number) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return document.number;
};

const getDocumentName = (person) => {
  if (!person?.name) {
    return STRINGS.UNKNOWN_TEXT;
  }
  const firstNames = person?.name?.first || STRINGS.UNKNOWN_TEXT;
  const lastName = person?.name?.last || STRINGS.UNKNOWN_TEXT;
  return `${lastName.toUpperCase()}, ${firstNames}`;
};

// TODO finish implementation once data flows through
const getDocumentIdentification = (document) => {
  if (!document) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return STRINGS.UNKNOWN_TEXT;
};

const getDocumentCountryOfIssue = (document, taskDetails = false) => {
  const countryOfIssuePrefix = 'Issued by';
  if (!document?.countryOfIssue) {
    return taskDetails ? STRINGS.UNKNOWN_TEXT : `${countryOfIssuePrefix} ${STRINGS.UNKNOWN_TEXT}`;
  }
  if (taskDetails) {
    return lookup.byIso(document.countryOfIssue) !== null
      ? `${lookup.byIso(document.countryOfIssue).country} (${CommonUtil.iso3Code(document.countryOfIssue)})`
      : `${countryOfIssuePrefix} ${STRINGS.UNKNOWN_TEXT}`;
  }

  return lookup.byIso(document.countryOfIssue) !== null
    ? `${countryOfIssuePrefix} ${CommonUtil.iso3Code(document.countryOfIssue)}`
    : `${countryOfIssuePrefix} ${STRINGS.UNKNOWN_TEXT}`;
};

const getDocumentCountryOfIssueCode = (document) => {
  if (!document?.countryOfIssue) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return CommonUtil.iso3Code(document.countryOfIssue);
};

const getDocumentNationality = (document, taskDetails = false) => {
  return getDocumentCountryOfIssue(document, taskDetails);
};

const getDocumentDOB = (document) => {
  if (!document?.dateOfBirth) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return getFormattedDate(document?.dateOfBirth, DATE_FORMATS.SHORT_ALT);
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
