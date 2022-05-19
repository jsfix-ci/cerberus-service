import { BUSINESS_KEY_PATH } from '../../constants';
import generateBusinessKey from './generateBusinessKey';

describe('components.utils.Form', () => {
  describe('generateBusinessKey', () => {
    const BUSINESS_KEY = 'TEST-12345678-90';
    const axiosInstance = {
      posts: [],
      post: async (url, payload) => {
        axiosInstance.posts.push({ url, payload });
        return new Promise((resolve) => {
          resolve({ data: { businessKey: BUSINESS_KEY } });
        });
      },
    };

    it('should appropriately return a businessKey', async () => {
      const result = await generateBusinessKey(axiosInstance);
      expect(result).toEqual(BUSINESS_KEY);
      expect(axiosInstance.posts.length).toEqual(1);
      expect(axiosInstance.posts[0]).toMatchObject({
        url: BUSINESS_KEY_PATH,
        payload: {},
      });
    });
  });
});
