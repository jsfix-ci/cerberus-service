import React from 'react';
import { render, screen } from '@testing-library/react';

import GroupOccupants from './GroupOccupants';

import RoRoTouristGroupMother from '../../../../../../__fixtures__/RoRoTouristGroupMother.fixture';

describe('GroupOccupants', () => {
  it('should render the component without crashing', () => {
    const { versions } = new RoRoTouristGroupMother().build();
    render(<GroupOccupants version={versions[0]} classModifiers={['test-class']} />);

    expect(screen.getByText('Other travellers')).toBeInTheDocument();
    expect(screen.getAllByText('Occupant')).toHaveLength(5);
    expect(screen.getAllByText('Passport')).toHaveLength(5);
    expect(screen.getAllByText('Validity')).toHaveLength(5);
    expect(screen.getByText('Show more')).toBeInTheDocument();
  });
});
