import cleanSubmission, { getFormPayload } from './cleanSubmission';

describe('components.utils.Form', () => {
  const FORM_INFO = { id: 'formId', version: '1.0.0', name: 'form1', title: 'Form 1' };
  const SUBMITTED_BY = 'alpha.bravo@homeoffice.gov.uk';
  const PAYLOAD_CONTEXTS = {
    environmentContext: {},
    keycloakContext: {},
  };

  describe('getFormPayload', () => {
    it('should return an appropriate form object', () => {
      const before = Date.now();
      const result = getFormPayload(FORM_INFO, SUBMITTED_BY);
      const after = Date.now();
      expect(result).toMatchObject({
        formId: FORM_INFO.id,
        formVersionId: FORM_INFO.version,
        name: FORM_INFO.name,
        title: FORM_INFO.title,
        submittedBy: SUBMITTED_BY,
        draftForm: true,
      });
      const submissionDate = new Date(result.submissionDate).getTime();
      expect(submissionDate).toBeGreaterThanOrEqual(before);
      expect(submissionDate).toBeLessThanOrEqual(after);
    });
  });

  describe('cleanSubmission', () => {
    it('should return a clean payload', () => {
      const FORM_DATA = {
        alpha: 'bravo',
        charlie: 'delata',
      };
      const PAYLOAD = {
        ...PAYLOAD_CONTEXTS,
        processContext: {
          instance: { businessKey: 'KEY-12345678-90', id: 'instanceId' },
        },
        ...FORM_DATA,
      };
      const before = Date.now();
      const result = cleanSubmission(FORM_INFO, PAYLOAD, SUBMITTED_BY);
      const after = Date.now();
      expect(result).toMatchObject({
        id: PAYLOAD.processContext.instance.id,
        businessKey: PAYLOAD.processContext.instance.businessKey,
        ...FORM_DATA,
        form: {
          formId: FORM_INFO.id,
          formVersionId: FORM_INFO.version,
          name: FORM_INFO.name,
          title: FORM_INFO.title,
          submittedBy: SUBMITTED_BY,
          draftForm: true,
        },
      });
      // Check the submissionDate.
      const submissionDate = new Date(result.form.submissionDate).getTime();
      expect(submissionDate).toBeGreaterThanOrEqual(before);
      expect(submissionDate).toBeLessThanOrEqual(after);
      // And make sure the contexts that were in the payload are no longer there.
      Object.keys(PAYLOAD_CONTEXTS).forEach((key) => {
        expect(result[key]).not.toBeDefined();
      });
    });
  });
});
