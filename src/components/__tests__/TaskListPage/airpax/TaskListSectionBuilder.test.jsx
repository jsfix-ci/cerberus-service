import renderer from 'react-test-renderer';

import { buildSecondSection, buildThirdSection, buildFourthSection } from '../../../TaskListPage/airpax/TaskListSectionBuilder';

import targetTask from '../../../__fixtures__/targetListData';

describe('TaskListSectionBuilder', () => {
  it('should render the second section', () => {
    const tree = renderer.create(buildSecondSection(targetTask)).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render the third section', () => {
    const tree = renderer.create(buildThirdSection(targetTask)).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render the fourth section', () => {
    const tree = renderer.create(buildFourthSection(targetTask)).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
