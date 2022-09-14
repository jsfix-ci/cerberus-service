import React from 'react';
import { render, screen } from '@testing-library/react';

import Trailer from './Trailer';

import RoRoAccompaniedMother from '../../../../../__fixtures__/RoRoAccompaniedMother.fixture';

describe('Trailer', () => {
  it('should render the component without crashing', () => {
    const { versions } = new RoRoAccompaniedMother().build();
    render(<Trailer version={versions[0]} classModifiers={['test-class']} />);

    expect(screen.getByText('Trailer')).toBeInTheDocument();
    expect(screen.getByText('Trailer registration number')).toBeInTheDocument();
    expect(screen.getByText('Trailer type')).toBeInTheDocument();
    expect(screen.getByText('Trailer country of registration')).toBeInTheDocument();
    expect(screen.getByText('Empty or loaded')).toBeInTheDocument();
    expect(screen.getByText('Trailer length')).toBeInTheDocument();
    expect(screen.getByText('Trailer height')).toBeInTheDocument();
  });
});
