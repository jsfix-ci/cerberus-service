import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import '../../__mocks__/keycloakMock';

import RenderForm from '../RenderForm';

import dismissTask from '../../cop-forms/dismissTaskCerberus';
import completeTask from '../../cop-forms/completeTaskCerberus';

import { Renderers } from '../../utils/Form';
import { FORM_NAMES } from '../../constants';

describe('RenderForm', () => {
  const mockAxios = new MockAdapter(axios);

  const ON_CANCEL_CALLS = [];

  const ON_CANCEL = () => {
    ON_CANCEL_CALLS.push(undefined);
  };

  beforeEach(() => {
    ON_CANCEL_CALLS.length = 0;
    mockAxios.reset();
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

  it('should render the dismiss task form', () => {
    render(<RenderForm
      form={dismissTask}
      onSubmit={jest.fn()}
      onCancel={jest.fn()}
      renderer={Renderers.REACT}
    />);

    expect(screen.getByLabelText('Arrived at port')).toBeInTheDocument();
    expect(screen.getByLabelText('False rule match')).toBeInTheDocument();
    expect(screen.getByLabelText('Resource redirected')).toBeInTheDocument();
    expect(screen.getByLabelText('Other')).toBeInTheDocument();
  });

  it('should render the complete task form', () => {
    render(<RenderForm
      form={completeTask}
      onSubmit={jest.fn()}
      onCancel={jest.fn()}
      renderer={Renderers.REACT}
    />);

    expect(screen.getByLabelText('Arrived at port')).toBeInTheDocument();
    expect(screen.getByLabelText('Credibility checks carried out no target required')).toBeInTheDocument();
    expect(screen.getByLabelText('False SBT')).toBeInTheDocument();
    expect(screen.getByLabelText('Other')).toBeInTheDocument();
  });

  it('should issue a request to fetch the airpax tis form', async () => {
    const EXPECTED_URL = '/copform/name/cerberus-airpax-target-information-sheet';

    mockAxios
      .onGet(EXPECTED_URL)
      .reply(200, {});

    await waitFor(() => render(<RenderForm
      formName={FORM_NAMES.AIRPAX_TARGET_INFORMATION_SHEET}
      onSubmit={jest.fn()}
      onCancel={jest.fn()}
      renderer={Renderers.REACT}
    />));

    expect(mockAxios.history.get[0].url).toEqual(EXPECTED_URL);
  });
});
