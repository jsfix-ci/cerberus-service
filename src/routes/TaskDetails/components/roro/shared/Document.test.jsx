import React from 'react';
import { render, screen } from '@testing-library/react';

import Document from './Document';

import RoRoAccompaniedMother from '../../../../../__fixtures__/RoRoAccompaniedMother.fixture';

describe('Document', () => {
  it('should render the component without crashing', () => {
    const { versions } = new RoRoAccompaniedMother().build();
    render(<Document version={versions[0]} classModifiers={['test-class']} />);

    expect(screen.getByText('Document')).toBeInTheDocument();
    expect(screen.getByText('Travel document type')).toBeInTheDocument();
    expect(screen.getByText('Travel document number')).toBeInTheDocument();
    expect(screen.getByText('Travel document expiry')).toBeInTheDocument();
  });
});
