import React from 'react';
import { render, screen } from '@testing-library/react';

import Haulier from './Haulier';

import RoRoAccompaniedMother from '../../../../../__fixtures__/RoRoAccompaniedMother.fixture';

describe('Haulier', () => {
  it('should render the component without crashing', () => {
    const { versions } = new RoRoAccompaniedMother().build();
    render(<Haulier version={versions[0]} classModifiers={['test-class']} />);

    expect(screen.getByText('Haulier details')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Address')).toBeInTheDocument();
    expect(screen.getByText('Telephone')).toBeInTheDocument();
    expect(screen.getByText('Mobile')).toBeInTheDocument();
  });
});
