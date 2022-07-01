import { FORM_ACTIONS } from '../constants';

export default {
  id: 'completeTask',
  version: '0.0.1',
  name: 'completeTask',
  title: 'Complete task',
  type: 'wizard',
  components: [],
  pages: [
    {
      id: 'reason-for-completion',
      name: 'reason-for-completion',
      components: [
        {
          id: 'reasonForCompletion',
          fieldId: 'reasonForCompletion',
          label: 'Reason for completion',
          type: 'radios',
          required: true,
          custom_errors: [
            {
              type: 'required',
              message: 'You must indicate at least one reason for completing your assessment',
            },
          ],
          data: {
            options: [
              {
                value: 'NO_TARGET_REQUIRED',
                label: 'Credibility checks carried out no target required',
              },
              {
                value: 'FALSE_SELECTOR_MATCH',
                label: 'False BSM/selector match',
              },
              {
                value: 'ARRIVED',
                label: 'Vessel arrived',
              },
              {
                value: 'OTHER',
                label: 'Other',
              },
            ],
          },
        },
        {
          id: 'otherReasonForCompletion',
          fieldId: 'otherReasonForCompletion',
          label: 'Please specify',
          type: 'text',
          required: true,
          show_when: {
            field: 'reasonForCompletion',
            op: 'eq',
            value: 'OTHER',
          },
        },
      ],
      actions: [
        {
          type: FORM_ACTIONS.CANCEL,
          label: 'Cancel',
          classModifiers: 'secondary',
        },
        {
          type: 'navigate',
          label: 'Next',
          page: 'add-a-note',
          validate: true,
        },
      ],
    },
    {
      id: 'add-a-note',
      name: 'add-a-note',
      title: 'Add a note?',
      hint: 'Add any additional information related to your request',
      components: [
        {
          id: 'addANote',
          fieldId: 'addANote',
          label: 'Add a note',
          hint: 'Add any additional information related to your request',
          type: 'textarea',
          required: false,
        },
      ],
      actions: [
        {
          type: FORM_ACTIONS.CANCEL,
          label: 'Cancel',
          classModifiers: 'secondary',
        },
        {
          type: 'navigate',
          label: 'Previous',
          page: 'reason-for-completion',
        },
        {
          type: 'submit',
          label: 'Submit form',
          validate: true,
        },
      ],
    },
  ],
};
