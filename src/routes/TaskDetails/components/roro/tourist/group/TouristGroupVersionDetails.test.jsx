import React from 'react';
import { render, screen } from '@testing-library/react';

import TouristGroupVersionDetails from './TouristGroupVersionDetails';

import RoRoTouristGroupMother from '../../../../../../__fixtures__/RoRoTouristGroupMother.fixture';

describe('TouristGroupVersionDetails', () => {
  it('should render the component without crashing', () => {
    const { versions } = new RoRoTouristGroupMother().build();
    render(<TouristGroupVersionDetails version={versions[0]} />);

    expect(screen.getByText('Targeting indicators')).toBeInTheDocument();
    expect(screen.getByText('Primary traveller')).toBeInTheDocument();
    expect(screen.getByText('Document')).toBeInTheDocument();
    expect(screen.getByText('Booking and check-in')).toBeInTheDocument();
    expect(screen.getByText('Other travellers')).toBeInTheDocument();
  });
});
