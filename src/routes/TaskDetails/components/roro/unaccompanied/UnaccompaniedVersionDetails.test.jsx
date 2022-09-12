import React from 'react';
import { render, screen } from '@testing-library/react';

import UnaccompaniedVersionDetails from './UnaccompaniedVersionDetails';

import RoRoUnaccompaniedMother from '../../../../../__fixtures__/RoRoUnaccompaniedMother.fixture';

describe('UnaccompaniedVersionDetails', () => {
  it('should render the component without crashing', () => {
    const { versions } = new RoRoUnaccompaniedMother().build();
    render(<UnaccompaniedVersionDetails version={versions[0]} />);

    expect(screen.getByText('Targeting indicators')).toBeInTheDocument();
    expect(screen.getByText('Trailer')).toBeInTheDocument();
    expect(screen.getByText('Goods')).toBeInTheDocument();
    expect(screen.getByText('Haulier details')).toBeInTheDocument();
    expect(screen.getByText('Account details')).toBeInTheDocument();
    expect(screen.getByText('Booking and check-in')).toBeInTheDocument();
  });
});
