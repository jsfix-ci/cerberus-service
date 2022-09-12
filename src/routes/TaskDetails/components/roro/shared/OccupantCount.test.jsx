import React from 'react';
import { render, screen } from '@testing-library/react';

import OccupantCount from './OccupantCount';

import RoRoAccompaniedMother from '../../../../../__fixtures__/RoRoAccompaniedMother.fixture';
import { MovementUtil, PersonUtil } from '../../../../../utils';

describe('OccupantCount', () => {
  it('should trigger occupant counts conditions render the component without crashing', () => {
    const { versions } = new RoRoAccompaniedMother().build();
    render(<OccupantCount
      mode={MovementUtil.movementMode(versions[0])}
      primaryTraveller={PersonUtil.get(versions[0])}
      coTravellers={[]}
      occupantCounts={MovementUtil.occupantCounts(versions[0])}
      classModifiers={['test-class']}
    />);

    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Number')).toBeInTheDocument();
    expect(screen.getByText('Infants')).toBeInTheDocument();
    expect(screen.getByText('Children')).toBeInTheDocument();
    expect(screen.getByText('Adults')).toBeInTheDocument();
    expect(screen.getByText('OAPs')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getAllByText('0')).toHaveLength(3);
  });
});
