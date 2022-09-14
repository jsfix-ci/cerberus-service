import React from 'react';
import { render, screen } from '@testing-library/react';

import Occupant from './Occupant';

import RoRoAccompaniedMother from '../../../../../__fixtures__/RoRoAccompaniedMother.fixture';
import { DocumentUtil, PersonUtil } from '../../../../../utils';

describe('Occupant', () => {
  it('should render the component without crashing', () => {
    const { versions } = new RoRoAccompaniedMother().build();
    const person = PersonUtil.get(versions[0]);
    const document = DocumentUtil.get(person);
    const labelText = 'Test-Label';
    const departureTime = '2020-08-04T13:10:00Z';

    render(<Occupant
      person={person}
      departureTime={departureTime}
      labelText={labelText}
      document={document}
      classModifiers={['test-class']}
    />);

    expect(screen.getByText('Test-Label')).toBeInTheDocument();
    expect(screen.getByText('Passport')).toBeInTheDocument();
    expect(screen.getByText('Validity')).toBeInTheDocument();
  });
});
