import React from 'react';
import { render } from '@testing-library/react';

import { ApplicationContext } from './ApplicationContext';

describe('ApplicationContext', () => {
  it('should render components without crashing', async () => {
    const WORD = 'Hello';

    const { container } = await render(
      <ApplicationContext.Provider value={{}}>
        <div>{WORD}</div>
      </ApplicationContext.Provider>,
    );

    const domElements = container.getElementsByTagName('DIV');
    expect(domElements).toHaveLength(1);
    expect(domElements[0].textContent).toEqual(WORD);
  });
});
