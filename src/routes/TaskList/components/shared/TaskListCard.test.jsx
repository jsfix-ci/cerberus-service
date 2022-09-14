import React from 'react';
import { render, screen } from '@testing-library/react';

import { ApplicationContext } from '../../../../context/ApplicationContext';

import TaskListCard from './TaskListCard';

import { TASK_STATUS } from '../../../../utils/constants';

import targetTask from '../../../../__fixtures__/targetListData';
import mockRoRoTargetTask from '../../../../__fixtures__/taskData_RoRo_Accompanied_AssigneeCurrentUser.fixture.json';
import refDataAirlineCodes from '../../../../__fixtures__/airpax-airline-codes.json';

describe('TaskListCard', () => {
  const MockApplicationContext = ({ children }) => (
    <ApplicationContext.Provider value={{ refDataAirlineCodes: jest.fn().mockReturnValue(refDataAirlineCodes) }}>
      {children}
    </ApplicationContext.Provider>
  );

  it('should render the task list card for an airpax target task', () => {
    render(
      <MockApplicationContext>
        <TaskListCard
          targetTask={targetTask}
          taskStatus={TASK_STATUS.NEW}
          currentUser="test"
          redirectPath="/test/path"
        />
      </MockApplicationContext>,
    );
    expect(screen.getByText('DEV-20220419-001')).toBeInTheDocument();
    expect(screen.getByText('Single passenger')).toBeInTheDocument();
    expect(screen.getByText('DC')).toBeInTheDocument();
    expect(screen.getByText('British Airways, flight BA103, Unknown')).toBeInTheDocument();
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
    expect(screen.getByText(/1 checked bag/)).toBeInTheDocument();
    expect(screen.getByText(/Valid from Unknown/)).toBeInTheDocument();
    expect(screen.getByText(/Expires Unknown/)).toBeInTheDocument();
    expect(screen.getByText(/Issued by Unknown/)).toBeInTheDocument();
  });

  it('should render the task list card for a roro target task', () => {
    render(
      <MockApplicationContext>
        <TaskListCard
          targetTask={mockRoRoTargetTask}
          taskStatus={TASK_STATUS.NEW}
          currentUser="test"
          redirectPath="/test/path"
        />
      </MockApplicationContext>,
    );
    expect(screen.getByText('DEV-20220809-1566')).toBeInTheDocument();
    expect(screen.getAllByText(/GB09NFD/)).toHaveLength(2);
    expect(screen.getByText('Driver details')).toBeInTheDocument();
    expect(screen.getByText('Passenger details')).toBeInTheDocument();
    expect(screen.getByText('Vehicle details')).toBeInTheDocument();
    expect(screen.getByText('Trailer details')).toBeInTheDocument();
    expect(screen.getByText('Haulier details')).toBeInTheDocument();
    expect(screen.getByText('Account details')).toBeInTheDocument();
    expect(screen.getByText('Goods description')).toBeInTheDocument();
    expect(screen.getByText('View details')).toBeInTheDocument();
  });
});
