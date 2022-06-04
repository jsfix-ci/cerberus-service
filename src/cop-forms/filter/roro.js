export default {
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
          options: [
            {
              value: '',
              label: '',
            },
            {
              value: 'RORO_UNACCOMPANIED_FREIGHT',
              label: 'RoRo unaccompanied freight',
            },
            {
              value: 'RORO_ACCOMPANIED_FREIGHT',
              label: 'RoRo accompanied freight',
            },
            {
              value: 'RORO_TOURIST',
              label: 'RoRo Tourist',
            },
          ],
        },
      },
      {
        id: 'hasSelectors',
        fieldId: 'hasSelectors',
        label: 'Selectors',
        type: 'radios',
        required: false,
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
              value: '',
              label: 'Both',
            },
          ],
        },
        show_when: {
          field: 'mode',
          op: 'in',
          values: ['RORO_UNACCOMPANIED_FREIGHT', 'RORO_ACCOMPANIED_FREIGHT', 'RORO_TOURIST'],
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
