import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import '../../__mocks__/keycloakMock';

import RenderForm from '../RenderForm';

import dismissTask from '../../cop-forms/dismissTaskCerberus';
import { Renderers } from '../../utils/Form';

describe('RenderForm', () => {
  const ON_CANCEL_CALLS = [];

  const ON_CANCEL = (action) => {
    ON_CANCEL_CALLS.push(action);
  };

  beforeEach(() => {
    ON_CANCEL_CALLS.length = 0;
  });

  it('should call the cancel function when the cancel button is clicked', () => {
    render(<RenderForm
      form={dismissTask}
      onSubmit={jest.fn()}
      onCancel={ON_CANCEL}
      renderer={Renderers.REACT}
    />);

    userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(ON_CANCEL_CALLS).toHaveLength(1);
  });

  it('should submit the form', () => {
    render(<RenderForm
      form={dismissTask}
      onSubmit={jest.fn()}
      onCancel={ON_CANCEL}
      renderer={Renderers.REACT}
    />);

    userEvent.click(screen.getByRole('radio', { name: 'Vessel arrived' }));
    userEvent.click(screen.getByRole('button', { name: 'Next' }));
    userEvent.click(screen.getByRole('button', { name: 'Submit form' }));

    expect(ON_CANCEL_CALLS).toHaveLength(0);
  });
});
