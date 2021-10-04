import React from 'react';
import '@testing-library/jest-dom';

jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(() => ({
    pathname: '/example',
  })),
  useHistory: jest.fn(() => ({
    pathname: '/example',
    push: jest.fn(),
  })),
  Link: ({ children, to, ...props }) => <a href={to} {...props}>{children}</a>,
}));

global.scrollTo = jest.fn();
