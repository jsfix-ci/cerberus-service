const testInputDataFieldsComplete = {
  departureTime: 1596459900000,
  arrivalTime: 1596548700000,
  people: [
    {
      gender: 'M',
      fullName: 'Bob Brown',
      dateOfBirth: 435,
      role: 'DRIVER',
    },
  ],
  vehicles: [
    {
      registrationNumber: 'GB09KLT',
    },
    {
      registrationNumber: 'GB09KLT',
    },
  ],
  trailers: [
    {
      registrationNumber: 'NL-234-392',
    },
  ],
  organisations: [
    {
      name: null,
      type: 'ORGBOOKER',
    },
    {
      name: 'Uni Print',
      type: 'ORGACCOUNT',
    },
    {
      name: 'Matthesons',
      type: 'ORGHAULIER',
    },
  ],
  freight: {
    hazardousCargo: 'false',
    descriptionOfCargo: 'Printed Paper',
  },
  bookingDateTime: '2020-08-02T09:15:00',
  voyage: {
    departFrom: 'CAL',
    arriveAt: 'DOV',
    description: 'Stena voyage of Osprey',
  },
};

const testInputDataFieldsEmpty = {
  departureTime: null,
  arrivalTime: null,
  people: [],
  vehicles: [],
  trailers: [],
  organisations: [],
  voyage: {
    departFrom: null,
    arriveAt: null,
    description: null,
  },
};

const testOutputDataFieldsComplete = {
  account: {
    label: 'Account',
    name: 'Uni Print',
  },
  arrival: {
    date: '4 Aug 2020 at 14:45',
    description: 'DOV, 4 Aug 2020 at 14:45',
    fromNow: ', 9 months ago',
    label: 'Arrival due',
    location: 'DOV',
  },
  departure: {
    date: '3 Aug 2020 at 14:05',
    description: 'CAL, 3 Aug 2020 at 14:05',
    label: 'Departure',
    location: 'CAL',
  },
  driver: {
    dataExists: true,
    dateOfBirth: '01/01/1970',
    name: 'Bob Brown',
  },
  ferry: {
    description: 'Stena voyage of Osprey',
    label: 'Ferry',
  },
  haulier: {
    label: 'Haulier',
    name: 'Matthesons',
  },
  trailer: {
    dataExists: true,
    description: 'no description',
    label: 'Trailer',
    registration: 'NL-234-392',
  },
  vehicle: {
    dataExists: true,
    description: 'no description',
    label: 'Vehicle',
    registration: 'GB09KLT',
  },
};

const testOutputDataFieldsEmpty = {
  account: {
    label: 'Account',
    name: 'Unknown',
  },
  arrival: {
    date: 'unknown',
    description: 'unknown, unknown',
    fromNow: 'unknown',
    label: 'Arrival due',
    location: '',
  },
  departure: {
    date: 'unknown',
    description: 'unknown, unknown',
    label: 'Departure',
    location: '',
  },
  driver: {
    dataExists: false,
    name: '',
    dateOfBirth: undefined,
  },
  ferry: {
    description: '',
    label: 'Ferry',
  },
  haulier: {
    label: 'Haulier',
    name: 'Unknown',
  },
  trailer: {
    dataExists: false,
    description: 'no description',
    label: '',
    registration: '',
  },
  vehicle: {
    dataExists: false,
    description: 'no description',
    label: '',
    registration: '',
  },
};

export {
  testInputDataFieldsComplete,
  testInputDataFieldsEmpty,
  testOutputDataFieldsComplete,
  testOutputDataFieldsEmpty,
};
