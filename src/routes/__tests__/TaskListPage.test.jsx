import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '../../__mocks__/keycloakMock';
import TaskListPage from '../TaskLists/TaskListPage';
import variableInstanceTaskSummaryBasedOnTIS from '../__fixtures__/variableInstanceTaskSummaryBasedOnTIS.fixture.json';
import { TaskSelectedTabContext } from '../../context/TaskSelectedTabContext';

describe('TaskListPage', () => {
  const mockAxios = new MockAdapter(axios);
  const envUrl = `${window.location.protocol}//${window.location.hostname}`;
  const tabData = {
    selectedTabIndex: 1,
    selectTabIndex: jest.fn(),
  };

  const setTabAndTaskValues = (value = tabData, taskStatus = 'new') => {
    return (<TaskSelectedTabContext.Provider value={value}><TaskListPage taskStatus={taskStatus} setError={() => { }} /></TaskSelectedTabContext.Provider>);
  };

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    mockAxios.reset();
  });

  it('should render loading spinner on component load', async () => {
    render(setTabAndTaskValues(tabData, 'new'));
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('should render counts in tab name', async () => {
    mockAxios
      .onGet('/task')
      .reply(200, [])
      .onGet('/task/count')
      .reply(200, { count: 7 })
      .onGet('/process-instance')
      .reply(200, [])
      .onGet('/process-instance/count')
      .reply(200, { count: 5 })
      .onGet('/variable-instance')
      .reply(200, [])
      .onGet('/history/process-instance')
      .reply(200, [])
      .onGet('/history/process-instance/count')
      .reply(200, { count: 0 })
      .onGet('/history/variable-instance')
      .reply(200, []);

    await waitFor(() => render(setTabAndTaskValues(tabData, 'new')));

    expect(screen.queryByText('You are not authorised to view these tasks.')).not.toBeInTheDocument();
    expect(screen.getByText('New (7)')).toBeInTheDocument();
    expect(screen.getByText('Issued (5)')).toBeInTheDocument();
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

    await waitFor(() => render(setTabAndTaskValues(tabData, 'new')));

    expect(screen.queryByText('You are not authorised to view these tasks.')).not.toBeInTheDocument();
    expect(screen.getByText('New (0)')).toBeInTheDocument();
    expect(screen.getByText('Issued (0)')).toBeInTheDocument();

    expect(screen.getByText('No tasks available')).toBeInTheDocument();
    expect(screen.queryByText('Request failed with status code 404')).not.toBeInTheDocument();
    expect(screen.queryByText('There is a problem')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('link', { name: /Issued/i }));
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

  it('should render each "View details" link per task', async () => {
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

    await waitFor(() => render(setTabAndTaskValues(tabData, 'new')));

    await waitFor(() => expect(screen.getAllByText('View details')[0].href).toBe(`${envUrl}/tasks/business:key=a_b_c`));
    await waitFor(() => expect(screen.getAllByText('View details')[1].href).toBe(`${envUrl}/tasks/business:key=d_e_f`));
    await waitFor(() => expect(screen.getAllByText('View details')[2].href).toBe(`${envUrl}/tasks/ghi`));

    fireEvent.click(screen.getByRole('link', { name: /Issued/i }));
    await waitFor(() => expect(screen.getAllByText('View details')[0].href).toBe(`${envUrl}/tasks/business:key=a_b_c`));
    await waitFor(() => expect(screen.getAllByText('View details')[1].href).toBe(`${envUrl}/tasks/business:key=d_e_f`));
    await waitFor(() => expect(screen.getAllByText('View details')[2].href).toBe(`${envUrl}/tasks/ghi`));

    fireEvent.click(screen.getByRole('link', { name: /In progress/i }));
    await waitFor(() => expect(screen.getAllByText('View details')[0].href).toBe(`${envUrl}/tasks/business:key=a_b_c`));
    await waitFor(() => expect(screen.getAllByText('View details')[1].href).toBe(`${envUrl}/tasks/business:key=d_e_f`));
    await waitFor(() => expect(screen.getAllByText('View details')[2].href).toBe(`${envUrl}/tasks/ghi`));
  });

  it('should render links to tasks when completed tasks exists', async () => {
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

    await waitFor(() => render(setTabAndTaskValues(tabData, 'new')));

    fireEvent.click(screen.getByRole('link', { name: /Complete/i }));
    await waitFor(() => expect(screen.getAllByText('View details')[0].href).toBe(`${envUrl}/tasks/business:key=a_b_c`));
    await waitFor(() => expect(screen.getAllByText('View details')[1].href).toBe(`${envUrl}/tasks/business:key=d_e_f`));
    await waitFor(() => expect(screen.getAllByText('View details')[2].href).toBe(`${envUrl}/tasks/ghi`));
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

    await waitFor(() => render(setTabAndTaskValues(tabData, 'new')));

    expect(screen.getAllByText('Claim task')).toHaveLength(3);
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

    await waitFor(() => render(setTabAndTaskValues(tabData, 'new')));

    fireEvent.click(screen.getByRole('link', { name: /In progress/i }));

    await waitFor(() => expect(screen.getAllByText('Unclaim task')).toHaveLength(1));
    await waitFor(() => expect(screen.queryByText('Claim task')).not.toBeInTheDocument());
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

    await waitFor(() => render(setTabAndTaskValues(tabData, 'new')));

    fireEvent.click(screen.getByRole('link', { name: /Issued/i }));

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

    await waitFor(() => render(setTabAndTaskValues(tabData, 'new')));

    fireEvent.click(screen.getByRole('link', { name: /Complete/i }));

    await waitFor(() => expect(screen.getByText('Completed tasks')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('Claim')).not.toBeInTheDocument());
  });

  it('should display the first risk and a count of risks & handle empty arrays', async () => {
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

    await waitFor(() => render(setTabAndTaskValues(tabData, 'new')));

    expect(screen.getAllByText('SELECTOR: Local ref, B, National Security at the Border and 2 other rules')).toHaveLength(1);
    expect(screen.getAllByText('Rulename, Tier 1, Class A Drugs and 0 other rules')).toHaveLength(1);
  });

  it('should display a count and list of targeting indicators', async () => {
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

    await waitFor(() => render(setTabAndTaskValues(tabData, 'new')));

    expect(screen.getAllByText('2 indicators')).toHaveLength(1);
    expect(screen.getAllByText('Paid by cash')).toHaveLength(1);
    expect(screen.getAllByText('Late booking tourist (24-72 hours)')).toHaveLength(1);
  });

  it('should calculate total risk score', async () => {
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

    await waitFor(() => render(setTabAndTaskValues(tabData, 'new')));

    expect(screen.getAllByText('Risk Score: 25')).toHaveLength(1);
  });

  it('should render updated on task where numberOfVersions is greater than 1', async () => {
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

    await waitFor(() => render(setTabAndTaskValues(tabData, 'new')));

    expect(screen.getAllByText('Updated')).toHaveLength(1);
  });

  it('should handle errors gracefully', async () => {
    mockAxios
      .onGet('/task/count')
      .reply(200, { count: 10 })
      .onGet('/task')
      .reply(500);

    await waitFor(() => render(setTabAndTaskValues(tabData, 'new')));

    expect(screen.getByText('No tasks available')).toBeInTheDocument();
    expect(screen.queryByText('Request failed with status code 500')).toBeInTheDocument();
    expect(screen.queryByText('There is a problem')).toBeInTheDocument();
  });

  it('should handle count errors gracefully', async () => {
    mockAxios
      .onGet('/task/count')
      .reply(500);

    await waitFor(() => render(setTabAndTaskValues(tabData, 'new')));

    expect(screen.getByText('No tasks available')).toBeInTheDocument();
    expect(screen.queryByText('Request failed with status code 500')).toBeInTheDocument();
    expect(screen.queryByText('There is a problem')).toBeInTheDocument();
  });
});
