/* eslint-disable no-template-curly-in-string */
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import '../../../../__mocks__/keycloakMock';
import React from 'react';
import { render, waitFor } from '@testing-library/react';

import setupRefDataOptions from './setupRefDataOptions';

import config from '../../../../utils/config';

describe('Custom.Data.setupRefDataOptions', () => {
  const mockAxios = new MockAdapter(axios);

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    config.refdataApiUrl = 'http://test-refdata.com';
    mockAxios.reset();
  });

  const TestComponent = ({ components }) => {
    setupRefDataOptions(components);

    const options = components?.map((component) => {
      return component?.data?.options.map((opt) => {
        return opt;
      });
    }).filter((opt) => opt).flat();

    return (
      <ul>
        {options.map((opt, index) => {
          return <li key={index} id={opt.id}>{opt.label}</li>;
        })}
      </ul>
    );
  };

  it('should set up refdata options', async () => {
    const RESPONSES = [
      [{ id: '1', value: 'Bravo' }],
      [{ id: '2', value: 'Delta' }],
    ];

    mockAxios
      .onGet('/link/alpha')
      .reply(200, { data: RESPONSES[0] })
      .onGet('/link/charlie')
      .reply(200, { data: RESPONSES[1] });

    const COMPONENTS = [
      {
        item: {
          value: 'id',
          label: 'value',
        },
        data: { url: '${environmentContext.referenceDataUrl}/link/alpha' },
      },
      {
        item: {
          value: 'id',
          label: 'value',
        },
        data: { url: '${environmentContext.referenceDataUrl}/link/charlie' },
      },
    ];

    const { container } = await waitFor(() => render(<TestComponent components={COMPONENTS} />));

    expect(container.childNodes.length).toEqual(1);
    const ul = container.childNodes[0];
    expect(ul.tagName).toEqual('UL');
    expect(ul.childNodes.length).toEqual(COMPONENTS.length);
    ul.childNodes.forEach((li, index) => {
      expect(li.id).toEqual(RESPONSES[index][0].id);
      expect(li.textContent).toEqual(RESPONSES[index][0].value);
    });
  });
});
