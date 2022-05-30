import React from 'react';
import { render, screen } from '@testing-library/react';
import Passenger from '../../TaskDetails/builder/Passenger';

describe('Passenger', () => {
  const version = {
    movement: {
      person: {
        name: {
          first: 'Isaiah',
          last: 'Ford',
          full: 'Isaiah Ford',
        },
        role: 'PASSENGER',
        dateOfBirth: '1966-05-13T00:00:00Z',
        gender: 'M',
        nationality: 'GBR',
        document: null,
        ssrCodes: ['ABCDEFGHI'],
        frequentFlyerNumber: 123456,
      },
      flight: {
        departureStatus: 'DEPARTURE_CONFIRMED',
      },
    },
  };

  it('should render the title', () => {
    render(<Passenger version={version} />);
    expect(screen.getByText('Passenger')).toBeInTheDocument();
  });

  it('should render Name if present', () => {
    render(<Passenger version={version} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('FORD, Isaiah')).toBeInTheDocument();
  });

  it('should render Date of birth if present', () => {
    render(<Passenger version={version} />);
    expect(screen.getByText('Date of birth')).toBeInTheDocument();
    expect(screen.getByText('13 May 1966')).toBeInTheDocument();
  });

  it('should render Nationality if present', () => {
    render(<Passenger version={version} />);
    expect(screen.getByText('Nationality')).toBeInTheDocument();
    expect(screen.getByText('United Kingdom (GBR)')).toBeInTheDocument();
  });

  it('should render Age at travel if present', () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 55);
    version.movement.person.dateOfBirth = date.toISOString();

    render(<Passenger version={version} />);
    expect(screen.getByText('Age at travel')).toBeInTheDocument();
    expect(screen.getByText('55')).toBeInTheDocument();
  });

  it('should render Gender if present', () => {
    render(<Passenger version={version} />);
    expect(screen.getByText('Gender')).toBeInTheDocument();
    expect(screen.getByText('Male')).toBeInTheDocument();
  });

  it('should render Departure status if present', () => {
    render(<Passenger version={version} />);
    expect(screen.getByText('Departure status')).toBeInTheDocument();
    expect(screen.getByText('Departure confirmed')).toBeInTheDocument();
  });

  it('should render Frequent flyer number if present', () => {
    render(<Passenger version={version} />);
    expect(screen.getByText('Frequent flyer number')).toBeInTheDocument();
    expect(screen.getByText('123456')).toBeInTheDocument();
  });

  it('should render SSR codes if present', () => {
    render(<Passenger version={version} />);
    expect(screen.getByText('SSR codes')).toBeInTheDocument();
    expect(screen.getByText('ABCDEFGHI')).toBeInTheDocument();
  });
});
