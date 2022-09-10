import React from 'react';
import { render, screen } from '@testing-library/react';

import AccompaniedVersionDetails from './AccompaniedVersionDetails';

import RoRoAccompaniedMother from '../../../../__fixtures__/RoRoAccompaniedMother.fixture';

describe('AccompaniedVersionDetails', () => {
  it('should render the component without crashing', () => {
    const { versions } = new RoRoAccompaniedMother().build();
    render(<AccompaniedVersionDetails version={versions[0]} />);

    expect(screen.getByText('Targeting indicators')).toBeInTheDocument();
    expect(screen.getByText('Vehicle')).toBeInTheDocument();
    expect(screen.getByText('Trailer')).toBeInTheDocument();
    expect(screen.getByText('Goods')).toBeInTheDocument();
    expect(screen.getByText('Haulier details')).toBeInTheDocument();
    expect(screen.getByText('Account details')).toBeInTheDocument();
    expect(screen.getByText('Booking and check-in')).toBeInTheDocument();
    expect(screen.getByText('Occupants')).toBeInTheDocument();
  });
});
