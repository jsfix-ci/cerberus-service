import React from 'react';
import { render, screen } from '@testing-library/react';

import Goods from './Goods';

import RoRoAccompaniedMother from '../../../../../__fixtures__/RoRoAccompaniedMother.fixture';

describe('Goods', () => {
  it('should render the component without crashing', () => {
    const { versions } = new RoRoAccompaniedMother().build();
    render(<Goods version={versions[0]} classModifiers={['test-class']} />);

    expect(screen.getByText('Goods')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Is cargo hazardous?')).toBeInTheDocument();
    expect(screen.getByText('Weight of goods')).toBeInTheDocument();
  });
});
