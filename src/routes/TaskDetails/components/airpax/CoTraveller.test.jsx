import React from 'react';
import renderer from 'react-test-renderer';

import CoTraveller from './CoTraveller';
import taskDetailsData from '../../../../__fixtures__/taskData_AirPax_TaskDetails.fixture.json';

describe('CoTraveller', () => {
  let version = {};

  beforeEach(() => {
    version = taskDetailsData.versions[0];
  });

  it('should render the co-traveller component', () => {
    const tree = renderer.create(<CoTraveller version={version} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should not render the co-traveller component', () => {
    version.movement.otherPersons = [];
    const tree = renderer.create(<CoTraveller version={version} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
