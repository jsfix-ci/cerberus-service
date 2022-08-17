import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '../../__mocks__/keycloakMock';

import TaskNotes from '../TaskNotes';

import operationsHistoryResponseClaim from '../../routes/roro/__fixtures__/operationsHistoryResponse_USER_CLAIM.fixture.json';
import operationsHistoryResponseUnclaim from '../../routes/roro/__fixtures__/operationsHistoryResponse_USER_UNCLAIM.fixture.json';
import operationsHistoryResponsePropertyChanged from '../../routes/roro/__fixtures__/operationsHistoryResponse_PROPERTY_CHANGED.fixture.json';
import noteFormFixture from '../../routes/roro/__fixtures__/noteFormResponse.fixture.json';

import { MOVEMENT_VARIANT } from '../../constants';

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

    await waitFor(() => render(<TaskNotes
      noteVariant={MOVEMENT_VARIANT.RORO}
      displayForm
      businessKey="ghi"
      processInstanceId="123"
    />));
    expect(screen.queryByText('Add a new note')).toBeInTheDocument();
    expect(screen.queryByText('Task activity')).toBeInTheDocument();
  });

  it('should not render task notes form when displayForm is false', async () => {
    mockTaskNotesAxiosCalls({});

    await waitFor(() => render(<TaskNotes
      noteVariant={MOVEMENT_VARIANT.RORO}
      displayForm={false}
      businessKey="ghi"
      processInstanceId="123"
    />));
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

    await waitFor(() => render(<TaskNotes
      noteVariant={MOVEMENT_VARIANT.RORO}
      displayForm
      businessKey="ghi"
      processInstanceId="123"
    />));
    expect(screen.queryByText('Task received')).toBeInTheDocument();
  });

  it('should display user claimed task activity', async () => {
    mockTaskNotesAxiosCalls({
      operationsHistoryResponse: operationsHistoryResponseClaim,
    });

    await waitFor(() => render(<TaskNotes
      noteVariant={MOVEMENT_VARIANT.RORO}
      displayForm
      businessKey="ghi"
      processInstanceId="123"
    />));
    expect(screen.queryByText('User has claimed the task')).toBeInTheDocument();
  });

  it('should display user unclaimed task activity', async () => {
    mockTaskNotesAxiosCalls({
      operationsHistoryResponse: operationsHistoryResponseUnclaim,
    });

    await waitFor(() => render(<TaskNotes
      noteVariant={MOVEMENT_VARIANT.RORO}
      displayForm
      businessKey="ghi"
      processInstanceId="123"
    />));
    expect(screen.queryByText('User has unclaimed the task')).toBeInTheDocument();
  });

  it('should display property changed activity', async () => {
    mockTaskNotesAxiosCalls({
      operationsHistoryResponse: operationsHistoryResponsePropertyChanged,
    });

    await waitFor(() => render(<TaskNotes
      noteVariant={MOVEMENT_VARIANT.RORO}
      displayForm
      businessKey="ghi"
      processInstanceId="123"
    />));

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

    await waitFor(() => render(<TaskNotes
      noteVariant={MOVEMENT_VARIANT.RORO}
      displayForm
      businessKey="ghi"
      processInstanceId="123"
    />));
    expect(screen.queryByText('Develop the task')).toBeInTheDocument();
  });

  it('request notes content within request payload should be JSON escaped on network post call', async () => {
    const input = '\nthis \\is a "test" \nnote';
    const expectedPayload = '\\nthis \\\\is a \\"test\\" \\nnote';

    mockTaskNotesAxiosCalls({});
    const { container } = render(<TaskNotes
      noteVariant={MOVEMENT_VARIANT.RORO}
      displayForm
      businessKey="ghi"
      processInstanceId="123"
    />);

    expect(screen.queryByText('Add a new note')).toBeInTheDocument();

    // Type into the textarea...
    const textarea = container.getElementsByClassName('govuk-textarea')[0];
    fireEvent.change(textarea, { target: { name: 'note', value: input } });

    // ... and then click on the submit button.
    const submit = container.getElementsByClassName('hods-button')[0];
    await waitFor(() => userEvent.click(submit));

    const requestPayload = mockAxios.history.post[0].data;
    const parsedPayload = JSON.parse(JSON.parse(requestPayload).variables.noteCerberus.value).note;
    expect(parsedPayload).toEqual(expectedPayload);
  });

  it('should render the task notes form (airpax)', async () => {
    await waitFor(() => render(<TaskNotes
      noteVariant={MOVEMENT_VARIANT.AIRPAX}
      displayForm
      businessKey="ghi"
      setRefreshNotesForm={jest.fn()}
    />));
    expect(screen.queryByText('Add a new note')).toBeInTheDocument();
  });

  it('should not render the task notes form (airpax)', async () => {
    await waitFor(() => render(<TaskNotes
      noteVariant={MOVEMENT_VARIANT.AIRPAX}
      displayForm={false}
      businessKey="ghi"
      setRefreshNotesForm={jest.fn()}
    />));
    expect(screen.queryByText('Add a new note')).not.toBeInTheDocument();
  });

  it('should add a note on submit the form (airpax)', async () => {
    const input = '\nthis \\is a "test" \nnote';
    const expectedPayload = '\\nthis \\\\is a \\"test\\" \\nnote';

    const { container } = await waitFor(() => render(<TaskNotes
      noteVariant={MOVEMENT_VARIANT.AIRPAX}
      displayForm
      businessKey="ghi"
      setRefreshNotesForm={jest.fn()}
      setError={jest.fn()}
    />));

    // Type into the textarea...
    const textarea = container.getElementsByClassName('govuk-textarea')[0];
    fireEvent.change(textarea, { target: { name: 'note', value: input } });

    // ... and then click on the submit button.
    const submit = container.getElementsByClassName('hods-button')[0];
    await waitFor(() => userEvent.click(submit));

    const requestPayload = mockAxios.history.post[0].data;
    const parsedPayload = JSON.parse(requestPayload)[0].content;
    expect(parsedPayload).toEqual(expectedPayload);
  });

  it('should add multiple notes on multiple submit the form (airpax)', async () => {
    const firstinput = '\nthis \\is a "test" \nnote';
    const secondinput = '\nthis \\is another "test" \nnote';
    const firstExpectedPayload = '\\nthis \\\\is a \\"test\\" \\nnote';
    const secondExpectedPayload = '\\nthis \\\\is another \\"test\\" \\nnote';

    const { container } = await waitFor(() => render(<TaskNotes
      noteVariant={MOVEMENT_VARIANT.AIRPAX}
      displayForm
      businessKey="ghi"
      setRefreshNotesForm={jest.fn()}
      setError={jest.fn()}
    />));

    // Type into the textarea...
    let textarea = container.getElementsByClassName('govuk-textarea')[0];
    fireEvent.change(textarea, { target: { name: 'note', value: firstinput } });

    // ... and then click on the submit button.
    await waitFor(() => userEvent.click(container.getElementsByClassName('hods-button')[0]));

    // Type into the textarea again...
    textarea = container.getElementsByClassName('govuk-textarea')[0];
    fireEvent.change(textarea, { target: { name: 'note', value: secondinput } });

    // ... and then click on the submit button. again
    await waitFor(() => userEvent.click(container.getElementsByClassName('hods-button')[0]));

    const firstRequestPayload = mockAxios.history.post[0].data;
    const firstParsedPayload = JSON.parse(firstRequestPayload)[0].content;
    expect(firstParsedPayload).toEqual(firstExpectedPayload);

    const secondRequestPayload = mockAxios.history.post[1].data;
    const secondParsedPayload = JSON.parse(secondRequestPayload)[0].content;
    expect(secondParsedPayload).toEqual(secondExpectedPayload);
  });
});
