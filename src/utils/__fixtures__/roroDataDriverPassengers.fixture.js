const roroDataDriver1Pax = {
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
};

const roroDataDriver2Pax = {
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
    {
      name: 'Sponge Bob',
      dob: '27/10/1970',
      gender: 'M',
      docNumber: '',
      docExpiry: '',
      poleId: 'ROROXML:P=26elrt61742c7a2c44f7e47ff0b4a747',
      firstName: 'Sponge',
      lastName: 'Bob',
      middleName: '',
    },
  ],
};

const roroDataBlankDriver2Pax = {
  driver: {
    name: '',
    dob: '12/03/1971',
    gender: 'M',
    docNumber: '244746NL',
    docExpiry: '01/02/2021',
    poleId: 'ROROXML:P=33f544d684db9e59150ae84406709122',
    firstName: '',
    lastName: '',
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
    {
      name: 'Sponge Bob',
      dob: '27/10/1970',
      gender: 'M',
      docNumber: '',
      docExpiry: '',
      poleId: 'ROROXML:P=26elrt61742c7a2c44f7e47ff0b4a747',
      firstName: 'Sponge',
      lastName: 'Bob',
      middleName: '',
    },
  ],
};

const roroDataDriverNoPax = {
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
  passengers: [],
};

export { roroDataDriver1Pax, roroDataDriver2Pax, roroDataBlankDriver2Pax, roroDataDriverNoPax };
