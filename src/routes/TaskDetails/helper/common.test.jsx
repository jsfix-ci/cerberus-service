import { render } from '@testing-library/react';
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

  it('should render link for entity search url', () => {
    const { container } = render(renderBlock('Reference', [{
      content: 'TR-172653',
      entitySearchURL: 'http://entity-search-url.com',
    }]));

    const link = container.getElementsByTagName('A');
    expect(link).toHaveLength(1);
    expect(link[0].getAttribute('href')).toEqual('http://entity-search-url.com');
  });

  it('should not render link for entity search url', () => {
    const { container } = render(renderBlock('Reference', ['TR-172653']));

    const link = container.getElementsByTagName('A');
    expect(link).toHaveLength(0);
  });
});
