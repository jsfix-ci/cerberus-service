import React from 'react';

import { useFormSubmit } from '../../utils/Form/FormIO/formIOUtil';
import RenderForm from '../../components/RenderForm/RenderForm';
import Panel from '../../components/Panel/Panel';
import { FORM_NAMES } from '../../utils/constants';

const IssueTargetPage = () => {
  const submitForm = useFormSubmit();

  return (
    <RenderForm
      formName="targetInformationSheet"
      onSubmit={async (data, form) => {
        await submitForm(
          '/process-definition/key/assignTarget/submit-form',
          data.data.businessKey,
          form,
          data.data,
          FORM_NAMES.TARGET_INFORMATION_SHEET,
        );
      }}
    >
      <Panel title="Thank you for submitting the target information sheet." />
    </RenderForm>
  );
};

export default IssueTargetPage;
