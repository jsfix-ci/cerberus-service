import React from 'react';
import { render } from '@testing-library/react';

import { PnrAccessContext } from './PnrAccessContext';

describe('PnrAccessContext', () => {
  it('should render components without crashing', async () => {
    const WORD = 'Hello';

    const { container } = await render(
      <PnrAccessContext.Provider value={{}}>
        <div>{WORD}</div>
      </PnrAccessContext.Provider>,
    );

    const domElements = container.getElementsByTagName('DIV');
    expect(domElements).toHaveLength(1);
    expect(domElements[0].textContent).toEqual(WORD);
  });
});
