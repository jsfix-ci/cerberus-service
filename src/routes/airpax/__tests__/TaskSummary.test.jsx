import React from 'react';
import { screen, render } from '@testing-library/react';

import TaskSummary from '../TaskDetails/TaskSummary';
import taskSummaryAirPaxData from '../__fixtures__/taskSummaryAirPaxData.fixture.json';
import airlineCodes from '../__fixtures__/taskData_Airpax_AirlineCodes.json';

// mock useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn().mockReturnValue({ taskId: 'taskId' }),
}));

describe('TaskSummary', () => {
  it('should render the summary section', () => {
    const { container } = render(<TaskSummary version={taskSummaryAirPaxData} airlineCodes={airlineCodes} />);
    expect(container.firstChild.classList[0]).toEqual('task-list--voyage-section');
  });

  it('should display flight time that arrived in the past', () => {
    render(
      <TaskSummary
        version={
          {
            ...taskSummaryAirPaxData,
            journey: {
              id: 'BA0103',
              arrival: {
                country: null,
                location: 'YYC',
                time: '2022-05-20T11:50:40Z',
              },
              departure: {
                country: null,
                location: 'LHR',
                time: '2022-07-10T12:30:01Z',
              },
              route: [
                'LHR',
                'YYC',
                'YYZ',
                'CDG',
              ],
              duration: -4408761000,
            },

          }
        }
        airlineCodes={airlineCodes}
      />,
    );

    expect(screen.getByText(/arrived at Calgary 2 months ago/i)).toBeInTheDocument();
  });
});
