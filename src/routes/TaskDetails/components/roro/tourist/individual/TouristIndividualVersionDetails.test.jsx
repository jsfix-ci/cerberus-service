import React from 'react';
import { render, screen } from '@testing-library/react';

import TouristIndividualVersionDetails from './TouristIndividualVersionDetails';

import RoRoTouristIndividualMother from '../../../../../../__fixtures__/RoRoTouristIndividualMother.fixture';

describe('TouristIndividualVersionDetails', () => {
  it('should render the component without crashing', () => {
    const { versions } = new RoRoTouristIndividualMother().build();
    render(<TouristIndividualVersionDetails version={versions[0]} />);

    expect(screen.getByText('Targeting indicators')).toBeInTheDocument();
    expect(screen.getByText('Booking and check-in')).toBeInTheDocument();
    expect(screen.getByText('Occupants')).toBeInTheDocument();
    expect(screen.getByText('Primary traveller')).toBeInTheDocument();
  });
});
