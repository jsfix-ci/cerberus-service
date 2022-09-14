import React from 'react';
import { render, screen } from '@testing-library/react';

import PrimaryTraveller from './PrimaryTraveller';

import RoRoTouristIndividualMother from '../../../../../../__fixtures__/RoRoTouristIndividualMother.fixture';

describe('PrimaryTraveller', () => {
  it('should render the component without crashing', () => {
    const { versions } = new RoRoTouristIndividualMother().build();
    render(<PrimaryTraveller version={versions[0]} classModifiers={['test-class']} />);

    expect(screen.getByText('Primary traveller')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Date of birth')).toBeInTheDocument();
    expect(screen.getByText('Gender')).toBeInTheDocument();
    expect(screen.getByText('Nationality')).toBeInTheDocument();
    expect(screen.getByText('Travel document type')).toBeInTheDocument();
    expect(screen.getByText('Travel document number')).toBeInTheDocument();
    expect(screen.getByText('Travel document expiry')).toBeInTheDocument();
  });
});
