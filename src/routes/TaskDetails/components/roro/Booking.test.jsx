import React from 'react';
import { screen, render } from '@testing-library/react';

import Booking from './Booking';

import RoRoAccompaniedMother from '../../../../__fixtures__/RoRoAccompaniedMother.fixture';

describe('Booking', () => {
  it('should render the component without crashing', () => {
    const { versions } = new RoRoAccompaniedMother().build();
    render(<Booking version={versions[0]} classModifiers={['test-class']} />);

    expect(screen.getByText('Booking and check-in')).toBeInTheDocument();
    expect(screen.getByText('Reference')).toBeInTheDocument();
    expect(screen.getByText('Ticket number')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Address')).toBeInTheDocument();
    expect(screen.getByText('Booking date and time')).toBeInTheDocument();
    expect(screen.getByText('Country')).toBeInTheDocument();
    expect(screen.getByText('Payment method')).toBeInTheDocument();
    expect(screen.getByText('Ticket price')).toBeInTheDocument();
    expect(screen.getByText('Ticket type')).toBeInTheDocument();
    expect(screen.getByText('Check-in date and time')).toBeInTheDocument();
  });
});
