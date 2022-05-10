import React from 'react';
import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import TaskVersions from '../TaskDetails/TaskVersions';

import { LONDON_TIMEZONE } from '../../../constants';
import taskDetailsData from '../__fixtures__/taskData_AirPax_TaskDetails.fixture.json';
import airlineCodes from '../__fixtures__/taskData_Airpax_AirlineCodes.json';

import config from '../../../config';

describe('TaskVersions', () => {
  beforeEach(() => {
    config.dayjsConfig.timezone = LONDON_TIMEZONE;
  });

  const mockTaskVersionsWithRuleThreat = [
    {
      number: 1,
      createdAt: '2022-04-20T12:17:45.259425Z',
      movement: {},
      risks: {
        targetingIndicators: {},
        matchedRules: [],
        matchedSelectorGroups: {},
        highestThreatLevel: {
          type: 'RULE',
          value: 'Tier 4',
        },
      },
    },
  ];

  const mockTaskVersionsWithSelectorThreat = [
    {
      number: 2,
      createdAt: '2022-05-20T10:26:03.232421Z',
      movement: {},
      risks: {
        targetingIndicators: {},
        matchedRules: [],
        matchedSelectorGroups: {},
        highestThreatLevel: {
          type: 'SELECTOR',
          value: 'A',
        },
      },
    },
  ];

  const mockTaskVersionsWithNoThreat = [
    {
      number: 2,
      createdAt: '2022-05-20T10:26:03.232421Z',
      movement: {},
      risks: {
        targetingIndicators: {},
        matchedRules: [],
        matchedSelectorGroups: {},
        highestThreatLevel: null,
      },
    },
    {
      number: 3,
      createdAt: '2022-05-20T10:26:03.232421Z',
      movement: {},
      risks: {
        targetingIndicators: {},
        matchedRules: [],
        matchedSelectorGroups: {},
        highestThreatLevel: null,
      },
    },
  ];

  it('should render task versions and rule threat level', () => {
    render(<TaskVersions taskVersions={mockTaskVersionsWithRuleThreat} airlineCodes={airlineCodes} />);
    expect(screen.getByText('Version 1 (latest)')).toBeInTheDocument();
    expect(screen.getByText('Tier 4')).toBeInTheDocument();
  });

  it('should render task versions and selector threat level', () => {
    render(<TaskVersions taskVersions={mockTaskVersionsWithSelectorThreat} airlineCodes={airlineCodes} />);
    expect(screen.getByText('Version 2 (latest)')).toBeInTheDocument();
    expect(screen.getByText('Category A')).toBeInTheDocument();
  });

  it('should render task versions with no rule matches text', () => {
    render(<TaskVersions taskVersions={mockTaskVersionsWithNoThreat} airlineCodes={airlineCodes} />);
    expect(screen.getByText('Version 2 (latest)')).toBeInTheDocument();
    expect(screen.getAllByText('No rule matches')).toHaveLength(2);
  });

  it('should render task versions', () => {
    const tree = renderer.create(
      <TaskVersions taskVersions={[taskDetailsData.versions[0]]} airlineCodes={airlineCodes} />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
