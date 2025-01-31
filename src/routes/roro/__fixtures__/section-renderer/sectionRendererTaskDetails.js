const hasDriverNoPaxHasCategoryCounts = [
  {
    fieldSetName: 'Driver',
    hasChildSet: false,
    contents: [
      {
        fieldName: 'Name',
        type: 'STRING',
        content: 'Bobby Haymaker',
        versionLastUpdated: null,
        propName: 'name',
      },
      {
        fieldName: 'Date of birth',
        type: 'SHORT_DATE',
        content: null,
        versionLastUpdated: null,
        propName: 'dob',
      },
      {
        fieldName: 'Gender',
        type: 'STRING',
        content: null,
        versionLastUpdated: null,
        propName: 'gender',
      },
      {
        fieldName: 'Nationality',
        type: 'STRING',
        content: null,
        versionLastUpdated: null,
        propName: 'nationality',
      },
      {
        fieldName: 'Travel document type',
        type: 'STRING',
        content: null,
        versionLastUpdated: null,
        propName: 'docType',
      },
      {
        fieldName: 'Travel document number',
        type: 'STRING',
        content: null,
        versionLastUpdated: null,
        propName: 'docNumber',
      },
      {
        fieldName: 'Travel document expiry',
        type: 'SHORT_DATE',
        content: null,
        versionLastUpdated: null,
        propName: 'docExpiry',
      },
      {
        fieldName: 'Pole ID',
        type: 'HIDDEN',
        content: null,
        versionLastUpdated: null,
        propName: 'poleId',
      },
      {
        fieldName: 'First name',
        type: 'HIDDEN',
        content: null,
        versionLastUpdated: null,
        propName: 'firstName',
      },
      {
        fieldName: 'Last name',
        type: 'HIDDEN',
        content: null,
        versionLastUpdated: null,
        propName: 'lastName',
      },
      {
        fieldName: 'Middle name',
        type: 'HIDDEN',
        content: null,
        versionLastUpdated: null,
        propName: 'middleName',
      },
      {
        fieldName: 'Entity Search URL',
        type: 'HIDDEN',
        content: null,
        versionLastUpdated: null,
        propName: 'entitySearchUrl',
      },
    ],
    type: 'null',
    propName: 'driver',
  },
  {
    fieldSetName: 'Passengers',
    hasChildSet: true,
    contents: [],
    childSets: [],
    type: 'STANDARD',
    propName: 'passengers',
  },
  {
    fieldSetName: 'Occupants',
    hasChildSet: false,
    contents: [
      {
        fieldName: 'OAPs',
        type: 'STRING',
        content: '0',
        versionLastUpdated: null,
        propName: 'oapCount',
      },
      {
        fieldName: 'Adults',
        type: 'STRING',
        content: '1',
        versionLastUpdated: null,
        propName: 'adultCount',
      },
      {
        fieldName: 'Children',
        type: 'STRING',
        content: '0',
        versionLastUpdated: null,
        propName: 'childCount',
      },
      {
        fieldName: 'Infants',
        type: 'STRING',
        content: '0',
        versionLastUpdated: null,
        propName: 'infantCount',
      },
      {
        fieldName: 'Total occupants',
        type: 'STRING',
        content: '1',
        versionLastUpdated: null,
        propName: 'totalOccupants',
      },
      {
        fieldName: 'Unknown',
        type: 'STRING',
        content: null,
        versionLastUpdated: null,
        propName: 'unknownCount',
      },
    ],
    type: 'null',
    propName: 'occupants',
  },
];

const noDriverNoPaxHasCategoryCounts = [
  {
    fieldSetName: 'Driver',
    hasChildSet: false,
    contents: [],
    type: 'null',
    propName: 'driver',
  },
  {
    fieldSetName: 'Passengers',
    hasChildSet: true,
    contents: [],
    childSets: [],
    type: 'STANDARD',
    propName: 'passengers',
  },
  {
    fieldSetName: 'Occupants',
    hasChildSet: false,
    contents: [
      {
        fieldName: 'OAPs',
        type: 'STRING',
        content: '0',
        versionLastUpdated: null,
        propName: 'oapCount',
      },
      {
        fieldName: 'Adults',
        type: 'STRING',
        content: '0',
        versionLastUpdated: null,
        propName: 'adultCount',
      },
      {
        fieldName: 'Children',
        type: 'STRING',
        content: '0',
        versionLastUpdated: null,
        propName: 'childCount',
      },
      {
        fieldName: 'Infants',
        type: 'STRING',
        content: '0',
        versionLastUpdated: null,
        propName: 'infantCount',
      },
      {
        fieldName: 'Total occupants',
        type: 'STRING',
        content: '0',
        versionLastUpdated: null,
        propName: 'totalOccupants',
      },
      {
        fieldName: 'Unknown',
        type: 'STRING',
        content: null,
        versionLastUpdated: null,
        propName: 'unknownCount',
      },
    ],
    type: 'null',
    propName: 'occupants',
  },
];

