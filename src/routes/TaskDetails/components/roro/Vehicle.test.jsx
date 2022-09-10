import React from 'react';
import { render, screen } from '@testing-library/react';

import Vehicle from './Vehicle';

import RoRoAccompaniedMother from '../../../../__fixtures__/RoRoAccompaniedMother.fixture';

describe('Vehicle', () => {
  it('should render the component without crashing', () => {
    const { versions } = new RoRoAccompaniedMother().build();
    render(<Vehicle version={versions[0]} classModifiers={['test-class']} />);

    expect(screen.getByText('Vehicle')).toBeInTheDocument();
    expect(screen.getByText('Vehicle registration')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Make')).toBeInTheDocument();
    expect(screen.getByText('Model')).toBeInTheDocument();
    expect(screen.getByText('Country of registration')).toBeInTheDocument();
    expect(screen.getByText('Colour')).toBeInTheDocument();
  });
});
