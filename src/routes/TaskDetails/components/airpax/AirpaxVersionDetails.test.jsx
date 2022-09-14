import React from 'react';
import renderer from 'react-test-renderer';

import AirpaxVersionDetails from './AirpaxVersionDetails';
import { ApplicationContext } from '../../../../context/ApplicationContext';

import { versions } from '../../../../__fixtures__/airpax-task-details-versions.fixture.json';
import refDataAirlineCodes from '../../../../__fixtures__/airpax-airline-codes.json';

describe('AirpaxTaskVersionDetails', () => {
  it('should render the component without crashing', () => {
    const tree = renderer.create(
      <ApplicationContext.Provider value={{ refDataAirlineCodes: jest.fn().mockReturnValue(refDataAirlineCodes) }}>
        <AirpaxVersionDetails version={versions[0]} />
      </ApplicationContext.Provider>,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
