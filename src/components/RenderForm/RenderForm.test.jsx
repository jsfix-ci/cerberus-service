import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import '../../__mocks__/keycloakMock';

import RenderForm from './RenderForm';

import dismissTask from '../../forms/dismissTaskCerberus';
import completeTask from '../../forms/completeTaskCerberus';
import airpaxTis from '../../forms/airpaxTisCerberus';

import { Renderers } from '../../utils/Form/ReactForm';

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

  it('should render the issue target form', () => {
    render(<RenderForm
      form={airpaxTis}
      onSubmit={jest.fn()}
      onCancel={jest.fn()}
      renderer={Renderers.REACT}
    />);

    expect(screen.getByText('Target Information Sheet (AirPax)')).toBeInTheDocument();
    expect(screen.getByText('Target information')).toBeInTheDocument();
    expect(screen.getByText('Movement details')).toBeInTheDocument();
    expect(screen.getByText('Passenger 1 details')).toBeInTheDocument();
    expect(screen.getByText('Selection details')).toBeInTheDocument();
    expect(screen.getByText('Warnings')).toBeInTheDocument();
    expect(screen.getByText('Recipient Details')).toBeInTheDocument();
  });
});
