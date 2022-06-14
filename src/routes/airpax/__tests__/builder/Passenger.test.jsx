import React from 'react';
import { render, screen } from '@testing-library/react';
import Passenger from '../../TaskDetails/builder/Passenger';

describe('Passenger', () => {
  let version;

  beforeEach(() => {
    version = {
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
        journey: {
          departure: {
            time: '2019-05-13T00:00:00Z',
          },
        },
      },
    };
  });

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
    render(<Passenger version={version} />);

    expect(screen.getByText('Age at travel')).toBeInTheDocument();
    expect(screen.getByText('53')).toBeInTheDocument();
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

  it('should display the Crew header if person has a role of crew', () => {
    version.movement.person.role = 'CREW';
    render(<Passenger version={version} />);
    expect(screen.getByText('Crew')).toBeInTheDocument();
  });
});
