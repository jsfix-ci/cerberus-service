export default {
  id: 'noteCerberus',
  version: '0.0.1',
  name: 'noteCerberus',
  title: 'Create a note (Cerberus)',
  type: 'form',
  components: [],
  pages: [{
    id: 'note',
    name: 'note',
    components: [
      {
        id: 'note',
        fieldId: 'note',
        label: 'Add a new note',
        type: 'textarea',
        rows: 3,
        required: true,
      },
    ],
    actions: [
      { type: 'submit', validate: true, label: 'Save' },
    ],
  }],
};
