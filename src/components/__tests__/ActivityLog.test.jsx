import React from 'react';
import { render, screen } from '@testing-library/react';
import ActivityLog from '../ActivityLog';

describe('ActivityLog', () => {
  const mockActivityLog = [
    {
      id: '123',
      content: 'Task received',
      timestamp: '2022-04-14T08:18:09.888175Z',
      userId: 'Cerberus - Rules Based Targeting',
    },
    {
      id: '124',
      content: 'Develop the task',
      timestamp: '2022-04-14T08:18:09.888175Z',
      userId: 'Cerberus - Rules Based Targeting',
    },
    {
      id: '125',
      content: "joe's test note",
      timestamp: '2021-12-11T05:10:59Z',
      userId: 'joe.bloggs@digital.homeoffice.gov.uk',
    },
    {
      id: '126',
      content: 'really long note more words more words more words more words more words more words more words more words more words more words more words more words more words more words more words more words more words more words more words  more words  more words  more word',
      timestamp: '2021-10-01T01:15:35Z',
      userId: 'joe.bloggs@digital.homeoffice.gov.uk',
    },
    {
      id: '127',
      content: "joe's test note",
      timestamp: '2021-12-11T05:10:59Z',
      userId: 'joe.bloggs@digital.homeoffice.gov.uk',
    },
  ];
  const mockActivityLogRelisted = [
    {
      id: '123',
      content: 'Task received',
      timestamp: '2022-04-14T08:18:09.888175Z',
      userId: 'Cerberus - Rules Based Targeting',
    },
    {
      id: '124',
      content: 'Develop the task',
      timestamp: '2022-04-14T08:18:09.888175Z',
      userId: 'Cerberus - Rules Based Targeting',
    },
    {
      id: '125',
      content: 'Task relisted',
      timestamp: '2021-12-11T05:10:59Z',
      userId: 'Cerberus - Rules Based Targeting',
    },
  ];
  const mockActivityLogAssessmentComplete = [
    {
      id: '123',
      content: 'Task received',
      timestamp: '2022-04-14T08:18:09.888175Z',
      userId: 'Cerberus - Rules Based Targeting',
    },
    {
      id: '124',
      content: 'Develop the task',
      timestamp: '2022-04-14T08:18:09.888175Z',
      userId: 'Cerberus - Rules Based Targeting',
    },
    {
      id: '125',
      content: 'Assessment complete',
      timestamp: '2021-12-11T05:10:59Z',
      userId: 'joe.bloggs@digital.homeoffice.gov.uk',
    },
  ];
  const mockActivityLogTaskDismissed = [
    {
      id: '123',
      content: 'Task received',
      timestamp: '2022-04-14T08:18:09.888175Z',
      userId: 'Cerberus - Rules Based Targeting',
    },
    {
      id: '124',
      content: 'Develop the task',
      timestamp: '2022-04-14T08:18:09.888175Z',
      userId: 'Cerberus - Rules Based Targeting',
    },
    {
      id: '125',
      content: 'Task dismissed',
      timestamp: '2021-12-11T05:10:59Z',
      userId: 'joe.bloggs@digital.homeoffice.gov.uk',
    },
  ];
  const mockActivityLogTargetIssued = [
    {
      id: '123',
      content: 'Task received',
      timestamp: '2022-04-14T08:18:09.888175Z',
      userId: 'Cerberus - Rules Based Targeting',
    },
    {
      id: '124',
      content: 'Develop the task',
      timestamp: '2022-04-14T08:18:09.888175Z',
      userId: 'Cerberus - Rules Based Targeting',
    },
    {
      id: '125',
      content: 'Target issued',
      timestamp: '2021-12-11T05:10:59Z',
      userId: 'joe.bloggs@digital.homeoffice.gov.uk',
    },
  ];
  const mockActivityLogFrontLineActivities = [
    {
      id: '123',
      content: 'Task received',
      timestamp: '2022-04-14T08:18:09.888175Z',
      userId: 'Cerberus - Rules Based Targeting',
    },
    {
      id: '124',
      content: 'Develop the task',
      timestamp: '2022-04-14T08:18:09.888175Z',
      userId: 'Cerberus - Rules Based Targeting',
    },
    {
      id: '125',
      content: 'Target issued',
      timestamp: '2021-12-11T05:10:59Z',
      userId: 'joe.bloggs@digital.homeoffice.gov.uk',
    },
    {
      id: '126',
      content: 'Target acknowledged',
      timestamp: '2021-12-12T05:10:59Z',
      userId: 'jane.doe@digital.homeoffice.gov.uk',
    },
    {
      id: '127',
      content: 'A Front line user has claimed the task',
      timestamp: '2021-12-12T11:10:59Z',
      userId: 'jane.doe@digital.homeoffice.gov.uk',
    },
    {
      id: '128',
      content: 'Targeting activity complete, COP outcome: negative',
      timestamp: '2021-12-12T12:10:59Z',
      userId: 'jane.doe@digital.homeoffice.gov.uk',
    },
  ];

  // convert a timestamp from mockActivityLog to local and test that exists in document
  // this ensures daylight saving time changes are covered in tests
  // and that date formatting is covered (drone sets date to m/d/yyyy rather than dd/mm/yyyy)
  const localTime = new Date('2022-04-14T08:18:09.888175Z').toLocaleTimeString();
  const localDate = new Date('2022-04-14T08:18:09.888175Z').toLocaleDateString();

  it('should render activity log', () => {
    render(<ActivityLog activityLog={mockActivityLog} />);
    expect(screen.getByText('Task activity')).toBeInTheDocument();
    expect(screen.getAllByText('Cerberus - Rules Based Targeting')).toHaveLength(2);
    expect(screen.getAllByText('joe.bloggs@digital.homeoffice.gov.uk')).toHaveLength(3);
    expect(screen.getAllByText('joe\'s test note')).toHaveLength(2);
  });

  it('should display datetime in local datetime', () => {
    render(<ActivityLog activityLog={mockActivityLog} />);
    expect(screen.getAllByText(localTime)).toHaveLength(2);
    expect(screen.getAllByText(localDate)).toHaveLength(2);
  });

  it('should display task created/received note', () => {
    render(<ActivityLog activityLog={mockActivityLog} />);
    expect(screen.getAllByText('Cerberus - Rules Based Targeting')).toHaveLength(2);
    expect(screen.getByText('Task received')).toBeInTheDocument();
    expect(screen.getByText('Develop the task')).toBeInTheDocument();
  });

  it('should show relisted if task has relisted state', () => {
    render(<ActivityLog activityLog={mockActivityLogRelisted} />);
    expect(screen.getAllByText('Cerberus - Rules Based Targeting')).toHaveLength(3);
    expect(screen.getByText('Task received')).toBeInTheDocument();
    expect(screen.getByText('Develop the task')).toBeInTheDocument();
    expect(screen.getByText('Task relisted')).toBeInTheDocument();
  });

  it('should show assessment complete if task has been completed with assessment', () => {
    render(<ActivityLog activityLog={mockActivityLogAssessmentComplete} />);
    expect(screen.getAllByText('Cerberus - Rules Based Targeting')).toHaveLength(2);
    expect(screen.getByText('Task received')).toBeInTheDocument();
    expect(screen.getByText('Develop the task')).toBeInTheDocument();
    expect(screen.getByText('Assessment complete')).toBeInTheDocument();
    expect(screen.getAllByText('joe.bloggs@digital.homeoffice.gov.uk')).toHaveLength(1);
  });

  it('should show task dismissed if task has been dismissed', () => {
    render(<ActivityLog activityLog={mockActivityLogTaskDismissed} />);
    expect(screen.getAllByText('Cerberus - Rules Based Targeting')).toHaveLength(2);
    expect(screen.getByText('Task received')).toBeInTheDocument();
    expect(screen.getByText('Develop the task')).toBeInTheDocument();
    expect(screen.getByText('Task dismissed')).toBeInTheDocument();
    expect(screen.getAllByText('joe.bloggs@digital.homeoffice.gov.uk')).toHaveLength(1);
  });

  it('should show target issued if task has had target issued to front line', () => {
    render(<ActivityLog activityLog={mockActivityLogTargetIssued} />);
    expect(screen.getAllByText('Cerberus - Rules Based Targeting')).toHaveLength(2);
    expect(screen.getByText('Task received')).toBeInTheDocument();
    expect(screen.getByText('Develop the task')).toBeInTheDocument();
    expect(screen.getByText('Target issued')).toBeInTheDocument();
    expect(screen.getAllByText('joe.bloggs@digital.homeoffice.gov.uk')).toHaveLength(1);
  });

  it('should show front line activities when they have actioned the task', () => {
    render(<ActivityLog activityLog={mockActivityLogFrontLineActivities} />);
    expect(screen.getByText('Target acknowledged')).toBeInTheDocument();
    expect(screen.getByText('A Front line user has claimed the task')).toBeInTheDocument();
    expect(screen.getByText('Targeting activity complete, COP outcome: negative')).toBeInTheDocument();
  });
});
