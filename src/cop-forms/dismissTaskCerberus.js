export default {
  id: 'dismissTask',
  version: '0.0.1',
  name: 'dismissTask',
  title: 'Dismiss task',
  type: 'wizard',
  components: [],
  pages: [
    {
      id: 'reason-for-dismissing',
      name: 'reason-for-dismissing',
      components: [
        {
          id: 'reasonForDismissing',
          fieldId: 'reasonForDismissing',
          label: 'Reason for dismissing',
          type: 'radios',
          required: true,
          custom_errors: [
            {
              type: 'required',
              message: 'You must indicate at least one reason for dismissing the task',
            },
          ],
          data: {
            options: [
              {
                value: 'ARRIVED',
                label: 'Arrived at port',
              },
              {
                value: 'FALSE_RULE_MATCH',
                label: 'False rule match',
              },
              {
                value: 'RESOURCE_REDIRECTED',
                label: 'Resource redirected',
              },
              {
                value: 'OTHER',
                label: 'Other',
              },
            ],
          },
        },
        {
          id: 'otherReasonToDismiss',
          fieldId: 'otherReasonToDismiss',
          label: 'Please specify',
          type: 'text',
          required: true,
          show_when: {
            field: 'reasonForDismissing',
            op: 'eq',
            value: 'OTHER',
          },
        },
      ],
      actions: [
        {
          type: 'cancel',
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
      hint: 'Add any additional information related to your request',
      components: [
        {
          id: 'addANote',
          fieldId: 'addANote',
          label: 'Add a note',
          hint: 'Add any additional information related to your request',
          type: 'textarea',
        },
      ],
      actions: [
        {
          type: 'cancel',
          label: 'Cancel',
          classModifiers: 'secondary',
        },
        {
          type: 'navigate',
          label: 'Previous',
          page: 'reason-for-dismissing',
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
