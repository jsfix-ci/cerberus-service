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
        "You only need access if you're working to prevent, detect or investivate terrorist offencesor serious crime, or to protect the vital interests of an individual.",
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
            options: [
              {
                value: 'yes',
                label: 'Yes',
              },
              {
                value: 'no',
                label: 'No',
              },
            ],
          },
        },
      ],
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
