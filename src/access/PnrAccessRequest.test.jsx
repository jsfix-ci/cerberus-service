import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '../__mocks__/keycloakMock';
import PnrAccessRequest from './PnrAccessRequest';
import { LOCAL_STORAGE_KEYS } from '../utils/constants';
import config from '../utils/config';

describe('PnrAccessRequest', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    config.copTargetingApiEnabled = true;
  });

  it('should render the form when localStorage has no matching stored user session and cop targeitng api is enabled', async () => {
    await waitFor(() => render(<PnrAccessRequest><div /></PnrAccessRequest>));

    expect(screen.getByText('Do you need to view Passenger Name Record (PNR) data')).toBeInTheDocument();
    expect(screen.getByText(/You only need access if you're working to prevent, detect/i)).toBeInTheDocument();
    expect(screen.getByText(/This has to be a necessary and proportionate requirement/i)).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
    expect(screen.getByText('Continue')).toBeInTheDocument();
  });

  it('should not render the form when localStorage has no matching stored user session but cop targeting api is disabled', async () => {
    config.copTargetingApiEnabled = false;

    await waitFor(() => render(
      <PnrAccessRequest>
        <div>This is a test message</div>
      </PnrAccessRequest>,
    ));

    expect(screen.getByText('This is a test message')).toBeInTheDocument();
  });

  it('should not render the form when localStorage has a stored matching user session', async () => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.PNR_USER_SESSION_ID, JSON.stringify({ sessionId: '123-456', requested: true }));
    await waitFor(() => render(
      <PnrAccessRequest>
        <div>This is a test message</div>
      </PnrAccessRequest>,
    ));
    expect(screen.getByText('This is a test message')).toBeInTheDocument();
  });
});
