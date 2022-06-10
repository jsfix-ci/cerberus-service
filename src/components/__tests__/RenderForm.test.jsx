import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import '../../__mocks__/keycloakMock';

import RenderForm from '../RenderForm';

import dismissTask from '../../cop-forms/dismissTaskCerberus';
import { Renderers } from '../../utils/Form';

describe('RenderForm', () => {
  const mockAxios = new MockAdapter(axios);
  const FUNCTION_CALLS = [];

  const ON_CANCEL = (action) => {
    FUNCTION_CALLS.push(action);
  };

  beforeEach(() => {
    FUNCTION_CALLS.length = 0;
  });

  it('should call the cancel function when the cancel button is clicked', () => {
    render(<RenderForm
      form={dismissTask}
      onSubmit={jest.fn()}
      onCancel={ON_CANCEL}
      renderer={Renderers.REACT}
    />);

    userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(FUNCTION_CALLS).toHaveLength(1);
    expect(mockAxios.history.post).toHaveLength(1);
  });
});
