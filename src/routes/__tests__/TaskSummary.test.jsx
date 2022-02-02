import React from 'react';
import { screen, render } from '@testing-library/react';

import TaskSummary from '../TaskDetails/TaskSummary';
// import { testInputDataFieldsEmpty } from '../../utils/__fixtures__/taskSummaryData.fixture';
import taskSummaryData from '../__fixtures__/taskSummaryData.fixture.json';
import { RORO_ACCOMPANIED_FREIGHT } from '../../constants';

// mock useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn().mockReturnValue({ taskId: 'taskId' }),
}));

describe('TaskSummary', () => {
  it('should render the summary section', () => {
    const { container } = render(<TaskSummary movementMode={RORO_ACCOMPANIED_FREIGHT} taskSummaryData={taskSummaryData} />);
    expect(container.firstChild.classList.contains('card')).toBe(true);
  });

  it('should display Vehicle & trailer & driver titles when data contains them', () => {
    render(
      <TaskSummary
        movementMode={RORO_ACCOMPANIED_FREIGHT}
        taskSummaryData={
          {
            ...taskSummaryData,
            vehicle: {
              registrationNumber: 'DF7565LK',
              trailer: {
                regNumber: 'NL-234-392',
              },
            },
          }
        }
      />,
    );

    expect(screen.getByText(/Vehicle with trailer/i)).toBeInTheDocument();
    expect(screen.getByText(/DF7565LK/i)).toBeInTheDocument();
    expect(screen.getByText(/NL-234-392/i)).toBeInTheDocument();
  });

  it('should display Vehicle only when data contains trailers but no vehicle or driver', () => {
    render(
      <TaskSummary
        movementMode={RORO_ACCOMPANIED_FREIGHT}
        taskSummaryData={
          {
            ...taskSummaryData,
            vehicle: {
              trailer: {
                regNumber: 'NL-234-392',
              },
            },
          }
        }
      />,
    );

    expect(screen.getByText(/Trailer/)).toBeInTheDocument();
  });
});
