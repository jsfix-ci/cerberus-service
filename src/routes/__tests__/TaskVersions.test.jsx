import React from 'react';
import { screen, render } from '@testing-library/react';

import { TaskVersions, sortRulesByThreat } from '../TaskDetails/TaskVersions';
import { taskSingleVersion, taskNoRulesMatch, taskFootPassengerSingleVersion, taskFootPassengersSingleVersion,
  taskSummaryBasedOnTISData, noVehicleSinglePaxTsBasedOnTISData,
  noVehicleTwoPaxTsBasedOnTISData, taskVersionNoRuleMatches, taskVersionWithRules } from '../__fixtures__/taskVersions';

describe('TaskVersions', () => {
  it('should render the selector with Highest threat Category level', () => {
    render(<TaskVersions
      taskSummaryBasedOnTIS={taskSummaryBasedOnTISData}
      taskVersions={taskSingleVersion}
      taskVersionDifferencesCounts={[]}
      movementMode="RORO Unaccompanied Freight"
    />);
    expect(screen.queryByText('Category')).toBeInTheDocument();
    expect(screen.queryByText('B')).toBeInTheDocument();
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
    expect(screen.queryAllByText('Vehicle')).toHaveLength(3);
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

  it('should render rule matches with risk indicators', () => {
    render(<TaskVersions
      taskSummaryBasedOnTIS={taskSummaryBasedOnTISData}
      taskVersions={taskSingleVersion}
      taskVersionDifferencesCounts={[0]}
      movementMode="RORO Tourist"
    />);
    expect(screen.queryByText('Rules matched')).toBeInTheDocument();
    expect(screen.queryByText('Paid by Cash')).toBeInTheDocument();
    expect(screen.queryByText('Risk indicators (2)')).toBeInTheDocument();
    expect(screen.queryByText('Vehicle is empty')).toBeInTheDocument();
    expect(screen.queryByText('Mode')).toBeInTheDocument();

    expect(screen.queryByText('Other rule matches (1)')).toBeInTheDocument();
    expect(screen.queryByText('Paid by cash1')).toBeInTheDocument();
    expect(screen.queryByText('Risk indicators (0)')).toBeInTheDocument();
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

  it('should return sorted Rules by threat level', () => {
    const rulesArray = [
      {
        fieldSetName: '',
        hasChildSet: true,
        contents: [
          {
            fieldName: 'Priority',
            type: 'STRING',
            content: 'Tier 3',
            versionLastUpdated: null,
            propName: 'rulePriority',
          },
        ],
        childSets: [],
        type: 'STANDARD',
        propName: '',
      },
      {
        fieldSetName: '',
        hasChildSet: true,
        contents: [
          {
            fieldName: 'Priority',
            type: 'STRING',
            content: 'Tier 1',
            versionLastUpdated: null,
            propName: 'rulePriority',
          },
        ],
        childSets: [],
        type: 'STANDARD',
        propName: '',
      },
    ];
    const defaultFirstPosition = rulesArray[0].contents.find(({ propName }) => propName === 'rulePriority').content;
    expect(defaultFirstPosition).toBe('Tier 3');

    const sortedRules = sortRulesByThreat(rulesArray);
    const sortedFirstPosition = sortedRules[0].contents.find(({ propName }) => propName === 'rulePriority').content;
    expect(sortedFirstPosition).toBe('Tier 1');
    expect(sortedRules).toHaveLength(2);
  });

  it('should return "No rule matches" if there are no selectors and rules', () => {
    render(<TaskVersions
      taskSummaryBasedOnTIS={noVehicleTwoPaxTsBasedOnTISData}
      taskVersions={taskVersionNoRuleMatches}
      taskVersionDifferencesCounts={[1, 0]}
      movementMode="RORO Unaccompanied Freight"
    />);

    expect(screen.queryByText('No rule matches')).toBeInTheDocument();
  });

  it('should return the highest rule for rule array sorted by threat level', () => {
    render(<TaskVersions
      taskSummaryBasedOnTIS={noVehicleTwoPaxTsBasedOnTISData}
      taskVersions={taskVersionWithRules}
      taskVersionDifferencesCounts={[1, 0]}
      movementMode="RORO Unaccompanied Freight"
    />);

    expect(screen.queryByText('Tier 1')).toBeInTheDocument();
  });
});