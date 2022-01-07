import React from 'react';
import { screen, render } from '@testing-library/react';

import TaskVersions from '../TaskDetails/TaskVersions';
import { taskSingleVersion, taskNoRulesMatch, taskSummaryBasedOnTISData } from '../__fixtures__/taskVersions';

describe('TaskVersions', () => {
  it('should render the selector with Highest threat level is Category', () => {
    render(<TaskVersions
      taskSummaryBasedOnTIS={taskSummaryBasedOnTISData}
      taskVersions={taskSingleVersion}
      taskVersionDifferencesCounts={[]}
      movementMode="RORO Unaccompanied Freight"
    />);
    expect(screen.queryByText(/Category/)).toBeInTheDocument();
  });

  it('should render No rule matches', () => {
    render(<TaskVersions
      taskSummaryBasedOnTIS={taskSummaryBasedOnTISData}
      taskVersions={taskNoRulesMatch}
      taskVersionDifferencesCounts={[0]}
      movementMode="RORO Accompanied Freight"
    />);
    expect(screen.queryByText('No rule matches')).toBeInTheDocument();
    expect(screen.queryByText(/Category/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Tier/)).not.toBeInTheDocument();
  });
});
