import React from 'react';
import { render, screen } from '@testing-library/react';

import TouristVehicleVersionDetails from './TouristVehicleVersionDetails';

import RoRoTouristVehicleMother from '../../../../../../__fixtures__/RoRoTouristVehicleMother.fixture';

describe('TouristVehicleVersionDetails', () => {
  it('should render the component without crashing', () => {
    const { versions } = new RoRoTouristVehicleMother().build();
    render(<TouristVehicleVersionDetails version={versions[0]} />);

    expect(screen.getByText('Targeting indicators')).toBeInTheDocument();
    expect(screen.getByText('Vehicle')).toBeInTheDocument();
    expect(screen.getByText('Booking and check-in')).toBeInTheDocument();
    expect(screen.getByText('Occupants')).toBeInTheDocument();
  });
});