const noDriverNoPaxNoCategoryCounts = [
  {
    fieldSetName: 'Driver',
    hasChildSet: false,
    contents: [],
    type: 'null',
    propName: 'driver',
  },
  {
    fieldSetName: 'Passengers',
    hasChildSet: true,
    contents: [],
    childSets: [],
    type: 'STANDARD',
    propName: 'passengers',
  },
  {
    fieldSetName: 'Occupants',
    hasChildSet: false,
    contents: [
      {
        fieldName: 'OAPs',
        type: 'STRING',
        content: null,
        versionLastUpdated: null,
        propName: 'oapCount',
      },
      {
        fieldName: 'Adults',
        type: 'STRING',
        content: null,
        versionLastUpdated: null,
        propName: 'adultCount',
      },
      {
        fieldName: 'Children',
        type: 'STRING',
        content: null,
        versionLastUpdated: null,
        propName: 'childCount',
      },
      {
        fieldName: 'Infants',
        type: 'STRING',
        content: null,
        versionLastUpdated: null,
        propName: 'infantCount',
      },
      {
        fieldName: 'Total occupants',
        type: 'STRING',
        content: '1',
        versionLastUpdated: null,
        propName: 'totalOccupants',
      },
      {
        fieldName: 'Unknown',
        type: 'STRING',
        content: '1',
        versionLastUpdated: null,
        propName: 'unknownCount',
      },
    ],
    type: 'null',
    propName: 'occupants',
  },
];

