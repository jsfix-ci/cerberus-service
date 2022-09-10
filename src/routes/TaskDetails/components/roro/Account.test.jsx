import React from 'react';
import { render, screen } from '@testing-library/react';

import Account from './Account';

import RoRoAccompaniedMother from '../../../../__fixtures__/RoRoAccompaniedMother.fixture';

describe('Account', () => {
  it('should render the component without crashing', () => {
    const { versions } = new RoRoAccompaniedMother().build();
    render(<Account version={versions[0]} classModifiers={['test-class']} />);

    expect(screen.getByText('Account details')).toBeInTheDocument();
    expect(screen.getByText('Full name')).toBeInTheDocument();
    expect(screen.getByText('Short name')).toBeInTheDocument();
    expect(screen.getByText('Reference number')).toBeInTheDocument();
    expect(screen.getByText('Address')).toBeInTheDocument();
    expect(screen.getByText('Telephone')).toBeInTheDocument();
    expect(screen.getByText('Mobile')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });
});
