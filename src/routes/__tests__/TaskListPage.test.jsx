import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '../../__mocks__/keycloakMock';
import TaskListPage from '../TaskLists/TaskListPage';
import variableInstanceTaskSummaryBasedOnTIS from '../__fixtures__/variableInstanceTaskSummaryBasedOnTIS.fixture.json';

describe('TaskListPage', () => {
  const mockAxios = new MockAdapter(axios);
  const envUrl = `${window.location.protocol}//${window.location.hostname}`;
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    mockAxios.reset();
  });

  it('should render loading spinner on component load', () => {
    render(<TaskListPage taskStatus="new" setError={() => { }} />);
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('should render no tasks available message when New, In Progress, Target Issued and Complete tabs are clicked and there are no tasks', async () => {
    mockAxios
      .onGet('/task')
      .reply(200, [])
      .onGet('/task/count')
      .reply(200, { count: 0 })
      .onGet('/process-instance')
      .reply(200, [])
      .onGet('/process-instance/count')
      .reply(200, { count: 0 })
      .onGet('/variable-instance')
      .reply(200, [])
      .onGet('/history/process-instance')
      .reply(200, [])
      .onGet('/history/process-instance/count')
      .reply(200, { count: 0 })
      .onGet('/history/variable-instance')
      .reply(200, []);

    await waitFor(() => render(<TaskListPage taskStatus="new" setError={() => { }} />));

    expect(screen.queryByText('You are not authorised to view these tasks.')).not.toBeInTheDocument();
    expect(screen.getByText('New')).toBeInTheDocument();
    expect(screen.getByText('Target issued')).toBeInTheDocument();

    expect(screen.getByText('No tasks available')).toBeInTheDocument();
    expect(screen.queryByText('Request failed with status code 404')).not.toBeInTheDocument();
    expect(screen.queryByText('There is a problem')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('link', { name: /Target issued/i }));
    await waitFor(() => expect(screen.getByText('No tasks available')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('Request failed with status code 404')).not.toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('There is a problem')).not.toBeInTheDocument());

    fireEvent.click(screen.getByRole('link', { name: /In progress/i }));
    await waitFor(() => expect(screen.getByText('No tasks available')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('Request failed with status code 404')).not.toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('There is a problem')).not.toBeInTheDocument());

    fireEvent.click(screen.getByRole('link', { name: /Complete/i }));
    await waitFor(() => expect(screen.getByText('No tasks available')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('Request failed with status code 404')).not.toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('There is a problem')).not.toBeInTheDocument());
  });

  it('should render links to processId with text of businessKey when tasks exist', async () => {
    mockAxios
      .onGet('/task/count')
      .reply(200, { count: 0 })
      .onGet('/task')
      .reply(200, [{}])
      .onGet('/process-instance/count')
      .reply(200, { count: 10 })
      .onGet('/process-instance')
      .reply(200, [
        { id: '123' },
        { id: '456' },
        { id: '789' },
      ])
      .onGet('/variable-instance')
      .reply(200, variableInstanceTaskSummaryBasedOnTIS);

    await waitFor(() => render(<TaskListPage taskStatus="new" setError={() => { }} />));

    await waitFor(() => expect(screen.getByRole('link', { name: /business%3Akey%3Da%2Fb%2Fc/i }).href).toBe(`${envUrl}/tasks/business%3Akey%3Da%2Fb%2Fc`));
    await waitFor(() => expect(screen.getByRole('link', { name: /business%3Akey%3Dd%2Fe%2Ff/i }).href).toBe(`${envUrl}/tasks/business%3Akey%3Dd%2Fe%2Ff`));
    await waitFor(() => expect(screen.getByRole('link', { name: /ghi/i }).href).toBe(`${envUrl}/tasks/ghi`));

    fireEvent.click(screen.getByRole('link', { name: /Target issued/i }));
    await waitFor(() => expect(screen.getByRole('link', { name: /business%3Akey%3Da%2Fb%2Fc/i }).href).toBe(`${envUrl}/tasks/business%3Akey%3Da%2Fb%2Fc`));
    await waitFor(() => expect(screen.getByRole('link', { name: /business%3Akey%3Dd%2Fe%2Ff/i }).href).toBe(`${envUrl}/tasks/business%3Akey%3Dd%2Fe%2Ff`));
    await waitFor(() => expect(screen.getByRole('link', { name: /ghi/i }).href).toBe(`${envUrl}/tasks/ghi`));

    fireEvent.click(screen.getByRole('link', { name: /In progress/i }));
    await waitFor(() => expect(screen.getByRole('link', { name: /business%3Akey%3Da%2Fb%2Fc/i }).href).toBe(`${envUrl}/tasks/business%3Akey%3Da%2Fb%2Fc`));
    await waitFor(() => expect(screen.getByRole('link', { name: /business%3Akey%3Dd%2Fe%2Ff/i }).href).toBe(`${envUrl}/tasks/business%3Akey%3Dd%2Fe%2Ff`));
    await waitFor(() => expect(screen.getByRole('link', { name: /ghi/i }).href).toBe(`${envUrl}/tasks/ghi`));
  });

  it('should render links to processId with text of businessKey when completed tasks exists', async () => {
    mockAxios
      .onGet('/task/count')
      .reply(200, { count: 0 })
      .onGet('/task')
      .reply(200, [{}])
      .onGet('/variable-instance')
      .reply(200, [{}])
      .onGet('/history/process-instance/count')
      .reply(200, { count: 10 })
      .onGet('/history/process-instance')
      .reply(200, [
        { id: '123' },
        { id: '456' },
        { id: '789' },
      ])
      .onGet('/history/variable-instance')
      .reply(200, variableInstanceTaskSummaryBasedOnTIS);

    await waitFor(() => render(<TaskListPage taskStatus="new" setError={() => { }} />));

    fireEvent.click(screen.getByRole('link', { name: /Complete/i }));
    await waitFor(() => expect(screen.getByRole('link', { name: /business%3Akey%3Da%2Fb%2Fc/i }).href).toBe(`${envUrl}/tasks/business%3Akey%3Da%2Fb%2Fc`));
    await waitFor(() => expect(screen.getByRole('link', { name: /business%3Akey%3Dd%2Fe%2Ff/i }).href).toBe(`${envUrl}/tasks/business%3Akey%3Dd%2Fe%2Ff`));
    await waitFor(() => expect(screen.getByRole('link', { name: /ghi/i }).href).toBe(`${envUrl}/tasks/ghi`));
  });

  it('should render new tasks on page load with a Claim button', async () => {
    mockAxios
      .onGet('/task/count')
      .reply(200, { count: 10 })
      .onGet('/task')
      .reply(200, [
        { processInstanceId: '123', assignee: null },
        { processInstanceId: '456', assignee: null },
        { processInstanceId: '789', assignee: null },
      ])
      .onGet('/variable-instance')
      .reply(200, variableInstanceTaskSummaryBasedOnTIS);

    await waitFor(() => render(<TaskListPage taskStatus="new" setError={() => { }} />));

    expect(screen.getAllByText('Claim')).toHaveLength(3);
  });

  it('should render tasks assigned to the current user with an Unclaim button', async () => {
    mockAxios
      .onGet('/task/count')
      .reply(200, { count: 10 })
      .onGet('/task')
      .reply(200, [
        { processInstanceId: '123', assignee: 'test' },
        { processInstanceId: '456', assignee: 'another-user' },
        { processInstanceId: '789', assignee: 'another-user' },
      ])
      .onGet('/variable-instance')
      .reply(200, variableInstanceTaskSummaryBasedOnTIS);

    await waitFor(() => render(<TaskListPage taskStatus="new" setError={() => { }} />));
    fireEvent.click(screen.getByRole('link', { name: /In progress/i }));

    await waitFor(() => expect(screen.getAllByText('Unclaim')).toHaveLength(1));
    await waitFor(() => expect(screen.queryByText('Claim')).not.toBeInTheDocument());
  });

  it('should render issued tasks with no claim buttons', async () => {
    mockAxios
      .onGet('/task/count')
      .reply(200, { count: 0 })
      .onGet('/task')
      .reply(200, [{}])
      .onGet('/process-instance/count')
      .reply(200, { count: 10 })
      .onGet('/process-instance')
      .reply(200, [
        { id: '123' },
        { id: '456' },
        { id: '789' },
      ])
      .onGet('/variable-instance')
      .reply(200, variableInstanceTaskSummaryBasedOnTIS);

    await waitFor(() => render(<TaskListPage taskStatus="new" setError={() => { }} />));
    fireEvent.click(screen.getByRole('link', { name: /Target issued/i }));

    await waitFor(() => expect(screen.getByText('Target issued tasks')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('Claim')).not.toBeInTheDocument());
  });

  it('should render complete tasks with no claim buttons', async () => {
    mockAxios
      .onGet('/task/count')
      .reply(200, { count: 0 })
      .onGet('/task')
      .reply(200, [{}])
      .onGet('/history/process-instance/count')
      .reply(200, { count: 10 })
      .onGet('/history/process-instance')
      .reply(200, [
        { id: '123' },
        { id: '456' },
        { id: '789' },
      ])
      .onGet('/history/variable-instance')
      .reply(200, variableInstanceTaskSummaryBasedOnTIS);

    await waitFor(() => render(<TaskListPage taskStatus="new" setError={() => { }} />));
    fireEvent.click(screen.getByRole('link', { name: /Complete/i }));

    await waitFor(() => expect(screen.getByText('Completed tasks')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('Claim')).not.toBeInTheDocument());
  });

  it('should display the first risk and a count of risks', async () => {
    mockAxios
      .onGet('/task/count')
      .reply(200, { count: 10 })
      .onGet('/task')
      .reply(200, [
        { processInstanceId: '123', assignee: null },
        { processInstanceId: '456', assignee: null },
        { processInstanceId: '789', assignee: null },
      ])
      .onGet('/variable-instance')
      .reply(200, variableInstanceTaskSummaryBasedOnTIS);

    await waitFor(() => render(<TaskListPage taskStatus="new" setError={() => { }} />));

    expect(screen.getAllByText('SELECTOR: Local ref, B, National Security at the Border and 2 other rules')).toHaveLength(1);
    expect(screen.getAllByText('Rulename, Tier 1, Class A Drugs and 0 other rules')).toHaveLength(1);
    expect(screen.getAllByText('SELECTOR: Local ref, B, National Security at the Border and 1 other rule')).toHaveLength(1);
  });

  it('should handle errors gracefully', async () => {
    mockAxios
      .onGet('/task/count')
      .reply(200, { count: 10 })
      .onGet('/task')
      .reply(500);

    await waitFor(() => render(<TaskListPage taskStatus="new" setError={() => { }} />));

    expect(screen.getByText('No tasks available')).toBeInTheDocument();
    expect(screen.queryByText('Request failed with status code 500')).toBeInTheDocument();
    expect(screen.queryByText('There is a problem')).toBeInTheDocument();
  });
});
