const MODE_OPTIONS = [
  {
    value: '',
    label: '',
    showFor: ['RORO'],
  },
  {
    value: 'AIR_PASSENGER',
    label: 'Air passenger',
    showFor: ['AIRPAX'],
  },
  {
    value: 'RORO_UNACCOMPANIED_FREIGHT',
    label: 'RoRo unaccompanied freight',
    showFor: ['RORO'],
  },
  {
    value: 'RORO_ACCOMPANIED_FREIGHT',
    label: 'RoRo accompanied freight',
    showFor: ['RORO'],
  },
  {
    value: 'RORO_TOURIST',
    label: 'RoRo Tourist',
    showFor: ['RORO'],
  },
];

export const airpax = {
  id: 'filter',
  version: '0.0.1',
  name: 'filter',
  type: 'form',
  components: [],
  pages: [
    {
      id: 'filter',
      name: 'filter',
      components: [
        {
          id: 'search',
          fieldId: 'searchText',
          label: 'Search',
          type: 'textinput',
          required: false,
          dynamicOptions: false
        },
        {
          id: 'mode',
          fieldId: 'mode',
          label: 'Mode',
          type: 'select',
          required: true,
          dynamicOptions: true,
          data: {
            options: MODE_OPTIONS.filter((opt) => opt.showFor.includes('AIRPAX')),
          },
        },
        {
          id: 'selectors',
          fieldId: 'selectors',
          label: 'Selectors',
          type: 'radios',
          required: true,
          dynamicOptions: true,
          data: {
            options: [
              {
                value: 'NOT_PRESENT',
                label: 'Has no selector',
              },
              {
                value: 'PRESENT',
                label: 'Has selector',
              },
              {
                value: 'ANY',
                label: 'Both',
              },
            ],
          },
        },
        {
          id: 'rules',
          fieldId: 'rules',
          label: 'Rule matches',
          type: 'multiautocomplete',
          multi: true,
          required: false,
        },
      ],
      actions: [
        {
          type: 'submit',
          validate: true,
          label: 'Apply',
        },
      ],
    },
  ],
};

export const roro = {
  id: 'filter',
  version: '0.0.1',
  name: 'filter',
  type: 'form',
  components: [],
  pages: [{
    id: 'filter',
    name: 'filter',
    components: [
      {
        id: 'mode',
        fieldId: 'mode',
        label: 'Mode',
        type: 'select',
        required: true,
        dynamicOptions: true,
        data: {
          options: MODE_OPTIONS.filter((opt) => opt.showFor.includes('RORO')),
        },
      },
      {
        id: 'hasSelectors',
        fieldId: 'hasSelectors',
        label: 'Selectors',
        type: 'radios',
        required: true,
        dynamicOptions: true,
        data: {
          options: [
            {
              value: 'false',
              label: 'Has no selector',
            },
            {
              value: 'true',
              label: 'Has selector',
            },
            {
              value: 'both',
              label: 'Both',
            },
          ],
        },
        show_when: {
          field: 'mode',
          op: 'in',
          values: MODE_OPTIONS.map((opt) => opt.value).filter((val) => !!val),
        },
      },
    ],
    actions: [
      {
        type: 'submit',
        validate: true,
        label: 'Apply',
      },
    ],
  }],
};
