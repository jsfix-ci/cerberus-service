const MODE_OPTIONS = [
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

const assignedToMe = (assignee) => {
  return {
    id: 'assignedToMe',
    fieldId: 'assignedToMe',
    type: 'checkboxes',
    label: '',
    data: {
      options: [
        {
          value: assignee,
          label: 'Assigned to me',
        },
      ],
    },
  };
};

export const airpax = (assignee, show) => {
  return {
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
          show && assignedToMe(assignee),
          {
            id: 'search',
            fieldId: 'searchText',
            label: 'Search',
            type: 'text',
            required: false,
            placeholder: 'Passenger Name or Task Id',
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
};

export const roro = (assignee, show) => {
  return {
    id: 'filter',
    version: '0.0.1',
    name: 'filter',
    type: 'form',
    components: [],
    pages: [{
      id: 'filter',
      name: 'filter',
      components: [
        show && assignedToMe(assignee),
        {
          id: 'mode',
          fieldId: 'mode',
          label: 'Mode',
          type: 'checkboxes',
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
};
