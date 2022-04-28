import renderer from 'react-test-renderer';
import renderBlock from '../../TaskDetails/builder/helper/common';

describe('Commons Utils', () => {
  it('should render a jsx block from given', () => {
    const section = renderer.create(renderBlock('Reference', ['TR-172653'])).toJSON();
    expect(section).toMatchSnapshot();
  });
});
