const PNR_DATA = {
  id: 'pnr-request-id',
  question: 'Do you need to view Passenger Name Record (PNR) data',
  options: [
    {
      label: 'Yes',
      value: 'true',
    },
    {
      label: 'No',
      value: 'false',
    },
  ],
  text: {
    firstLine: 'This includes both new PNR data, and data older than 6 months',
    secondLine: "You only need access if you're working to prevent, detect or investivate terrorist offencesor serious crime, or to protect the vital interests of an individual.",
    thirdLine: 'This has to be a necessary and proportionate requirement of the work you are doing',
    errorText: 'Select if you want to view PNR data',
  },
  confirmation: {
    approve: {
      text: {
        title: 'You can now view PNR data.',
        body: {
          title: 'What happens next',
          firstLine: 'Data up to 6 months old will be visible',
          secondLine: 'Data over 6 months old will be hidden but you will be able to provide justifications to show this data',
        },
      },
    },
    reject: {
      text: {
        title: 'Continue without viewing PNR data',
      },
    },
  },
};

export default PNR_DATA;
