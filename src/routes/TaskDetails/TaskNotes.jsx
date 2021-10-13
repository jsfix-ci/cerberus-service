import React from 'react';
// Utils
import { useFormSubmit } from '../../utils/formioSupport';
// Components / Pages
import RenderForm from '../../components/RenderForm';

const TaskNotesForm = ({ businessKey, processInstanceId, ...props }) => {
  const submitForm = useFormSubmit();
  return (
    <RenderForm
      onSubmit={async (data, form) => {
        await submitForm(
          '/process-definition/key/noteSubmissionWrapper/submit-form',
          businessKey,
          form,
          { ...data.data, processInstanceId },
          'noteCerberus',
        );
      }}
      {...props}
    />
  );
};

export default TaskNotesForm;
