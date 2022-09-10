import React from 'react';
import { screen, render } from '@testing-library/react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { ApplicationContext } from '../../../../context/ApplicationContext';

import TaskSummary from './TaskSummary';
import taskSummaryAirPaxData from '../../../../__fixtures__/taskSummaryAirPaxData.fixture.json';
import refDataAirlineCodes from '../../../../__fixtures__/airpax-airline-codes.json';

// mock useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn().mockReturnValue({ taskId: 'taskId' }),
}));

describe('TaskSummary', () => {
  dayjs.extend(utc);

  const MockApplicationContext = ({ children }) => (
    <ApplicationContext.Provider value={{ refDataAirlineCodes: jest.fn().mockReturnValue(refDataAirlineCodes) }}>
      {children}
    </ApplicationContext.Provider>
  );

  it('should render the summary section', () => {
    const { container } = render(
      <MockApplicationContext>
        <TaskSummary
          version={taskSummaryAirPaxData}
        />
      </MockApplicationContext>,
    );
    expect(container.firstChild.classList[0]).toEqual(
      'task-list--voyage-section',
    );
  });

  it('should display flight time that arrived in the past', () => {
    taskSummaryAirPaxData.movement.journey = {
      id: 'BA0103',
      arrival: {
        country: null,
        location: 'YYC',
        time: dayjs.utc().subtract(3, 'month').format(),
      },
      departure: {
        country: null,
        location: 'LHR',
        time: '2022-07-10T12:30:01Z',
      },
      route: ['LHR', 'YYC', 'YYZ', 'CDG'],
      duration: -4408761000,
    };

    render(
      <MockApplicationContext>
        <TaskSummary
          version={{
            ...taskSummaryAirPaxData,
          }}
        />
      </MockApplicationContext>,
    );

    expect(
      screen.getByText(/arrived at Calgary 3 months ago/i),
    ).toBeInTheDocument();
  });

  it('should display flight time arriving in the present/ future', () => {
    const time = dayjs.utc().add(1, 'month').format();
    taskSummaryAirPaxData.movement.journey = {
      id: 'BA0103',
      arrival: {
        country: null,
        location: 'YYC',
        time,
      },
      departure: {
        country: null,
        location: 'LHR',
        time: '2022-07-10T12:30:01Z',
      },
      route: ['LHR', 'YYC', 'YYZ', 'CDG'],
      duration: -4408761000,
    };
    render(
      <MockApplicationContext>
        <TaskSummary
          version={{
            ...taskSummaryAirPaxData,
          }}
        />
      </MockApplicationContext>,
    );

    expect(
      screen.getByText(/arrival at Calgary in a month/i),
    ).toBeInTheDocument();
  });
});