const hasDriverHasPaxHasCategoryCounts = [
  {
    fieldSetName: 'Driver',
    hasChildSet: false,
    contents: [
      {
        fieldName: 'Name',
        type: 'STRING',
        content: 'Bobby Haymaker',
        versionLastUpdated: null,
        propName: 'name',
      },
      {
        fieldName: 'Date of birth',
        type: 'SHORT_DATE',
        content: null,
        versionLastUpdated: null,
        propName: 'dob',
      },
      {
        fieldName: 'Gender',
        type: 'STRING',
        content: null,
        versionLastUpdated: null,
        propName: 'gender',
      },
      {
        fieldName: 'Nationality',
        type: 'STRING',
        content: null,
        versionLastUpdated: null,
        propName: 'nationality',
      },
      {
        fieldName: 'Travel document type',
        type: 'STRING',
        content: null,
        versionLastUpdated: null,
        propName: 'docType',
      },
      {
        fieldName: 'Travel document number',
        type: 'STRING',
        content: null,
        versionLastUpdated: null,
        propName: 'docNumber',
      },
      {
        fieldName: 'Travel document expiry',
        type: 'SHORT_DATE',
        content: null,
        versionLastUpdated: null,
        propName: 'docExpiry',
      },
      {
        fieldName: 'Pole ID',
        type: 'HIDDEN',
        content: null,
        versionLastUpdated: null,
        propName: 'poleId',
      },
      {
        fieldName: 'First name',
        type: 'HIDDEN',
        content: null,
        versionLastUpdated: null,
        propName: 'firstName',
      },
      {
        fieldName: 'Last name',
        type: 'HIDDEN',
        content: null,
        versionLastUpdated: null,
        propName: 'lastName',
      },
      {
        fieldName: 'Middle name',
        type: 'HIDDEN',
        content: null,
        versionLastUpdated: null,
        propName: 'middleName',
      },
      {
        fieldName: 'Entity Search URL',
        type: 'HIDDEN',
        content: null,
        versionLastUpdated: null,
        propName: 'entitySearchUrl',
      },
    ],
    type: 'null',
    propName: 'driver',
  },
  {
    fieldSetName: 'Passengers',
    hasChildSet: true,
    contents: [],
    childSets: [
      {
        fieldSetName: '',
        hasChildSet: false,
        contents: [
          {
            fieldName: 'Name',
            type: 'STRING',
            content: 'Bob Brown',
            versionLastUpdated: null,
            propName: 'name',
          },
          {
            fieldName: 'Date of birth',
            type: 'SHORT_DATE',
            content: 435,
            versionLastUpdated: null,
            propName: 'dob',
          },
          {
            fieldName: 'Gender',
            type: 'STRING',
            content: 'M',
            versionLastUpdated: null,
            propName: 'gender',
          },
          {
            fieldName: 'Nationality',
            type: 'STRING',
            content: 'IR',
            versionLastUpdated: null,
            propName: 'nationality',
          },
          {
            fieldName: 'Travel document type',
            type: 'STRING',
            content: 'Passport',
            versionLastUpdated: null,
            propName: 'docType',
          },
          {
            fieldName: 'Travel document number',
            type: 'STRING',
            content: 'ST678457',
            versionLastUpdated: null,
            propName: 'docNumber',
          },
          {
            fieldName: 'Travel document expiry',
            type: 'SHORT_DATE',
            content: 18659,
            versionLastUpdated: null,
            propName: 'docExpiry',
          },
          {
            fieldName: 'Pole ID',
            type: 'HIDDEN',
            content: 'ROROXML:P=8049bc0c58748004ad81925020b26ce3',
            versionLastUpdated: null,
            propName: 'poleId',
          },
          {
            fieldName: 'First name',
            type: 'HIDDEN',
            content: 'Bob',
            versionLastUpdated: null,
            propName: 'firstName',
          },
          {
            fieldName: 'Last name',
            type: 'HIDDEN',
            content: 'Brown',
            versionLastUpdated: null,
            propName: 'lastName',
          },
          {
            fieldName: 'Middle name',
            type: 'HIDDEN',
            content: null,
            versionLastUpdated: null,
            propName: 'middleName',
          },
          {
            fieldName: 'Entity Search URL',
            type: 'HIDDEN',
            content: null,
            versionLastUpdated: null,
            propName: 'entitySearchUrl',
          },
          {
            fieldName: 'Entity Search URL',
            type: 'HIDDEN',
            content: null,
            versionLastUpdated: null,
            propName: 'entitySearchUrl',
          },
        ],
        type: 'null',
        propName: '',
      },
      {
        fieldSetName: '',
        hasChildSet: false,
        contents: [
          {
            fieldName: 'Name',
            type: 'STRING',
            content: 'Jane Brown',
            versionLastUpdated: null,
            propName: 'name',
          },
          {
            fieldName: 'Date of birth',
            type: 'SHORT_DATE',
            content: 435,
            versionLastUpdated: null,
            propName: 'dob',
          },
          {
            fieldName: 'Gender',
            type: 'STRING',
            content: 'M',
            versionLastUpdated: null,
            propName: 'gender',
          },
          {
            fieldName: 'Nationality',
            type: 'STRING',
            content: 'IR',
            versionLastUpdated: null,
            propName: 'nationality',
          },
          {
            fieldName: 'Travel document type',
            type: 'STRING',
            content: 'Passport',
            versionLastUpdated: null,
            propName: 'docType',
          },
          {
            fieldName: 'Travel document number',
            type: 'STRING',
            content: 'ST678457',
            versionLastUpdated: null,
            propName: 'docNumber',
          },
          {
            fieldName: 'Travel document expiry',
            type: 'SHORT_DATE',
            content: 18659,
            versionLastUpdated: null,
            propName: 'docExpiry',
          },
          {
            fieldName: 'Pole ID',
            type: 'HIDDEN',
            content: 'ROROXML:P=8049bc0c58748004ad81925020b26ce2',
            versionLastUpdated: null,
            propName: 'poleId',
          },
          {
            fieldName: 'First name',
            type: 'HIDDEN',
            content: 'Jane',
            versionLastUpdated: null,
            propName: 'firstName',
          },
          {
            fieldName: 'Last name',
            type: 'HIDDEN',
            content: 'Brown',
            versionLastUpdated: null,
            propName: 'lastName',
          },
          {
            fieldName: 'Middle name',
            type: 'HIDDEN',
            content: null,
            versionLastUpdated: null,
            propName: 'middleName',
          },
          {
            fieldName: 'Entity Search URL',
            type: 'HIDDEN',
            content: null,
            versionLastUpdated: null,
            propName: 'entitySearchUrl',
          },
          {
            fieldName: 'Entity Search URL',
            type: 'HIDDEN',
            content: null,
            versionLastUpdated: null,
            propName: 'entitySearchUrl',
          },
        ],
        type: 'null',
        propName: '',
      },
    ],
    type: 'STANDARD',
    propName: 'passengers',
  },
  {
    fieldSetName: 'Occupants',
    hasChildSet: false,
    contents: [
      {
        fieldName: 'OAPs',
        type: 'STRING',
        content: '0',
        versionLastUpdated: null,
        propName: 'oapCount',
      },
      {
        fieldName: 'Adults',
        type: 'STRING',
        content: '3',
        versionLastUpdated: null,
        propName: 'adultCount',
      },
      {
        fieldName: 'Children',
        type: 'STRING',
        content: '0',
        versionLastUpdated: null,
        propName: 'childCount',
      },
      {
        fieldName: 'Infants',
        type: 'STRING',
        content: '0',
        versionLastUpdated: null,
        propName: 'infantCount',
      },
      {
        fieldName: 'Total occupants',
        type: 'STRING',
        content: '3',
        versionLastUpdated: null,
        propName: 'totalOccupants',
      },
      {
        fieldName: 'Unknown',
        type: 'STRING',
        content: null,
        versionLastUpdated: null,
        propName: 'unknownCount',
      },
    ],
    type: 'null',
    propName: 'occupants',
  },
];

