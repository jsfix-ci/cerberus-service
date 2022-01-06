import React from 'react';
import { screen, render } from '@testing-library/react';

import TaskVersions from '../TaskDetails/TaskVersions';
import taskSingleVersion from '../__fixtures__/taskSingleVersionData.fixture.json';
import taskNoRulesMatchData from '../__fixtures__/taskNoRulesMatchData.fixture.json';

const taskSummaryBasedOnTISData = {
  parentBusinessKey: {
    businessKey: 'AUTOTEST-06-01-2022-CLAIM-TASK-MANAGEMENT_495516:CMID=TEST',
  },
  threatIndicators: [],
  category: 'target_B',
  eventPort: '',
  risks: [
    {
      contents: {
        groupNumber: '2020-6',
        requestingOfficer: 'Peter Price',
        sourceReference: 'intel source',
        groupReference: 'Local ref',
        category: 'B',
        threatType: 'National Security at the Border',
        pointOfContactMessage: 'Message for the POC',
        pointOfContact: 'poc',
        inboundActionCode: 'Advise originator',
        outboundActionCode: 'Full attention',
        warnings: 'Supplemental warnings',
        notes: 'Supplemental notes',
        creator: 'Joe Jones',
        selectorId: 6,
      },
      childSets: [],
    },
    {
      name: 'Paid by Cash',
      rulePriority: 'Tier 1',
      ruleVersion: 1,
      abuseType: 'National Security at the Border',
      agencyCode: '',
      description: 'Test',
      ruleId: 293,
    },
    {
      name: 'Paid by cash1',
      rulePriority: 'Tier 1',
      ruleVersion: 1,
      abuseType: 'Class A Drugs',
      agencyCode: '',
      description: 'Paid by cash',
      ruleId: 346,
    },
  ],
  numberOfVersions: 1,
  roro: {
    roroFreightType: 'unaccompanied',
    details: {
      movementStatus: 'Pre-Arrival',
      bookingDateTime: '202008041619,2020-08-05T14:00:00',
      vessel: {
        name: 'VALENTINE',
        company: 'COBELFRET FERRIES NV',
      },
      eta: '2020-08-02T14:30:00Z',
      departureTime: '2020-08-05T14:00:00Z',
      arrivalLocation: 'ARA',
      departureLocation: 'DAG',
      vehicle: {
        colour: '',
        model: '',
        make: '',
        registrationNumber: 'fg3478',
        type: 'TRL',
      },
      load: {
        manifestedLoad: 'car parts',
        manifestedWeight: '',
        countryOfDestination: '',
      },
      account: {
        name: 'IF Logistics',
        number: 'IF-123482',
      },
    },
  },
};

describe('TaskVersions', () => {
  it('should render the selector with Highest threat level is Category B', () => {
    render(<TaskVersions
      taskSummaryBasedOnTIS={taskSummaryBasedOnTISData}
      taskVersions={taskSingleVersion}
      taskVersionDifferencesCounts={[]}
      movementMode="RORO Unaccompanied Freight"
    />);
    expect(screen.queryByText('Category B')).toBeInTheDocument();
  });

  it('should render No rule matches', () => {
    render(<TaskVersions
      taskSummaryBasedOnTIS={taskSummaryBasedOnTISData}
      taskVersions={taskNoRulesMatchData}
      taskVersionDifferencesCounts={[0]}
      movementMode="RORO Accompanied Freight"
    />);
    expect(screen.queryByText('No rule matches')).toBeInTheDocument();
  });
});
