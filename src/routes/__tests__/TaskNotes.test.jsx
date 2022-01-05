import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { render, screen, waitFor } from '@testing-library/react';
import '../../__mocks__/keycloakMock';

import TaskNotes from '../TaskDetails/TaskNotes';

import variableInstanceStatusNew from '../__fixtures__/variableInstanceStatusNew.fixture.json';
import noteFormFixture from '../__fixtures__/noteFormResponse.fixture.json';

// mock useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn().mockReturnValue({ businessKey: 'BUSINESS_KEY' }),
}));

describe('TaskNotes', () => {
  const mockAxios = new MockAdapter(axios);
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    mockAxios.reset();
  });

  const operationsHistoryFixture = [{
    operationType: 'Claim',
    property: 'assignee',
    orgValue: null,
    timestamp: '2021-04-06T15:30:42.420+0000',
    userId: 'testuser@email.com',
  }];
  const taskHistoryFixture = [{
    assignee: 'testuser@email.com',
    startTime: '2021-04-20T10:50:25.869+0000',
    name: 'Investigate Error',
  }];

  const mockTaskNotesAxiosCalls = ({
    variableInstanceResponse,
  }) => {
    mockAxios
      .onGet('/history/variable-instance', { params: { processInstanceIdIn: '123', deserializeValues: false } })
      .reply(200, variableInstanceResponse)
      .onGet('/history/user-operation', { params: { processInstanceId: '123', deserializeValues: false } })
      .reply(200, operationsHistoryFixture)
      .onGet('/history/task', { params: { processInstanceId: '123', deserializeValues: false } })
      .reply(200, taskHistoryFixture)
      .onGet('/form/name/noteCerberus')
      .reply(200, noteFormFixture);
  };

  it('Should render task notes form when displayFrom=true', async () => {
    mockTaskNotesAxiosCalls({
      variableInstanceResponse: variableInstanceStatusNew,
    });

    await waitFor(() => render(<TaskNotes displayForm businessKey="ghi" processInstanceId="123" />));

    expect(screen.queryByText('Add a new note')).toBeInTheDocument();
  });
});
