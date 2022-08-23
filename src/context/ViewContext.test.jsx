import React from 'react';
import { render } from '@testing-library/react';

import { ViewContext } from './ViewContext';

describe('ViewContext', () => {
  it('should render components without crashing', async () => {
    const WORD = 'Hello';

    const { container } = await render(
      <ViewContext.Provider value={{}}>
        <div>{WORD}</div>
      </ViewContext.Provider>,
    );

    const domElements = container.getElementsByTagName('DIV');
    expect(domElements).toHaveLength(1);
    expect(domElements[0].textContent).toEqual(WORD);
  });
});
