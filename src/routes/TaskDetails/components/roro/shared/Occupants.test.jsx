import React from 'react';
import { render, screen } from '@testing-library/react';

import Occupants from './Occupants';

import RoRoAccompaniedMother from '../../../../../__fixtures__/RoRoAccompaniedMother.fixture';

describe('Occupants', () => {
  it('should render the component without crashing', () => {
    const { versions } = new RoRoAccompaniedMother().build();
    render(<Occupants version={versions[0]} classModifiers={['test-class']} />);

    expect(screen.getByText('Driver')).toBeInTheDocument();
    expect(screen.getAllByText('Passport')).toHaveLength(2);
    expect(screen.getAllByText('Validity')).toHaveLength(2);
    expect(screen.getByText('Occupant')).toBeInTheDocument();
  });
});
