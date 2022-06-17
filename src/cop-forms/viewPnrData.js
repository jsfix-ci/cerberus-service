import { FORM_ACTIONS } from '../constants';

const YES = { value: 'yes', label: 'Yes' };
const NO = { value: 'no', label: 'No' };

export default {
  id: 'view-pnr-data-request',
  version: '1.0.0',
  name: 'cop-view-pnr-data',
  title: 'View passenger name record data',
  type: 'wizard',
  components: [],
  pages: [
    {
      id: 'view-pnr-data',
      name: 'view-pnr-data',
      title: 'Do you need to view Passenger Name Record (PNR) data',
      components: [
        'This includes both new PNR data, and data older than 6 months.',
        'You only need access if you\'re working to prevent, detect or investigate terrorist offences or serious crime, or to protect the vital interests of an individual.',
        'This has to be a necessary and proportionate requirement of the work you are doing.',
        {
          id: 'viewPnrData',
          fieldId: 'viewPnrData',
          type: 'radios',
          required: true,
          custom_errors: [
            {
              type: 'required',
              message: 'Select if you want to view PNR data',
            },
          ],
          data: {
            options: [YES, NO],
          },
        },
      ],
      actions: [
        {
          type: FORM_ACTIONS.NEXT,
          label: 'Continue',
          validate: true,
        },
      ],
    },
    {
      id: 'working-from-approved-site',
      name: 'working-from-approved-site',
      title: 'Are you working from a site that has been approved to access PNR data from?',
      components: [
        {
          id: 'approvedSite',
          fieldId: 'approvedSite',
          type: 'radios',
          required: true,
          custom_errors: [
            {
              type: 'required',
              message: 'Select if you want to view PNR data',
            },
          ],
          data: {
            options: [YES, NO],
          },
        },
      ],
      show_when: {
        field: 'viewPnrData',
        op: 'eq',
        value: YES.value,
      },
      actions: [
        {
          type: 'navigate',
          label: 'Back',
          page: 'view-pnr-data',
          classModifiers: 'secondary',
        },
        {
          type: FORM_ACTIONS.NEXT,
          label: 'Continue',
          validate: true,
        },
      ],
    },
    {
      id: 'continue-without-pnr-data',
      name: 'continue-without-pnr-data',
      title: 'Continue without viewing PNR data',
      components: [],
      show_when: {
        field: 'viewPnrData',
        op: 'eq',
        value: NO.value,
      },
      actions: [
        {
          type: 'navigate',
          label: 'Back',
          page: 'view-pnr-data',
          classModifiers: 'secondary',
        },
        {
          type: 'submit',
          label: 'Continue',
          validate: true,
        },
      ],
    },
    {
      id: 'can-only-view-pnr-data',
      name: 'can-only-view-pnr-data',
      title: 'You can only view PNR data if you are working from an approved site',
      components: [],
      show_when: {
        field: 'approvedSite',
        op: 'eq',
        value: NO.value,
      },
      actions: [
        {
          type: 'navigate',
          label: 'Back',
          page: 'working-from-approved-site',
          classModifiers: 'secondary',
        },
        {
          type: 'submit',
          label: 'Continue without access to PNR data',
          validate: true,
        },
      ],
    },
    {
      id: 'can-view-pnr-data',
      name: 'can-view-pnr-data',
      components: [
        {
          type: 'html',
          tagName: 'div',
          content: 'You can now view PNR data.',
          className: 'govuk-panel govuk-panel__body govuk-panel--confirmation',
        },
        {
          type: 'heading',
          size: 'm',
          content: 'What happens next',
        },
        {
          type: 'html',
          tagName: 'ul',
          content: '<li>Data up to 6 months old will be visible</li>',
        },
      ],
      show_when: {
        field: 'approvedSite',
        op: 'eq',
        value: YES.value,
      },
      actions: [
        {
          type: 'submit',
          label: 'Continue',
          validate: true,
        },
      ],
    },
  ],
};
