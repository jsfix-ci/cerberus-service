import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '../../__mocks__/keycloakMock';

import TaskNotes from '../v2/TaskNotes';

import operationsHistoryResponseClaim from '../../routes/roro/__fixtures__/operationsHistoryResponse_USER_CLAIM.fixture.json';
import operationsHistoryResponseUnclaim from '../../routes/roro/__fixtures__/operationsHistoryResponse_USER_UNCLAIM.fixture.json';
import operationsHistoryResponsePropertyChanged from '../../routes/roro/__fixtures__/operationsHistoryResponse_PROPERTY_CHANGED.fixture.json';
import noteFormFixture from '../../routes/roro/__fixtures__/noteFormResponse.fixture.json';

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

  const mockTaskNotesAxiosCalls = ({
    variableInstanceResponse = [{
      type: 'Json',
      value: '[]',
      name: 'notes',
    }],
    operationsHistoryResponse = [],
    taskHistoryResponse = [],
  }) => {
    mockAxios
      .onGet('/history/variable-instance', { params: { processInstanceIdIn: '123', deserializeValues: false } })
      .reply(200, variableInstanceResponse)
      .onGet('/history/user-operation', { params: { processInstanceId: '123', deserializeValues: false } })
      .reply(200, operationsHistoryResponse)
      .onGet('/history/task', { params: { processInstanceId: '123', deserializeValues: false } })
      .reply(200, taskHistoryResponse)
      .onGet('/form/name/noteCerberus')
      .reply(200, noteFormFixture)
      .onPost()
      .reply(200);
  };

  it('should render task notes form when displayForm is true', async () => {
    mockTaskNotesAxiosCalls({});

    await waitFor(() => render(<TaskNotes formName="noteCerberus" displayForm businessKey="ghi" processInstanceId="123" />));
    expect(screen.queryByText('Add a new note')).toBeInTheDocument();
    expect(screen.queryByText('Task activity')).toBeInTheDocument();
  });

  it('should not render task notes form when displayForm is false', async () => {
    mockTaskNotesAxiosCalls({});

    await waitFor(() => render(<TaskNotes formName="noteCerberus" displayForm={false} businessKey="ghi" processInstanceId="123" />));
    expect(screen.queryByText('Add a new note')).not.toBeInTheDocument();
    expect(screen.queryByText('Task activity')).toBeInTheDocument();
  });

  it('should display task received activity', async () => {
    mockTaskNotesAxiosCalls({
      variableInstanceResponse: [{
        type: 'Json',
        value: '[{"note":"Task received","timeStamp":1641378056264,"userId":"testuser@email.com"}]',
        name: 'notes',
      }],
    });

    await waitFor(() => render(<TaskNotes formName="noteCerberus" displayForm businessKey="ghi" processInstanceId="123" />));
    expect(screen.queryByText('Task received')).toBeInTheDocument();
  });

  it('should display user claimed task activity', async () => {
    mockTaskNotesAxiosCalls({
      operationsHistoryResponse: operationsHistoryResponseClaim,
    });

    await waitFor(() => render(<TaskNotes formName="noteCerberus" displayForm businessKey="ghi" processInstanceId="123" />));
    expect(screen.queryByText('User has claimed the task')).toBeInTheDocument();
  });

  it('should display user unclaimed task activity', async () => {
    mockTaskNotesAxiosCalls({
      operationsHistoryResponse: operationsHistoryResponseUnclaim,
    });

    await waitFor(() => render(<TaskNotes formName="noteCerberus" displayForm businessKey="ghi" processInstanceId="123" />));
    expect(screen.queryByText('User has unclaimed the task')).toBeInTheDocument();
  });

  it('should display property changed activity', async () => {
    mockTaskNotesAxiosCalls({
      operationsHistoryResponse: operationsHistoryResponsePropertyChanged,
    });

    await waitFor(() => render(<TaskNotes formName="noteCerberus" displayForm businessKey="ghi" processInstanceId="123" />));

    expect(screen.queryByText('testuser@email.com')).not.toBeInTheDocument();
    expect(screen.queryByText('Property delete changed from false to true')).not.toBeInTheDocument();
  });

  it('should display develop the task activity', async () => {
    mockTaskNotesAxiosCalls({
      taskHistoryResponse: [{
        name: 'Develop the task',
        assignee: 'testuser@email.com',
        startTime: '2022-01-05T10:20:56.318+0000',
      }],
    });

    await waitFor(() => render(<TaskNotes formName="noteCerberus" displayForm businessKey="ghi" processInstanceId="123" />));
    expect(screen.queryByText('Develop the task')).toBeInTheDocument();
  });

  it('request notes content within request payload should be JSON escaped on network post call', async () => {
    const input = '\nthis \\is a "test" \nnote';
    const expectedPayload = '\\nthis \\\\is a \\"test\\" \\nnote';

    mockTaskNotesAxiosCalls({});
    await waitFor(() => render(<TaskNotes formName="noteCerberus" displayForm businessKey="ghi" processInstanceId="123" />));

    expect(screen.queryByText('Add a new note')).toBeInTheDocument();
    await waitFor(() => userEvent.type(screen.getByRole('textbox', { name: /Add a new note/i }), input));

    await waitFor(() => userEvent.click(screen.getByRole('button', { name: /Save/i })));

    const requestPayload = mockAxios.history.post[0].data;
    const parsedPayload = JSON.parse(JSON.parse(requestPayload).variables.noteCerberus.value).note;
    expect(parsedPayload).toEqual(expectedPayload);
  });
});
