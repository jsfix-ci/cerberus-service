import React from 'react';
import { render, screen } from '@testing-library/react';

import PrimaryTraveller from './PrimaryTraveller';

import RoRoTouristGroupMother from '../../../../../../__fixtures__/RoRoTouristGroupMother.fixture';

describe('PrimaryTraveller', () => {
  it('should render the component without crashing', () => {
    const { versions } = new RoRoTouristGroupMother().build();
    render(<PrimaryTraveller version={versions[0]} classModifiers={['test-class']} />);

    expect(screen.getByText('Primary traveller')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Date of birth')).toBeInTheDocument();
    expect(screen.getByText('Gender')).toBeInTheDocument();
  });
});
