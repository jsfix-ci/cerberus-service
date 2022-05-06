import React from 'react';
import { screen, render } from '@testing-library/react';
import TaskListMode from '../TaskLists/TaskListMode';

const roroData = {
  movementStatus: 'Pre-Arrival',
  bookingDateTime: '2020-08-02T09:15:50,2020-08-04T19:00:00',
  vessel: {
    name: 'NORMANDIE',
    company: 'Brittany Ferries',
  },
  eta: '2022-03-09T10:14:44Z',
  departureTime: '2020-08-04T19:00:00Z',
  arrivalLocation: 'CAL',
  departureLocation: 'DOV',
  vehicle: {
    colour: 'Grey',
    model: 'Discovery',
    make: 'Land Rover',
    registrationNumber: 'DK-45678',
    type: 'SUV',
    trailer: {
      regNumber: 'GB07GYT',
      trailerType: 'Tanker',
      trailerRegistrationNationality: 'DK',
      trailerLength: '36',
      trailerHeight: '3.6',
    },
  },
  load: {
    manifestedLoad: 'Corkscrews',
    manifestedWeight: '',
    countryOfDestination: '',
  },
  account: {
    name: 'DPE logistics',
    number: '000524557',
  },
  detailsOf: {
    consignor: false,
    consignee: false,
    haulier: false,
  },
  passengers: [],
};

const target = {
  id: '173dbb33-92ff-11ec-bb90-e24fd920de2d',
  status: 'NEW',
  arrivalDate: '2022-03-09T10:14:44Z',
  movementMode: 'RORO_UNACCOMPANIED_FREIGHT',
  outcome: '',
  summary: {
    parentBusinessKey: {
      businessKey: 'AUTOTEST-21-02-2022-RORO-Unaccompanied-Freight-RoRo-UNACC-RBT-SBT_686735:CMID=TEST',
    },
    threatIndicators: [
      {
        userfacingtext: 'Paid by cash',
        id: 10,
        featurename: 'STANDARDISED:cashPaid',
        vehicle: '',
        driver: '',
        person: '',
        haulier: '',
        movement: true,
        booking: '',
        organisation: '',
        score: 30,
        validfrom: '2021-06-03T00:00:01.000Z',
        validto: '',
        updatedby: 'Mohammed Abdul Odud',
      },
      {
        userfacingtext: 'Empty trailer for round trip',
        id: 12,
        featurename: 'EMPTY-TRAILER-ON-ROUND-TRIP',
        vehicle: '',
        driver: '',
        person: '',
        haulier: '',
        movement: '',
        booking: '',
        organisation: '',
        score: 30,
        validfrom: '2021-06-03T00:00:01.000Z',
        validto: '',
        updatedby: 'Mohammed Abdul Odud',
      },
      {
        userfacingtext: 'Empty vehicle',
        id: 13,
        featurename: 'STANDARDISED:emptyVehicle',
        vehicle: true,
        driver: '',
        person: '',
        haulier: '',
        movement: '',
        booking: '',
        organisation: '',
        score: 20,
        validfrom: '2021-06-03T00:00:01.000Z',
        validto: '',
        updatedby: 'Mohammed Abdul Odud',
      },
    ],
    category: 'target_B',
    eventPort: '',
    risks: {
      selectors: [
        {
          contents: {
            groupNumber: '2020-6',
            requestingOfficer: 'Peter Price',
            sourceReference: 'intel source',
            groupReference: '',
            localReference: 'Local ref',
            category: 'B',
            threatType: 'National Security at the Border',
            pointOfContactMessage: 'Message for the POC',
            pointOfContact: 'poc',
            inboundActionCode: 'Advise originator',
            outboundActionCode: 'Full attention',
            warnings: 'Supplemental warnings',
            notes: 'Supplemental notes',
            creator: 'Joe Jones',
            selectorId: 6,
          },
          childSets: [],
        },
        {
          contents: {
            groupNumber: '2021-281',
            requestingOfficer: 'efew',
            sourceReference: 'ffew',
            groupReference: '',
            localReference: 'SR-222',
            category: 'C',
            threatType: 'National Security at the Border',
            pointOfContactMessage: 'effew',
            pointOfContact: 'ewfe',
            inboundActionCode: 'No action required',
            outboundActionCode: 'No action required',
            warnings: 'fewfwe',
            notes: 'notes',
            creator: 'user',
            selectorId: 281,
          },
          childSets: [
            {
              entity: 'Message',
              attribute: 'mode',
              operator: 'in',
              indicatorValue: 'RORO Unaccompanied Freight',
            },
          ],
        },
      ],
      rules: [],
    },
    numberOfVersions: 1,
    isRelisted: false,
    roro: {
      roroFreightType: 'unaccompanied',
      details: {
        movementStatus: 'Pre-Arrival',
        bookingDateTime: '2020-08-02T09:15:50,2020-08-04T19:00:00',
        vessel: {
          name: 'NORMANDIE',
          company: 'Brittany Ferries',
        },
        eta: '2022-03-09T10:14:44Z',
        departureTime: '2020-08-04T19:00:00Z',
        arrivalLocation: 'CAL',
        departureLocation: 'DOV',
        vehicle: {
          colour: 'Grey',
          model: 'Discovery',
          make: 'Land Rover',
          registrationNumber: 'DK-45678',
          type: 'SUV',
          trailer: {
            regNumber: 'GB07GYT',
            trailerType: 'Tanker',
            trailerRegistrationNationality: 'DK',
            trailerLength: '36',
            trailerHeight: '3.6',
          },
        },
        load: {
          manifestedLoad: 'Corkscrews',
          manifestedWeight: '',
          countryOfDestination: '',
        },
        account: {
          name: 'DPE logistics',
          number: '000524557',
        },
        detailsOf: {
          consignor: false,
          consignee: false,
          haulier: false,
        },
      },
    },
  },
};

const movementModeIcon = 'c-icon-trailer';
describe('Render TaskListMode card for RoRo unaccompanied freight', () => {
  it('should not render the driver and passenger details for Roro unaccompanied freight', () => {
    render(<TaskListMode roroData={roroData} target={target} movementModeIcon={movementModeIcon} />);

    expect(screen.queryByText('Driver details')).not.toBeInTheDocument();
    expect(screen.queryByText('Passenger details')).not.toBeInTheDocument();
  });
});
