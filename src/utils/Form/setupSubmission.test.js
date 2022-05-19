import { BUSINESS_KEY_PATH } from '../../constants';
import setupSubmission from './setupSubmission';

describe('components.utils.Form', () => {
  describe('setupSubmission', () => {
    const PROCESS_ID = 'alpha';
    const BUSINESS_KEY = 'TEST-12345678-90';
    const TASKS = [
      { id: '1', processInstanceId: 'alpha' },
      { id: '2', processInstanceId: 'bravo' },
    ];
    const NEW_BUSINESS_KEY = 'TEST-12345678-91';
    const FORM_INFO = { id: 'formId', version: '1.0.0', name: 'form1', title: 'Form 1' };
    const FORM_DATA = { alpha: 'bravo', charlie: 'delata' };
    const SUBMITTED_BY = 'alpha.bravo@homeoffice.gov.uk';
    const PAYLOAD_CONTEXTS = {
      environmentContext: {},
      keycloakContext: {},
    };
    const axiosInstance = {
      gets: [],
      ret: TASKS,
      get: async (url) => {
        axiosInstance.gets.push(url);
        return new Promise((resolve) => {
          resolve({ data: axiosInstance.ret });
        });
      },
      posts: [],
      post: async (url, payload) => {
        axiosInstance.posts.push({ url, payload });
        return new Promise((resolve) => {
          resolve({ data: { businessKey: NEW_BUSINESS_KEY } });
        });
      },
      put: async (url, payload) => {
        return { verb: 'PUT', url, payload };
      },
    };

    afterEach(async () => {
      axiosInstance.gets.length = 0;
      axiosInstance.posts.length = 0;
    });

    it('should set up a submission for an existing business key and process ID', async () => {
      const PAYLOAD = {
        ...PAYLOAD_CONTEXTS,
        processContext: {
          instance: { businessKey: BUSINESS_KEY, id: PROCESS_ID },
        },
        ...FORM_DATA,
      };
      const result = await setupSubmission(FORM_INFO, PAYLOAD, SUBMITTED_BY, axiosInstance);
      expect(result).toBeDefined();
      expect(result.businessKey).toEqual(BUSINESS_KEY);
      expect(result.submissionPayload).toMatchObject({
        ...FORM_DATA,
        businessKey: BUSINESS_KEY,
      });

      // Check the posts and gets.
      expect(axiosInstance.posts.length).toEqual(0); // Didn't try to get a new business key.
    });

    it('should set up a submission when there is no existing business key but with a process ID', async () => {
      const PAYLOAD = {
        ...PAYLOAD_CONTEXTS,
        processContext: {
          instance: { id: PROCESS_ID },
        },
        ...FORM_DATA,
      };
      const result = await setupSubmission(FORM_INFO, PAYLOAD, SUBMITTED_BY, axiosInstance);
      expect(result).toBeDefined();
      expect(result.businessKey).toEqual(NEW_BUSINESS_KEY);
      expect(result.submissionPayload).toMatchObject({
        ...FORM_DATA,
        businessKey: NEW_BUSINESS_KEY,
      });

      // Check the posts and gets.
      expect(axiosInstance.posts.length).toEqual(1);
      expect(axiosInstance.posts[0]).toMatchObject({
        url: BUSINESS_KEY_PATH,
        payload: {},
      });
    });

    it('should set up a submission when there is no existing business key or process ID', async () => {
      const PAYLOAD = {
        ...PAYLOAD_CONTEXTS,
        processContext: {
          instance: {},
        },
        ...FORM_DATA,
      };
      const result = await setupSubmission(FORM_INFO, PAYLOAD, SUBMITTED_BY, axiosInstance);
      expect(result).toBeDefined();
      expect(result.businessKey).toEqual(NEW_BUSINESS_KEY);
      expect(result.submissionPayload).toMatchObject({
        ...FORM_DATA,
        businessKey: NEW_BUSINESS_KEY,
      });

      // Check the posts and gets.
      expect(axiosInstance.posts.length).toEqual(1);
      expect(axiosInstance.posts[0]).toMatchObject({
        url: BUSINESS_KEY_PATH,
        payload: {},
      });
      expect(axiosInstance.gets.length).toEqual(0);
    });
  });
});
