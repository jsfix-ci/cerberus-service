import renderer from 'react-test-renderer';
import renderBlock, { renderRow } from './common';

describe('Commons Utils', () => {
  it('should render a jsx block from given', () => {
    const section = renderer.create(renderBlock('Reference', ['TR-172653'])).toJSON();
    expect(section).toMatchSnapshot();
  });

  it('should render a jsx block occupying the whole width of parent html element', () => {
    const section = renderer.create(renderRow('Reference', ['TR-172653'])).toJSON();
    expect(section).toMatchSnapshot();
  });
});
