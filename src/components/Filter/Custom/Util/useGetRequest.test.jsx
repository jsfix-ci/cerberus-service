// Global imports
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { render } from '@testing-library/react';

// Local imports
import useGetRequest, { clear, STATUS_ERROR, STATUS_FETCHING } from './useGetRequest';

const sleep = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const TestComponent = ({ url, notifyOfCancel }) => {
  const { status, error, data, cancelRequests } = useGetRequest(url);
  if (typeof notifyOfCancel === 'function') {
    notifyOfCancel(cancelRequests);
  }
  if (!data) {
    return (
      <>
        {error && <div>{`${STATUS_ERROR}: ${error.message}`}</div>}
        {!error && <div>{status}</div>}
      </>
    );
  }
  return (
    <ul>
      {data.data && data.data.map((item, index) => (
        <li key={index} id={item.id}>{item.name}</li>
      ))}
    </ul>
  );
};

describe('Custom.Util.useGetRequest', () => {
  const mockAxios = new MockAdapter(axios);
  const ABC = [
    { id: 'a', name: 'Alpha' },
    { id: 'b', name: 'Beta' },
    { id: 'c', name: 'Charlie' },
  ];

  beforeEach(() => {
    mockAxios.reset();
    clear();
  });

  it('can handle a call and return appropriate values', async () => {
    const URL = '/api/data';
    mockAxios.onGet(URL).reply(200, { data: ABC });
    const { container } = await render(<TestComponent url={URL} />);
    expect(container.textContent).toEqual(STATUS_FETCHING);

    await act(() => sleep(100));

    expect(container.childNodes.length).toEqual(1);
    const ul = container.childNodes[0];
    expect(ul.tagName).toEqual('UL');
    expect(ul.childNodes.length).toEqual(ABC.length);
    ul.childNodes.forEach((li, index) => {
      expect(li.id).toEqual(ABC[index].id);
      expect(li.textContent).toEqual(ABC[index].name);
    });
  });

  it('can handle an error when making the request', async () => {
    const URL = '/api/error';
    mockAxios.onGet(URL).reply(500, {});
    const { container } = await render(<TestComponent url={URL} />);
    expect(container.textContent).toEqual(STATUS_FETCHING);

    await sleep(100);

    expect(container.textContent).toEqual(`${STATUS_ERROR}: Request failed with status code 500`);
  });

  it('can cancel a sent request', async () => {
    const URL = '/api/cancel-me';
    mockAxios.onGet(URL).reply(200, { data: ABC });
    const notifyOfCancel = (cancelToken) => {
      if (typeof cancelToken === 'function') {
        cancelToken('Hold the phone!');
      }
    };
    const { container } = await render(<TestComponent url={URL} notifyOfCancel={notifyOfCancel} />);
    expect(container.textContent).toEqual(STATUS_FETCHING);

    await sleep(100);

    expect(container.textContent).toEqual(`${STATUS_ERROR}: canceled`);
  });
});
