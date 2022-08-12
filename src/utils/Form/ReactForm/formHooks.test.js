import formHooks from './formHooks';

describe('components.utils.Form.formHooks.onRequest', () => {
  it('should handle an empty request', () => {
    const REQ = {};
    const TOKEN = 'token-alpha-bravo';
    expect(formHooks.onRequest(REQ, TOKEN)).toMatchObject({
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
  });

  it('should handle a request with additional content', () => {
    const URL = 'http://www.something.com';
    const REQ = { url: URL, method: 'GET' };
    const TOKEN = 'token-alpha-bravo';
    expect(formHooks.onRequest(REQ, TOKEN)).toMatchObject({
      url: URL,
      method: 'GET',
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
  });

  it('should handle a request with existing headers', () => {
    const URL = 'http://www.something.com';
    const CONTENT_TYPE_HEADER = 'multipart/form-data';
    const REQ = {
      url: URL,
      method: 'GET',
      headers: {
        'Content-Type': CONTENT_TYPE_HEADER,
      },
    };
    const TOKEN = 'token-alpha-bravo';
    expect(formHooks.onRequest(REQ, TOKEN)).toMatchObject({
      url: URL,
      method: 'GET',
      headers: {
        'Content-Type': CONTENT_TYPE_HEADER,
        Authorization: `Bearer ${TOKEN}`,
      },
    });
  });

  it('should override existing Authorization header', () => {
    const REQ = {
      headers: {
        Authorization: 'Bearer token-charlie-delta',
      },
    };
    const TOKEN = 'token-alpha-bravo';
    expect(formHooks.onRequest(REQ, TOKEN)).toMatchObject({
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
  });
});
