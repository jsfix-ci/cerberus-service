import uploadDocuments from './uploadDocuments';

describe('utils.Form.uploadDocuments', () => {
  const GOOD_RESPONSE = {
    status: 200,
    data: {
      url: 'https://good.response/item.jpg',
    },
  };
  const getMockClient = (response) => {
    const posts = [];
    return {
      posts,
      post: async (url, payload) => {
        posts.push({ url, payload });
        if (response) {
          return Promise.resolve(response);
        }
        return Promise.reject(new Error('could not upload'));
      },
    };
  };

  it('should handle a null client', async () => {
    const CLIENT = null;
    const PAYLOAD = {};
    const result = await uploadDocuments(CLIENT, PAYLOAD);
    expect(result).toBeUndefined();
  });

  it('should handle a null payload', async () => {
    const CLIENT = getMockClient(GOOD_RESPONSE);
    const PAYLOAD = null;
    const result = await uploadDocuments(CLIENT, PAYLOAD);
    expect(result).toBeUndefined();
    expect(CLIENT.posts.length).toEqual(0);
  });

  it('should handle no meta on the payload', async () => {
    const CLIENT = getMockClient(GOOD_RESPONSE);
    const PAYLOAD = {};
    const result = await uploadDocuments(CLIENT, PAYLOAD);
    expect(result).toBeUndefined();
    expect(CLIENT.posts.length).toEqual(0);
  });

  it('should handle a meta but no documents the payload', async () => {
    const CLIENT = getMockClient(GOOD_RESPONSE);
    const PAYLOAD = { meta: {} };
    const result = await uploadDocuments(CLIENT, PAYLOAD);
    expect(result).toBeUndefined();
    expect(CLIENT.posts.length).toEqual(0);
  });

  it('should handle an empty meta.documents array on the payload', async () => {
    const CLIENT = getMockClient(GOOD_RESPONSE);
    const PAYLOAD = { meta: { documents: [] } };
    const result = await uploadDocuments(CLIENT, PAYLOAD);
    expect(result).toBeUndefined();
    expect(CLIENT.posts.length).toEqual(0);
  });

  it('should not try to upload anything when all documents already have a url', async () => {
    const CLIENT = getMockClient(GOOD_RESPONSE);
    const PAYLOAD = {
      meta: {
        documents: [
          { id: 'alpha', url: 'http://file.com/thing.jpg', field: 'alpha' },
        ],
      },
    };
    const result = await uploadDocuments(CLIENT, PAYLOAD);
    expect(result).toBeUndefined();
    expect(CLIENT.posts.length).toEqual(0);
  });

  it('should only try to upload documents that have no url', async () => {
    const CLIENT = getMockClient(GOOD_RESPONSE);
    const PAYLOAD = {
      meta: {
        documents: [
          { id: 'a', url: 'http://file.com/thing.jpg', field: 'alpha' },
          { id: 'b', file: { bravo: 'bcd' }, field: 'bravo' },
          { id: 'c', file: { charlie: 'cde' }, field: 'charlie' },
        ],
      },
    };
    const result = await uploadDocuments(CLIENT, PAYLOAD);
    expect(Array.isArray(result)).toBeTruthy();
    expect(result[0]).toMatchObject({ id: 'b', field: 'bravo', url: GOOD_RESPONSE.data.url });
    expect(result[1]).toMatchObject({ id: 'c', field: 'charlie', url: GOOD_RESPONSE.data.url });
    expect(CLIENT.posts.length).toEqual(2);
  });

  it('should handle an empty from the client', async () => {
    const CLIENT = getMockClient({ status: 500 });
    const PAYLOAD = {
      meta: {
        documents: [
          { id: 'a', url: 'http://file.com/thing.jpg', field: 'alpha' },
          { id: 'b', file: { bravo: 'bcd' }, field: 'bravo' },
          { id: 'c', file: { charlie: 'cde' }, field: 'charlie' },
        ],
      },
    };
    const result = await uploadDocuments(CLIENT, PAYLOAD);
    expect(Array.isArray(result)).toBeTruthy();
    expect(result[0]).toMatchObject(PAYLOAD.meta.documents[1]);
    expect(result[1]).toMatchObject(PAYLOAD.meta.documents[2]);
    expect(CLIENT.posts.length).toEqual(2);
  });

  it('should handle an error from the client', async () => {
    const CLIENT = getMockClient();
    const PAYLOAD = {
      meta: {
        documents: [
          { id: 'a', url: 'http://file.com/thing.jpg', field: 'alpha' },
          { id: 'b', file: { bravo: 'bcd' }, field: 'bravo' },
          { id: 'c', file: { charlie: 'cde' }, field: 'charlie' },
        ],
      },
    };
    expect(uploadDocuments(CLIENT, PAYLOAD)).rejects.toThrow();
  });
});
