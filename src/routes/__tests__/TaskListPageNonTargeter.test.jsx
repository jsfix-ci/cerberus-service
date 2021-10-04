import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '../../__mocks__/keycloakNonTargeterMock';
import TaskListPage from '../TaskLists/TaskListPage';

describe('TaskListPage for non targeter', () => {
  jest.mock('../../__mocks__/keycloakNonTargeterMock');
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  it('Should not load tasks if user does not have the correct targeter group', async () => {
    await waitFor(() => render(<TaskListPage taskStatus="new" setError={() => { }} />));
    expect(screen.getByText('You are not authorised to view these tasks.')).toBeInTheDocument();
  });
});
