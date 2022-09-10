import React from 'react';
import { render, screen } from '@testing-library/react';

import TargetingIndicators from './TargetingIndicators';

import RoRoAccompaniedMother from '../../../../__fixtures__/RoRoAccompaniedMother.fixture';

describe('TargetingIndicators', () => {
  it('should render the component without crashing', () => {
    const { versions } = new RoRoAccompaniedMother().build();
    render(<TargetingIndicators version={versions[0]} classModifiers={['test-class']} />);

    expect(screen.getByText('Targeting indicators')).toBeInTheDocument();
    expect(screen.getByText('Indicators')).toBeInTheDocument();
    expect(screen.getByText('Total score')).toBeInTheDocument();
    expect(screen.getByText('Indicator')).toBeInTheDocument();
    expect(screen.getByText('Score')).toBeInTheDocument();
  });
});
