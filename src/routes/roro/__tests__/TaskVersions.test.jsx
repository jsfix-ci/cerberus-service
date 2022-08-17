import React from 'react';
import { screen, render } from '@testing-library/react';
import ReactDOMServer from 'react-dom/server';
import { RORO_UNACCOMPANIED_FREIGHT } from '../../../constants';

import { TaskVersions, sortRulesByThreat } from '../TaskDetails/TaskVersions';
import { taskSingleVersion, taskNoRulesMatch, taskFootPassengerSingleVersion, taskFootPassengersSingleVersion,
  taskSummaryBasedOnTISData, noVehicleSinglePaxTsBasedOnTISData,
  noVehicleTwoPaxTsBasedOnTISData, taskVersionNoRuleMatches, taskVersionWithRules,
  taskWithThreeVersions } from '../__fixtures__/taskVersions';

import {
  renderOccupantCarrierCountsSection,
} from '../TaskDetails/TaskVersionsMode/SectionRenderer';

import {
  noDriverNoPaxNoCategoryCounts,
} from '../__fixtures__/section-renderer/sectionRendererTaskDetails';

describe('TaskVersions', () => {
  it('should render the selector with Highest threat Category level', () => {
    render(<TaskVersions
      taskSummaryBasedOnTIS={taskSummaryBasedOnTISData}
      taskVersions={taskSingleVersion}
      taskVersionDifferencesCounts={[]}
      movementMode="RORO Unaccompanied Freight"
    />);
    expect(screen.queryAllByText('Category B')).toHaveLength(1);
  });

  it('should render No rule matches', () => {
    render(<TaskVersions
      taskSummaryBasedOnTIS={taskSummaryBasedOnTISData}
      taskVersions={taskNoRulesMatch}
      taskVersionDifferencesCounts={[0]}
      movementMode="RORO Accompanied Freight"
    />);
    expect(screen.queryByText('No rule matches')).toBeInTheDocument();
    expect(screen.queryAllByText(/Category/)).toHaveLength(0);
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
    expect(screen.queryByText('Occupants')).toBeInTheDocument();
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
    expect(screen.queryByText('Occupants')).toBeInTheDocument();
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

    expect(screen.queryByText('3 Aug 2020 at 12:05, 2 days before travel')).toBeInTheDocument();
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
      taskVersionDifferencesCounts={[32, 6, 0]}
      movementMode="RORO Unaccompanied Freight"
    />);

    expect(screen.queryByText('Tier 1')).toBeInTheDocument();
  });

  it('should have a version where check-in has been updated and has highlight class', () => {
    render(<TaskVersions
      taskSummaryBasedOnTIS={noVehicleTwoPaxTsBasedOnTISData}
      taskVersions={taskWithThreeVersions}
      taskVersionDifferencesCounts={[1, 0]}
      movementMode="RORO Accompanied Freight"
    />);

    const element = screen.getAllByText(/Check-in/);

    expect(element[1]).toHaveAttribute('class', 'govuk-grid-key font__light task-versions--highlight');
  });

  it('should render version date for one version', () => {
    render(<TaskVersions
      taskSummaryBasedOnTIS={taskSummaryBasedOnTISData}
      taskVersions={taskSingleVersion}
      taskVersionDifferencesCounts={[]}
      movementMode="RORO Unaccompanied Freight"
    />);

    expect(screen.queryAllByText('9 Feb 2022 at 17:03')).toHaveLength(1);
  });

  it('should render version date for all versions', () => {
    render(<TaskVersions
      taskSummaryBasedOnTIS={noVehicleTwoPaxTsBasedOnTISData}
      taskVersions={taskWithThreeVersions}
      taskVersionDifferencesCounts={[1, 0]}
      movementMode="RORO Accompanied Freight"
    />);

    expect(screen.queryAllByText('9 Feb 2022 at 17:03')).toHaveLength(1);
    expect(screen.queryAllByText('10 Feb 2022 at 17:03')).toHaveLength(1);
    expect(screen.queryAllByText('11 Feb 2022 at 17:03')).toHaveLength(1);
  });

  it('should not render the thrid column containing the driver and pax details for RorouUnaccompanied freight', () => {
    const driverField = noDriverNoPaxNoCategoryCounts.find(({ propName }) => propName === 'driver');
    const passengersField = noDriverNoPaxNoCategoryCounts.find(({ propName }) => propName === 'passengers');
    const passengersMetadata = noDriverNoPaxNoCategoryCounts.find(({ propName }) => propName === 'occupants');

    const section = renderOccupantCarrierCountsSection(driverField, passengersField, passengersMetadata, RORO_UNACCOMPANIED_FREIGHT);

    expect(ReactDOMServer.renderToString(section)).toEqual(ReactDOMServer.renderToString(''));
  });

  it('should render table headers when rules matched data is present', () => {
    const expected = ['Entity type', 'Attribute', 'Operator', 'Value (s)'];

    const { container } = render(<TaskVersions
      taskSummaryBasedOnTIS={taskSummaryBasedOnTISData}
      taskVersions={taskSingleVersion}
      taskVersionDifferencesCounts={[0]}
      movementMode="RORO Accompanied Freight"
    />);

    const rulesMatchedElement = container.querySelectorAll('.govuk-table__header');
    for (let i = 0; i < expected.length - 1; i += 1) {
      expect(rulesMatchedElement[i].textContent).toEqual(expected[i]);
    }
  });
});
