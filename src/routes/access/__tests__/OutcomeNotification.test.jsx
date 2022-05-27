import React from 'react';
import { render, screen } from '@testing-library/react';
import '../../../__mocks__/keycloakMock';
import { PNR_USER_SESSION_ID } from '../../../constants';
import OutcomeNotification from '../OutcomeNotification';

describe('OutcomeNotification', () => {
  let setDisplayForm = jest.fn();

  beforeEach(() => {
    localStorage.clear();
  });

  it('should render the component on user accepting to view PNR data', () => {
    localStorage.setItem(PNR_USER_SESSION_ID, JSON.stringify({ sessionId: '123-456', requested: true }));
    render(<OutcomeNotification setDisplayForm={setDisplayForm} />);

    expect(screen.getAllByText(/You can now view PNR data./i)).toHaveLength(2);
    expect(screen.getByText('Data up to 6 months old will be visible')).toBeInTheDocument();
    expect(screen.getByText('Continue')).toBeInTheDocument();
  });

  it('should render the component on user rejecting to view PNR data', () => {
    localStorage.setItem(PNR_USER_SESSION_ID, JSON.stringify({ sessionId: '123-456', requested: false }));
    render(<OutcomeNotification setDisplayForm={setDisplayForm} />);

    screen.debug(undefined, 200000);
    expect(screen.getByText('Continue without viewing PNR data')).toBeInTheDocument();
    expect(screen.getByText('Continue')).toBeInTheDocument();
  });
});
