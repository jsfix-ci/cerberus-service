import React from 'react';
import { render } from '@testing-library/react';

import { KeycloakContext } from './Keycloak';

describe('KeycloakContext', () => {
  it('should render components without crashing', async () => {
    const WORD = 'Hello';

    const { container } = await render(
      <KeycloakContext.Provider value={{}}>
        <div>{WORD}</div>
      </KeycloakContext.Provider>,
    );

    const domElements = container.getElementsByTagName('DIV');
    expect(domElements).toHaveLength(1);
    expect(domElements[0].textContent).toEqual(WORD);
  });
});
