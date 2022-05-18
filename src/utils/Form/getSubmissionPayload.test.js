import { BUSINESS_KEY_PATH } from '../../constants';
import getSubmissionPayload from './getSubmissionPayload';

describe('components.utils.Form', () => {
  const BUSINESS_KEY = 'TEST-12345678-90';
  const NEW_BUSINESS_KEY = 'TEST-12345678-91';
  const FORM_INFO = { id: 'formId', version: '1.0.0', name: 'form1', title: 'Form 1' };
  const FORM_DATA = { alpha: 'bravo', charlie: 'delata' };
  const SUBMITTED_BY = 'alpha.bravo@homeoffice.gov.uk';
  const PAYLOAD_CONTEXTS = {
    environmentContext: {},
    keycloakContext: {},
  };
  const axiosInstance = {
    posts: [],
    post: async (url, payload) => {
      axiosInstance.posts.push({ url, payload });
      return new Promise((resolve) => {
        resolve({ data: { businessKey: NEW_BUSINESS_KEY } });
      });
    },
  };

  afterEach(async () => {
    axiosInstance.posts.length = 0;
  });

  describe('getSubmissionPayload', () => {
    it('should get an appropriate payload that already contains a business key', async () => {
      const PAYLOAD = {
        ...PAYLOAD_CONTEXTS,
        processContext: {
          instance: { businessKey: BUSINESS_KEY, id: 'instanceId' },
        },
        ...FORM_DATA,
      };
      const before = Date.now();
      const result = await getSubmissionPayload(FORM_INFO, PAYLOAD, SUBMITTED_BY, axiosInstance);
      const after = Date.now();
      expect(result).toMatchObject({
        id: PAYLOAD.processContext.instance.id,
        businessKey: BUSINESS_KEY,
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
      expect(axiosInstance.posts.length).toEqual(0);
    });

    it('should generate a new businessKey when one does not already exist', async () => {
      const PAYLOAD = {
        ...PAYLOAD_CONTEXTS,
        processContext: {
          instance: { id: 'instanceId' },
        },
        ...FORM_DATA,
      };
      const before = Date.now();
      const result = await getSubmissionPayload(FORM_INFO, PAYLOAD, SUBMITTED_BY, axiosInstance);
      const after = Date.now();
      expect(result).toMatchObject({
        id: PAYLOAD.processContext.instance.id,
        businessKey: NEW_BUSINESS_KEY,
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
      expect(axiosInstance.posts.length).toEqual(1);
      expect(axiosInstance.posts[0]).toMatchObject({
        url: BUSINESS_KEY_PATH,
        payload: {},
      });
    });
  });
});
