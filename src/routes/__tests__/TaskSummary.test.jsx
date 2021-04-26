import React from 'react';
import { screen, render } from '@testing-library/react';

import TaskSummary from '../TaskDetails/TaskSummary';
import { testInputDataFieldsEmpty } from '../../utils/__tests__/taskDataTestSummaryFixtures';

// mock useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn().mockReturnValue({ taskId: 'taskId' }),
}));

describe('TaskSummary', () => {
  it('should render the summary section', () => {
    const { container } = render(<TaskSummary taskSummaryData={testInputDataFieldsEmpty} />);
    expect(container.firstChild.classList.contains('card')).toBe(true);
  });

  it('should display Vehicle & trailer & driver titles when data contains them', () => {
    render(
      <TaskSummary
        taskSummaryData={
          {
            ...testInputDataFieldsEmpty,
            vehicles: [
              { registrationNumber: 'GB09KLT' },
              { registrationNumber: 'GB09KLT' },
            ],
            trailers: [
              { registrationNumber: 'NL-234-392' },
            ],
            people: [
              {
                fullName: 'Bob Brown',
                role: 'DRIVER',
              },
            ],
          }
        }
      />,
    );

    expect(screen.getByText(/Vehicle with trailer/i)).toBeInTheDocument();
    expect(screen.getByText(/GB09KLT/i)).toBeInTheDocument();
    expect(screen.getByText(/NL-234-392/i)).toBeInTheDocument();
    expect(screen.getByText(/Bob Brown/i)).toBeInTheDocument();
  });

  it('should display Vehicle only when data contains trailers but no vehicle or driver', () => {
    render(
      <TaskSummary
        taskSummaryData={
          {
            ...testInputDataFieldsEmpty,
            trailers: [
              { registrationNumber: 'NL-234-392' },
            ],
          }
        }
      />,
    );

    expect(screen.getByText(/Trailer/)).toBeInTheDocument();
  });
});