const noDriverHasPaxHasCategoryCounts = [
  {
    fieldSetName: 'Driver',
    hasChildSet: false,
    contents: [],
    type: 'null',
    propName: 'driver',
  },
  {
    fieldSetName: 'Passengers',
    hasChildSet: true,
    contents: [],
    childSets: [
      {
        fieldSetName: '',
        hasChildSet: false,
        contents: [
          {
            fieldName: 'Name',
            type: 'STRING',
            content: 'Bob Brown',
            versionLastUpdated: null,
            propName: 'name',
          },
          {
            fieldName: 'Date of birth',
            type: 'SHORT_DATE',
            content: 435,
            versionLastUpdated: null,
            propName: 'dob',
          },
          {
            fieldName: 'Gender',
            type: 'STRING',
            content: 'M',
            versionLastUpdated: null,
            propName: 'gender',
          },
          {
            fieldName: 'Nationality',
            type: 'STRING',
            content: 'IR',
            versionLastUpdated: null,
            propName: 'nationality',
          },
          {
            fieldName: 'Travel document type',
            type: 'STRING',
            content: 'Passport',
            versionLastUpdated: null,
            propName: 'docType',
          },
          {
            fieldName: 'Travel document number',
            type: 'STRING',
            content: 'ST678457',
            versionLastUpdated: null,
            propName: 'docNumber',
          },
          {
            fieldName: 'Travel document expiry',
            type: 'SHORT_DATE',
            content: 18659,
            versionLastUpdated: null,
            propName: 'docExpiry',
          },
          {
            fieldName: 'Pole ID',
            type: 'HIDDEN',
            content: 'ROROXML:P=8049bc0c58748004ad81925020b26ce3',
            versionLastUpdated: null,
            propName: 'poleId',
          },
          {
            fieldName: 'First name',
            type: 'HIDDEN',
            content: 'Bob',
            versionLastUpdated: null,
            propName: 'firstName',
          },
          {
            fieldName: 'Last name',
            type: 'HIDDEN',
            content: 'Brown',
            versionLastUpdated: null,
            propName: 'lastName',
          },
          {
            fieldName: 'Middle name',
            type: 'HIDDEN',
            content: null,
            versionLastUpdated: null,
            propName: 'middleName',
          },
          {
            fieldName: 'Entity Search URL',
            type: 'HIDDEN',
            content: null,
            versionLastUpdated: null,
            propName: 'entitySearchUrl',
          },
          {
            fieldName: 'Entity Search URL',
            type: 'HIDDEN',
            content: null,
            versionLastUpdated: null,
            propName: 'entitySearchUrl',
          },
        ],
        type: 'null',
        propName: '',
      },
      {
        fieldSetName: '',
        hasChildSet: false,
        contents: [
          {
            fieldName: 'Name',
            type: 'STRING',
            content: 'Jane Brown',
            versionLastUpdated: null,
            propName: 'name',
          },
          {
            fieldName: 'Date of birth',
            type: 'SHORT_DATE',
            content: 435,
            versionLastUpdated: null,
            propName: 'dob',
          },
          {
            fieldName: 'Gender',
            type: 'STRING',
            content: 'M',
            versionLastUpdated: null,
            propName: 'gender',
          },
          {
            fieldName: 'Nationality',
            type: 'STRING',
            content: 'IR',
            versionLastUpdated: null,
            propName: 'nationality',
          },
          {
            fieldName: 'Travel document type',
            type: 'STRING',
            content: 'Passport',
            versionLastUpdated: null,
            propName: 'docType',
          },
          {
            fieldName: 'Travel document number',
            type: 'STRING',
            content: 'ST678457',
            versionLastUpdated: null,
            propName: 'docNumber',
          },
          {
            fieldName: 'Travel document expiry',
            type: 'SHORT_DATE',
            content: 18659,
            versionLastUpdated: null,
            propName: 'docExpiry',
          },
          {
            fieldName: 'Pole ID',
            type: 'HIDDEN',
            content: 'ROROXML:P=8049bc0c58748004ad81925020b26ce2',
            versionLastUpdated: null,
            propName: 'poleId',
          },
          {
            fieldName: 'First name',
            type: 'HIDDEN',
            content: 'Jane',
            versionLastUpdated: null,
            propName: 'firstName',
          },
          {
            fieldName: 'Last name',
            type: 'HIDDEN',
            content: 'Brown',
            versionLastUpdated: null,
            propName: 'lastName',
          },
          {
            fieldName: 'Middle name',
            type: 'HIDDEN',
            content: null,
            versionLastUpdated: null,
            propName: 'middleName',
          },
          {
            fieldName: 'Entity Search URL',
            type: 'HIDDEN',
            content: null,
            versionLastUpdated: null,
            propName: 'entitySearchUrl',
          },
          {
            fieldName: 'Entity Search URL',
            type: 'HIDDEN',
            content: null,
            versionLastUpdated: null,
            propName: 'entitySearchUrl',
          },
        ],
        type: 'null',
        propName: '',
      },
    ],
    type: 'STANDARD',
    propName: 'passengers',
  },
  {
    fieldSetName: 'Occupants',
    hasChildSet: false,
    contents: [
      {
        fieldName: 'OAPs',
        type: 'STRING',
        content: '0',
        versionLastUpdated: null,
        propName: 'oapCount',
      },
      {
        fieldName: 'Adults',
        type: 'STRING',
        content: '2',
        versionLastUpdated: null,
        propName: 'adultCount',
      },
      {
        fieldName: 'Children',
        type: 'STRING',
        content: '0',
        versionLastUpdated: null,
        propName: 'childCount',
      },
      {
        fieldName: 'Infants',
        type: 'STRING',
        content: '0',
        versionLastUpdated: null,
        propName: 'infantCount',
      },
      {
        fieldName: 'Total occupants',
        type: 'STRING',
        content: '2',
        versionLastUpdated: null,
        propName: 'totalOccupants',
      },
    ],
    type: 'null',
    propName: 'occupants',
  },
];

