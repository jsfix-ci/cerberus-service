import React from 'react';
import { render, screen } from '@testing-library/react';

import CoTraveller from '../../TaskDetails/builder/CoTraveller';
import taskDetailsData from '../../__fixtures__/taskData_AirPax_TaskDetails.fixture.json';

describe('CoTraveller', () => {
  it('should render the co traveller component', () => {
    render(<CoTraveller version={taskDetailsData} />);
    expect(screen.getByText('1 traveller')).toBeInTheDocument();
    expect(screen.getAllByText('Traveller')).toHaveLength(2);
    expect(screen.getAllByText('Age')).toHaveLength(2);
    expect(screen.getAllByText('Check-in')).toHaveLength(2);
    expect(screen.getAllByText('Seat')).toHaveLength(2);
    expect(screen.getAllByText('Document')).toHaveLength(2);
    expect(screen.getAllByText('Checked baggage')).toHaveLength(2);
    expect(screen.getByText('1kg')).toBeInTheDocument();
    expect(screen.getByText('Passport')).toBeInTheDocument();
    expect(screen.getByText('Issued by FR')).toBeInTheDocument();
    expect(screen.getByText(/FORD/)).toBeInTheDocument();
    expect(screen.getByText(/Isaiah/)).toBeInTheDocument();
    expect(screen.getByText(/DC/)).toBeInTheDocument();
    expect(screen.getByText(/Male/)).toBeInTheDocument();
    expect(screen.getByText(/13 May 1966/)).toBeInTheDocument();
    expect(screen.getByText(/United Kingdom \(GBR\)/)).toBeInTheDocument();
  });
});
