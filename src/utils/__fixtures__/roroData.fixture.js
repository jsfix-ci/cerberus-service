const testRoroData = {
  movementStatus: 'Pre-Arrival',
  bookingDateTime: '2020-08-02T09:15:00,2020-08-03T13:05:00',
  vessel: {
    name: 'DOVER SEAWAYS',
    company: 'DFDS',
  },
  eta: '2021-12-02T10:36:53Z',
  departureTime: '2020-08-03T13:05:00Z',
  arrivalLocation: 'CAL',
  departureLocation: 'DOV',
  vehicle: {
    colour: '',
    model: '',
    make: '',
    registrationNumber: '',
    type: '',
  },
  load: {
    manifestedLoad: 'Printed Paper',
    manifestedWeight: '',
    countryOfDestination: '',
  },
  account: {
    name: 'Univeral Printers Ltd',
    number: 'PO000359675',
  },
  driver: {
    name: 'Bob Brown',
    dob: '12/03/1971',
    gender: 'M',
    docNumber: '244746NL',
    docExpiry: '01/02/2021',
    poleId: 'ROROXML:P=33f544d684db9e59150ae84406709122',
    firstName: 'Bob',
    lastName: 'Brown',
    middleName: '',
  },
  passengers: [
    {
      name: 'Ben Bailey',
      dob: '27/10/1969',
      gender: 'M',
      docNumber: '',
      docExpiry: '',
      poleId: 'ROROXML:P=26ebab61705c7a2c44b5f47ff0b4a58a',
      firstName: 'Ben',
      lastName: 'Bailey',
      middleName: '',
    },
  ],
  haulier: {
    name: 'Matthesons',
    address: {
      line1: '',
      line2: '',
      line3: null,
      city: '',
      postCode: '',
      country: '',
    },
  },
};

export default testRoroData;
