import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import '../../../__mocks__/keycloakMock';
// Components/Pages
import { TaskSelectedTabContext } from '../../../context/TaskSelectedTabContext';
import TaskListPage from '../TaskLists/TaskListPage';
// Fixture
import targetTask from '../__fixtures__/taskData_AirPax_AssigneeCurrentUser.fixture.json';

describe('TaskListPage', () => {
  const mockAxios = new MockAdapter(axios);

  let tabData = {};

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    tabData = {
      selectedTabIndex: 0,
      selectTabIndex: jest.fn(),
    };
    mockAxios.reset();
  });

  const setTabAndTaskValues = (value, taskStatus = 'new') => {
    return (<TaskSelectedTabContext.Provider value={value}><TaskListPage taskStatus={taskStatus} /></TaskSelectedTabContext.Provider>);
  };

  it('should render a message related to the tab clicked, on click', async () => {
    await waitFor(() => render(setTabAndTaskValues(tabData, 'new')));

    expect(screen.queryByText('You are not authorised to view these tasks.')).not.toBeInTheDocument();
    expect(screen.getByText('New')).toBeInTheDocument();
    expect(screen.getByText('Issued')).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText('There are no new tasks')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('Request failed with status code 404')).not.toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('There is a problem')).not.toBeInTheDocument());

    fireEvent.click(screen.getByRole('link', { name: /Issued/i }));
    await waitFor(() => expect(screen.getByText('There are no issued tasks')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('Request failed with status code 404')).not.toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('There is a problem')).not.toBeInTheDocument());

    fireEvent.click(screen.getByRole('link', { name: /In progress/i }));
    await waitFor(() => expect(screen.getByText('There are no inProgress tasks')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('Request failed with status code 404')).not.toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('There is a problem')).not.toBeInTheDocument());

    fireEvent.click(screen.getByRole('link', { name: /Complete/i }));
    await waitFor(() => expect(screen.getByText('There are no complete tasks')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('Request failed with status code 404')).not.toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('There is a problem')).not.toBeInTheDocument());
  });

  it('should render a target task on the task list page', async () => {
    mockAxios
      .onPost('/targeting-tasks/pages')
      .reply(200, [targetTask]);

    await waitFor(() => render(setTabAndTaskValues(tabData, 'new')));

    expect(screen.getByText('Single passenger')).toBeInTheDocument();
    expect(screen.getByText('DC')).toBeInTheDocument();
    expect(screen.getByText('British Airways, flight BA103, arrival Unknown')).toBeInTheDocument();
    expect(screen.getByText('BA103')).toBeInTheDocument();
    expect(screen.getByText(/7 Aug 2020/)).toBeInTheDocument();
    expect(screen.getAllByText(/FRA/)).toHaveLength(2);
    expect(screen.getAllByText('LHR')).toHaveLength(2);

    expect(screen.getAllByText(/Passenger/i)).toHaveLength(3);
    expect(screen.getByText('Document')).toBeInTheDocument();
    expect(screen.getByText('Booking')).toBeInTheDocument();
    expect(screen.getByText('Co-travellers')).toBeInTheDocument();
    expect(screen.getByText('Route')).toBeInTheDocument();

    expect(screen.getByText(/FORD/)).toBeInTheDocument();
    expect(screen.getByText(/Isaiah/)).toBeInTheDocument();
    expect(screen.getByText(/Male/)).toBeInTheDocument();
    expect(screen.getByText(/13 May 1966/)).toBeInTheDocument();
    expect(screen.getByText('Route')).toBeInTheDocument();
    expect(screen.getByText(/1 checked bag\(s\)/)).toBeInTheDocument();
    expect(screen.getByText(/Valid from Unknown/)).toBeInTheDocument();
    expect(screen.getByText(/Expires Unknown/)).toBeInTheDocument();
    expect(screen.getByText(/Issued by Unknown/)).toBeInTheDocument();
  });
});
