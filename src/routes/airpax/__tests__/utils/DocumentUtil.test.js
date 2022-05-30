import { DocumentUtil } from '../../utils';
import { UNKNOWN_TEXT } from '../../../../constants';

describe('DocumentUtil', () => {
  const document = {
    type: 'Passport',
    number: '1234567',
    countryOfIssue: 'FR',
    nationality: 'GB',
    validFrom: '1970-04-14T00:00:00Z',
    expiry: '1970-04-14T00:00:00Z',
    name: 'Miss Gemma Mesta',
    dateOfBirth: '1970-04-14T00:00:00Z',
  };

  it('should get null if document is not present', () => {
    const person = {
      document: null,
    };

    const output = DocumentUtil.get(person);
    expect(output).toBeNull();
  });

  it('should get document if present', () => {
    const person = {
      document: {
        type: 'Passport',
        number: '1234567',
        countryOfIssue: 'FR',
        nationality: 'GB',
        validFrom: '1970-04-14T00:00:00Z',
        expiry: '1970-04-14T00:00:00Z',
        dateOfBirth: '1970-04-14T00:00:00Z',
      },
      name: {
        first: 'Gemma',
        full: 'Gemma Mesta',
        last: 'Mesta',
      },
    };
    const output = DocumentUtil.get(person);
    expect(output).toMatchObject({ 'countryOfIssue': 'FR',
      'nationality': 'GB',
      'number': '1234567',
      'type': 'Passport',
      'validFrom': '1970-04-14T00:00:00Z',
      'expiry': '1970-04-14T00:00:00Z' });
  });

  it('should shown unknown expiry when document expiry date is not present', () => {
    const person = {
      document: null,
    };

    const output = DocumentUtil.docExpiry(person);
    expect(output).toEqual(`Expires ${UNKNOWN_TEXT}`);
  });

  it('should show unknown validity when document validity date is not present', () => {
    const person = {
      document: null,
    };

    const output = DocumentUtil.docValidity(person);
    expect(output).toEqual(`Valid from ${UNKNOWN_TEXT}`);
  });

  it('should show unknown type when document type is not present', () => {
    const person = {
      document: null,
    };

    const output = DocumentUtil.docType(person);
    expect(output).toEqual(UNKNOWN_TEXT);
  });

  it('should show unknown when document number is not present', () => {
    const person = {
      document: null,
    };

    const output = DocumentUtil.docNumber(person);
    expect(output).toEqual(UNKNOWN_TEXT);
  });

  it('should show unknown when document name is not present', () => {
    const person = {
      document: null,
    };

    const output = DocumentUtil.docName(person);
    expect(output).toEqual(UNKNOWN_TEXT);
  });

  it('should shown unknown when document identification is not present', () => {
    const person = {
      document: null,
    };

    const output = DocumentUtil.docIdentification(person);
    expect(output).toEqual(UNKNOWN_TEXT);
  });

  it('should show unknown when document country of issue is not present', () => {
    const person = {
      document: null,
    };

    const output = DocumentUtil.docCountry(person);
    expect(output).toEqual(`Issued by ${UNKNOWN_TEXT}`);
  });

  it('should show unknown when document nationality is not present', () => {
    const person = {
      document: null,
    };

    const output = DocumentUtil.docNationality(person);
    expect(output).toEqual(`Issued by ${UNKNOWN_TEXT}`);
  });

  it('should show unknown when document date of birth is not present', () => {
    const person = {
      document: null,
    };

    const output = DocumentUtil.docDOB(person);
    expect(output).toEqual(UNKNOWN_TEXT);
  });

  it('should shown expiry when document expiry date is present', () => {
    const output = DocumentUtil.docExpiry(document, true);
    expect(output).toEqual('14 Apr 1970');
  });

  it('should show validity when document validity date is present', () => {
    const output = DocumentUtil.docValidity(document, true);
    expect(output).toEqual('14 Apr 1970');
  });

  it('should show document type when document type is present', () => {
    const output = DocumentUtil.docType(document);
    expect(output).toEqual('Passport');
  });

  it('should show document number when document number is present', () => {
    const output = DocumentUtil.docNumber(document);
    expect(output).toEqual('1234567');
  });

  it('should show document name when document name is present', () => {
    const personMin = {
      name: {
        first: 'Gemma',
        full: 'Gemma Mesta',
        last: 'Mesta',
      },
    };
    const output = DocumentUtil.docName(personMin);
    expect(output).toEqual('MESTA, Gemma');
  });

  it('should return unknown if document identification is not present', () => {
    const output = DocumentUtil.docIdentification(document);
    expect(output).toEqual(UNKNOWN_TEXT);
  });

  it('should show document country of issue if it is present', () => {
    const output = DocumentUtil.docCountry(document);
    expect(output).toEqual('Issued by FR');
  });

  it('should show document nationality if it is present', () => {
    const output = DocumentUtil.docNationality(document);
    expect(output).toEqual('Issued by FR');
  });

  it('should show document date of birth if it is present', () => {
    const output = DocumentUtil.docDOB(document);
    expect(output).toEqual('14 Apr 1970');
  });

  it('should return the document country of issue code when present', () => {
    const output = DocumentUtil.docCountryCode(document);
    expect(output).toEqual('FR');
  });

  it('should return unknown when the document country of issue is null', () => {
    document.countryOfIssue = null;
    const output = DocumentUtil.docCountryCode(document);
    expect(output).toEqual(UNKNOWN_TEXT);
  });

  it('should return unknown when the document country of issue is undefined', () => {
    document.countryOfIssue = undefined;
    const output = DocumentUtil.docCountryCode(document);
    expect(output).toEqual(UNKNOWN_TEXT);
  });

  it('should return unknown when the document country of issue is an empty string', () => {
    document.countryOfIssue = '';
    const output = DocumentUtil.docCountryCode(document);
    expect(output).toEqual(UNKNOWN_TEXT);
  });
});
