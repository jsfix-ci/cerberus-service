import React from 'react';
import { screen, render } from '@testing-library/react';

import TaskVersions from '../TaskDetails/TaskVersions';
import { taskSingleVersion, taskNoRulesMatch, taskFootPassengerSingleVersion, taskFootPassengersSingleVersion,
  taskSummaryBasedOnTISData, noVehicleSinglePaxTsBasedOnTISData,
  noVehicleTwoPaxTsBasedOnTISData } from '../__fixtures__/taskVersions';

describe('TaskVersions', () => {
  it('should render the selector with Highest threat level is Category', () => {
    render(<TaskVersions
      taskSummaryBasedOnTIS={taskSummaryBasedOnTISData}
      taskVersions={taskSingleVersion}
      taskVersionDifferencesCounts={[]}
      movementMode="RORO Unaccompanied Freight"
    />);
    expect(screen.queryByText('Category')).toBeInTheDocument();
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
  it('should render headers for RORO Tourist with vehicle', () => {
    render(<TaskVersions
      taskSummaryBasedOnTIS={taskSummaryBasedOnTISData}
      taskVersions={taskSingleVersion}
      taskVersionDifferencesCounts={[0]}
      movementMode="RORO Tourist"
    />);

    expect(screen.queryByText('Targeting indicators')).toBeInTheDocument();
    expect(screen.queryAllByText('Vehicle')).toHaveLength(2);
    expect(screen.queryByText('Booking and check-in')).toBeInTheDocument();
    expect(screen.queryByText('Occupants')).toBeInTheDocument();
    expect(screen.queryByText('Passengers')).toBeInTheDocument();
    expect(screen.queryByText('Driver')).toBeInTheDocument();
    expect(screen.queryByText('Goods')).not.toBeInTheDocument();
    expect(screen.queryByText('Haulier details')).not.toBeInTheDocument();
    expect(screen.queryByText('Account details')).not.toBeInTheDocument();
  });

  it('should render headers for RORO Tourist foot passenger', () => {
    render(<TaskVersions
      taskSummaryBasedOnTIS={noVehicleSinglePaxTsBasedOnTISData}
      taskVersions={taskFootPassengerSingleVersion}
      taskVersionDifferencesCounts={[0]}
      movementMode="RORO Tourist"
    />);

    expect(screen.queryByText('Targeting indicators')).toBeInTheDocument();
    expect(screen.queryByText('Booking and check-in')).toBeInTheDocument();
    expect(screen.queryByText('Primary Traveller')).toBeInTheDocument();
    expect(screen.queryByText('Single passenger')).toBeInTheDocument();
    expect(screen.queryByText('1 foot passenger')).toBeInTheDocument();
    expect(screen.queryByText('Occupants')).not.toBeInTheDocument();
    expect(screen.queryByText('Passengers')).not.toBeInTheDocument();
    expect(screen.queryByText('Driver')).not.toBeInTheDocument();
    expect(screen.queryByText('Goods')).not.toBeInTheDocument();
    expect(screen.queryByText('Haulier details')).not.toBeInTheDocument();
    expect(screen.queryByText('Account details')).not.toBeInTheDocument();
  });

  it('should render headers for RORO Tourist foot passengers', () => {
    render(<TaskVersions
      taskSummaryBasedOnTIS={noVehicleTwoPaxTsBasedOnTISData}
      taskVersions={taskFootPassengersSingleVersion}
      taskVersionDifferencesCounts={[0]}
      movementMode="RORO Tourist"
    />);

    expect(screen.queryByText('Targeting indicators')).toBeInTheDocument();
    expect(screen.queryByText('Primary Traveller')).toBeInTheDocument();
    expect(screen.queryByText('Document')).toBeInTheDocument();
    expect(screen.queryByText('Booking and check-in')).toBeInTheDocument();
    expect(screen.queryByText('Other travellers')).toBeInTheDocument();
    expect(screen.queryByText('Group')).toBeInTheDocument();
    expect(screen.queryByText('2 foot passengers')).toBeInTheDocument();
    expect(screen.queryByText('Occupants')).not.toBeInTheDocument();
    expect(screen.queryByText('Passengers')).not.toBeInTheDocument();
    expect(screen.queryByText('Driver')).not.toBeInTheDocument();
    expect(screen.queryByText('Goods')).not.toBeInTheDocument();
    expect(screen.queryByText('Haulier details')).not.toBeInTheDocument();
    expect(screen.queryByText('Account details')).not.toBeInTheDocument();
  });

  it('should render check-in relative time for RORO Tourist foot passengers', () => {
    render(<TaskVersions
      taskSummaryBasedOnTIS={noVehicleTwoPaxTsBasedOnTISData}
      taskVersions={taskFootPassengersSingleVersion}
      taskVersionDifferencesCounts={[0]}
      movementMode="RORO Tourist"
    />);

    expect(screen.queryByText('3 Aug 2020 at 12:05, a day after travel')).toBeInTheDocument();
  });

  it('should not render check-in relative time for RORO Tourist foot passengers', () => {
    render(<TaskVersions
      taskSummaryBasedOnTIS={noVehicleTwoPaxTsBasedOnTISData}
      taskVersions={taskFootPassengerSingleVersion}
      taskVersionDifferencesCounts={[0]}
      movementMode="RORO Tourist"
    />);

    expect(screen.queryAllByText('3 Aug 2020 at 12:05, a day after travel')).toHaveLength(0);
  });
});
