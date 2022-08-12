import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '../../__mocks__/keycloakMock';
import Header from './Header';

describe('Header', () => {
  test('renders the header with nav links', () => {
    render(<Header />);
    const bannerText = screen.getByRole('banner').textContent;
    expect(bannerText).toContain('Cerberus');
    expect(bannerText).toContain('powered by the Central Operations Platform');
    expect(bannerText).toContain('powered by the Central Operations Platform');
  });

  it('should clear secure local storage on logout', async () => {
    localStorage.setItem('test-key-local', 'test-value-keep');
    sessionStorage.setItem('test-key-session', 'test-value-keep');

    render(<Header />);
    expect(screen.getByText('Sign out')).toBeInTheDocument();
    await waitFor(() => { fireEvent.click(screen.getByText('Sign out')); });

    expect(localStorage.getItem('test-key-local')).toBeFalsy();
    expect(sessionStorage.getItem('test-key-session')).toBeFalsy();
  });

  describe('AirpaxTasks', () => {
    const extendedRouterMock = jest.requireMock('react-router-dom');
    it('should render the Tasks wording as a URL when on roro task list page, on the header', () => {
      extendedRouterMock.useLocation = jest.fn().mockReturnValue({ pathname: '/tasks' });
      render(<Header />);
      expect(screen.getByText('Tasks')).toBeInTheDocument();
    });

    it('should render the Tasks wording as a URL when on airpax task list page, on the header', () => {
      extendedRouterMock.useLocation = jest.fn().mockReturnValue({ pathname: '/airpax/tasks' });
      render(<Header />);
      expect(screen.getByText('Tasks')).toBeInTheDocument();
    });
  });
});
