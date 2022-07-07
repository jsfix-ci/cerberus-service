import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import renderer from 'react-test-renderer';
import TaskVersions from '../TaskDetails/TaskVersions';
import { TaskSelectedTabContext } from '../../../context/TaskSelectedTabContext';

import { LONDON_TIMEZONE } from '../../../constants';
import taskDetailsData from '../__fixtures__/taskData_AirPax_TaskDetails.fixture.json';
import airlineCodes from '../__fixtures__/taskData_Airpax_AirlineCodes.json';

import config from '../../../config';

describe('TaskVersions', () => {
  const mockAxios = new MockAdapter(axios);

  let tabData = {};

  beforeEach(() => {
    config.dayjsConfig.timezone = LONDON_TIMEZONE;
    tabData = { selectedTabIndex: 0,
      selectTabIndex: jest.fn(),
      taskManagementTabIndex: 0,
      selectTaskManagementTabIndex: jest.fn() };
  });

  const setTabAndTaskValues = (taskVersions, selectTabData, businessKey = 'BK-123', taskVersionDifferencesCounts = 0) => {
    return (
      <TaskSelectedTabContext.Provider value={selectTabData}>
        <TaskVersions
          taskVersions={taskVersions}
          businessKey={businessKey}
          taskVersionDifferencesCounts={taskVersionDifferencesCounts}
          airlineCodes={airlineCodes}
        />
      </TaskSelectedTabContext.Provider>
    );
  };

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

  it('should render PNR Data tab in version accordion', () => {
    render(setTabAndTaskValues(mockTaskVersionsWithRuleThreat, tabData));
    expect(screen.getByText('PNR Data')).toBeInTheDocument();
  });

  it('should render task versions and rule threat level', () => {
    render(setTabAndTaskValues(mockTaskVersionsWithRuleThreat, tabData));
    expect(screen.getByText('Version 1 (latest)')).toBeInTheDocument();
    expect(screen.getByText('Tier 4')).toBeInTheDocument();
  });

  it('should render task versions and selector threat level', () => {
    render(setTabAndTaskValues(mockTaskVersionsWithSelectorThreat, tabData));
    expect(screen.getByText('Version 2 (latest)')).toBeInTheDocument();
    expect(screen.getByText('Category A')).toBeInTheDocument();
  });

  it('should render task versions with no rule matches text', () => {
    render(setTabAndTaskValues(mockTaskVersionsWithNoThreat, tabData));
    expect(screen.getByText('Version 2 (latest)')).toBeInTheDocument();
    expect(screen.getAllByText('No rule matches')).toHaveLength(2);
  });

  it('should render the document section from version', async () => {
    await waitFor(() => render(setTabAndTaskValues([taskDetailsData.versions[0]], tabData)));
    expect(screen.getAllByText('Document')).toHaveLength(5);
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Number')).toBeInTheDocument();
    expect(screen.getByText('Document nationality')).toBeInTheDocument();
    expect(screen.getByText('Country of issue')).toBeInTheDocument();
    expect(screen.getByText('Valid from')).toBeInTheDocument();
  });

  it('should render the baggage section from version', () => {
    render(setTabAndTaskValues([taskDetailsData.versions[0]], tabData));
    expect(screen.getByText('Baggage')).toBeInTheDocument();
    expect(screen.getByText('Checked bags')).toBeInTheDocument();
    expect(screen.getByText('Total weight')).toBeInTheDocument();
    expect(screen.getByText('Tag number')).toBeInTheDocument();
  });

  it('should render the booking section from version', () => {
    render(setTabAndTaskValues([taskDetailsData.versions[0]], tabData));
    expect(screen.getByText('Reference')).toBeInTheDocument();
    expect(screen.getByText('LSV4UV')).toBeInTheDocument();
    expect(screen.getByText('Number of travellers')).toBeInTheDocument();
    expect(screen.getByText('Booking type')).toBeInTheDocument();
    expect(screen.getByText('Booking country')).toBeInTheDocument();
    expect(screen.getByText('Ticket number')).toBeInTheDocument();
    expect(screen.getByText('Ticket type')).toBeInTheDocument();
    expect(screen.getByText('Payments')).toBeInTheDocument();
    expect(screen.queryAllByText(/Credit card ending X63X, expiry 10\/20/)).toHaveLength(2);
    expect(screen.getByText('Agent IATA')).toBeInTheDocument();
    expect(screen.getByText('Agent location')).toBeInTheDocument();
  });

  it('should render PNR Data when PNR tab is clicked', async () => {
    mockAxios
      .onGet('/targeting-tasks/BK-123/passenger-name-record-versions/2')
      .reply(200, {
        locator: 'LSV4UV',
        raw: 'This is raw PNR Data',
      });

    await waitFor(() => render(setTabAndTaskValues([taskDetailsData.versions[0]], tabData)));

    await waitFor(() => { fireEvent.click(screen.getByText(/PNR Data/i)); });

    expect(mockAxios.history.get[0].url).toEqual('/targeting-tasks/BK-123/passenger-name-record-versions/2');

    expect(screen.getByText(/This is raw PNR Data/i)).toBeInTheDocument();
  });

  /*
   * This needs to be the very last test in this file (triggers govUKAccordion error in the test above).
   * to be investiaged
   */
  it('should render task versions', () => {
    const tree = renderer.create(setTabAndTaskValues([taskDetailsData.versions[0]], tabData)).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