const noDriverNoPaxNoCategoryAndNoUnknownCounts = [
  {
    fieldSetName: 'Driver',
    hasChildSet: false,
    contents: [],
    type: 'null',
    propName: 'driver',
  },
  {
    fieldSetName: 'Passengers',
    hasChildSet: true,
    contents: [],
    childSets: [],
    type: 'STANDARD',
    propName: 'passengers',
  },
  {
    fieldSetName: 'Occupants',
    hasChildSet: false,
    contents: [
      {
        fieldName: 'OAPs',
        type: 'STRING',
        content: null,
        versionLastUpdated: null,
        propName: 'oapCount',
      },
      {
        fieldName: 'Adults',
        type: 'STRING',
        content: null,
        versionLastUpdated: null,
        propName: 'adultCount',
      },
      {
        fieldName: 'Children',
        type: 'STRING',
        content: null,
        versionLastUpdated: null,
        propName: 'childCount',
      },
      {
        fieldName: 'Infants',
        type: 'STRING',
        content: null,
        versionLastUpdated: null,
        propName: 'infantCount',
      },
      {
        fieldName: 'Total occupants',
        type: 'STRING',
        content: '0',
        versionLastUpdated: null,
        propName: 'totalOccupants',
      },
      {
        fieldName: 'Unknown',
        type: 'STRING',
        content: null,
        versionLastUpdated: null,
        propName: 'unknownCount',
      },
    ],
    type: 'null',
    propName: 'occupants',
  },
];

export {
  hasDriverNoPaxHasCategoryCounts,
  noDriverNoPaxHasCategoryCounts,
  noDriverNoPaxNoCategoryCounts,
  noDriverHasPaxHasCategoryCounts,
  hasDriverHasPaxHasCategoryCounts,
  noDriverNoPaxNoCategoryAndNoUnknownCounts,
};
