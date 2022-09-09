import { MODE } from '../utils/constants';

const MODE_OPTIONS = {
  [MODE.RORO]: {
    type: 'checkboxes',
    options: [
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
    required: false,
  },
  [MODE.AIRPAX]: {
    type: 'select',
    options: [
      {
        value: 'AIR_PASSENGER',
        label: 'Air passenger',
      },
    ],
    required: true,
  },
};

const getAssigneeComponent = (assignee) => {
  return {
    id: 'assignedToMe',
    fieldId: 'assignedToMe',
    type: 'checkboxes',
    label: 'Assigned to me',
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

const filter = (assignee, showAssignee, mode) => {
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
          showAssignee && getAssigneeComponent(assignee),
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
            type: MODE_OPTIONS[mode].type,
            required: MODE_OPTIONS[mode].required,
            dynamicOptions: true,
            data: {
              options: MODE_OPTIONS[mode].options,
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
            item: { value: 'id', label: 'name' },
            multi: true,
            required: false,
            useCustomOptions: true,
          },
          {
            id: 'journeyDirections',
            fieldId: 'journeyDirections',
            label: 'Direction of travel',
            type: 'checkboxes',
            data: {
              options: [
                {
                  value: 'INBOUND',
                  label: 'Inbound',
                },
                {
                  value: 'OUTBOUND',
                  label: 'Outbound',
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
      },
    ],
  };
};

export default filter;
