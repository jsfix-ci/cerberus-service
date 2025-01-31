import React from 'react';
import { render } from '@testing-library/react';
import renderer from 'react-test-renderer';

import { PATHS } from '../../../../utils/constants';

import mockAirpaxTargetListData from '../../../../__fixtures__/taskData_AirPax_AssigneeCurrentUser.fixture.json';
import mockRoRoAirpaxTargetListData from '../../../../__fixtures__/taskData_RoRo_Accompanied_AssigneeCurrentUser.fixture.json';

import TargetIndicatorsSection from './TargetIndicatorsSection';

describe('TargetIndicatorsSection', () => {
  it('should render the a airpax targeting indicators section', () => {
    const tree = renderer.create(
      <TargetIndicatorsSection targetTask={mockAirpaxTargetListData} redirectPath={PATHS.AIRPAX} />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render the a roro targeting indicators section', () => {
    const tree = renderer.create(
      <TargetIndicatorsSection targetTask={mockRoRoAirpaxTargetListData} redirectPath={PATHS.RORO_V2} />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render the appropriate redirect URL for airpax', () => {
    const { container } = render(<TargetIndicatorsSection targetTask={mockAirpaxTargetListData} redirectPath={PATHS.AIRPAX} />);
    const viewDetailsLinks = container.getElementsByClassName('govuk-link');
    expect(viewDetailsLinks).toHaveLength(1);
    expect(viewDetailsLinks[0].getAttribute('href')).toEqual(`${PATHS.AIRPAX}/${mockAirpaxTargetListData.id}`);
  });

  it('should render the appropriate redirect URL for roro', () => {
    const { container } = render(<TargetIndicatorsSection targetTask={mockRoRoAirpaxTargetListData} redirectPath={PATHS.RORO_V2} />);
    const viewDetailsLinks = container.getElementsByClassName('govuk-link');
    expect(viewDetailsLinks).toHaveLength(1);
    expect(viewDetailsLinks[0].getAttribute('href')).toEqual(`${PATHS.RORO_V2}/${mockRoRoAirpaxTargetListData.id}`);
  });
});
