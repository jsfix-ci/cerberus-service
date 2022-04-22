import { DocumentUtil } from '../../../../TaskListPage/airpax/utils/index';
import { UNKNOWN_TEXT } from '../../../../../constants';

describe('DocumentUtil', () => {
  it('should get a document if present', () => {
    const person = {
      document: null,
    };

    const output = DocumentUtil.get(person);
    expect(output).toBeNull();
  });

  it('should verify absence of a document', () => {
    const person = {
      document: null,
    };

    const output = DocumentUtil.has(person);
    expect(output).toBeFalsy();
  });

  it('should get expiry if present', () => {
    const person = {
      document: null,
    };

    const output = DocumentUtil.docExpiry(person);
    expect(output).toEqual(`Expires ${UNKNOWN_TEXT}`);
  });

  it('should get validity if present', () => {
    const person = {
      document: null,
    };

    const output = DocumentUtil.docValidity(person);
    expect(output).toEqual(`Valid from ${UNKNOWN_TEXT}`);
  });

  it('should get indentification if present', () => {
    const person = {
      document: null,
    };

    const output = DocumentUtil.docIdentification(person);
    expect(output).toEqual(UNKNOWN_TEXT);
  });

  it('should get country of issue if present', () => {
    const person = {
      document: null,
    };

    const output = DocumentUtil.docCountry(person);
    expect(output).toEqual(`Issued by ${UNKNOWN_TEXT}`);
  });
});
