import React from 'react';
import { render } from '@testing-library/react';

import { TaskSelectedTabContext } from './TaskSelectedTabContext';

describe('TaskSelectedTabContext', () => {
  it('should render components without crashing', async () => {
    const WORD = 'Hello';

    const { container } = await render(
      <TaskSelectedTabContext.Provider value={{}}>
        <div>{WORD}</div>
      </TaskSelectedTabContext.Provider>,
    );

    const domElements = container.getElementsByTagName('DIV');
    expect(domElements).toHaveLength(1);
    expect(domElements[0].textContent).toEqual(WORD);
  });
});
