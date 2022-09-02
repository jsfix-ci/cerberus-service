import React from 'react';
import axios from 'axios';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import '../../__mocks__/keycloakMock';
import ClaimUnclaimTask from './ClaimUnclaimTask';
import { PATHS } from '../../utils/constants';

describe('Claim/Unclaim task buttons', () => {
  const mockAxios = new MockAdapter(axios);

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    mockAxios.reset();
  });

  it('should render with text of claim when there is no assignee', async () => {
    const targetTask = {
      assignee: null,
      id: '123',
    };
    mockAxios.onPost(`targeting-tasks/${targetTask.id}/claim`).reply(200);

    render(<ClaimUnclaimTask
      assignee={targetTask.assignee}
      businessKey={targetTask.id}
      source={PATHS.AIRPAX}
      buttonType="button"
    />);

    expect(screen.getByText(/Claim/i)).toBeInTheDocument();
    const unclaimButton = screen.queryByText(/Unclaim/i);
    expect(unclaimButton).not.toBeInTheDocument();
  });

  it('should post to the claim api for that task when user clicks claim', async () => {
    const targetTask = {
      assignee: null,
      id: '123',
    };
    mockAxios.onPost(`targeting-tasks/${targetTask.id}/claim`).reply(200);

    render(<ClaimUnclaimTask
      assignee={targetTask.assignee}
      businessKey={targetTask.id}
      source={PATHS.RORO_V2}
      buttonType="button"
    />);

    await waitFor(() => { fireEvent.click(screen.getByText(/Claim/i)); });
    expect(mockAxios.history.post[0].url).toEqual(`/targeting-tasks/${targetTask.id}/claim`);
  });

  it('should render with text of unclaim when the assignee matches the current user', () => {
    const targetTask = {
      assignee: 'testUser',
      id: '123',
    };

    const currentUser = 'testUser';

    render(<ClaimUnclaimTask
      currentUser={currentUser}
      assignee={targetTask.assignee}
      businessKey={targetTask.id}
      source={PATHS.AIRPAX}
      buttonType="button"
    />);

    expect(screen.getByText(/Unclaim/i)).toBeInTheDocument();
    const claimButton = screen.queryByText('Claim');
    expect(claimButton).not.toBeInTheDocument();
  });

  it('should post to the unclaim api for that task when user clicks unclaim', async () => {
    const targetTask = {
      assignee: 'testUser',
      id: '123',
    };
    mockAxios.onPost(`targeting-tasks/${targetTask.id}/unclaim`).reply(200);

    render(<ClaimUnclaimTask
      assignee={targetTask.assignee}
      businessKey={targetTask.id}
      source={PATHS.RORO_V2}
      buttonType="button"
    />);

    await waitFor(() => { fireEvent.click(screen.getByText(/Unclaim/i)); });
    expect(mockAxios.history.post[0].url).toEqual(`/targeting-tasks/${targetTask.id}/unclaim`);
  });

  it('should render with text of username when the assignee does not match the current user', async () => {
    const targetTask = {
      assignee: 'not-current-user',
      id: '123',
    };
    const currentUser = 'testUser';

    render(<ClaimUnclaimTask
      currentUser={currentUser}
      assignee={targetTask.assignee}
      businessKey={targetTask.id}
      source={PATHS.RORO_V2}
      buttonType="button"
    />);

    await waitFor(() => expect(screen.queryByText('Claim')).not.toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('Unclaim')).not.toBeInTheDocument());
    expect(screen.getByText(/Assigned to not-current-user/i)).toBeInTheDocument();
  });

  it('should handle 500', async () => {
    const targetTask = {
      assignee: 'not-current-user',
      id: '123',
    };
    mockAxios.onPost(`targeting-tasks/${targetTask.id}/claim`).reply(500);

    render(<ClaimUnclaimTask
      assignee={targetTask.assignee}
      businessKey={targetTask.id}
      source={PATHS.AIRPAX}
      buttonType="button"
    />);

    await waitFor(() => expect(screen.queryByText('Claim')).not.toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('Unclaim')).not.toBeInTheDocument());
    expect(screen.getByText(/Assigned to not-current-user/i)).toBeInTheDocument();
  });
});
