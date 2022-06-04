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
              value: 'AIR_PASSENGER',
              label: 'Air passenger',
            },
          ],
        },
      },
      {
        id: 'selectors',
        fieldId: 'selectors',
        label: 'Selectors',
        type: 'radios',
        required: false,
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
