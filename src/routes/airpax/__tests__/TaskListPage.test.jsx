import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '../../../__mocks__/keycloakMock';

import { TaskSelectedTabContext } from '../../../context/TaskSelectedTabContext';
import TaskListPage from '../TaskLists/TaskListPage';

describe('TaskListPage', () => {
  const setTabAndTaskValues = (value, taskStatus = 'new') => {
    return (<TaskSelectedTabContext.Provider value={value}><TaskListPage taskStatus={taskStatus} /></TaskSelectedTabContext.Provider>);
  };

  let tabData = {};

  beforeEach(() => {
    tabData = {
      selectedTabIndex: 0,
      selectTabIndex: jest.fn(),
    };
  });

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
});
