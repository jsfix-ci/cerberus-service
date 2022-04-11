import React from 'react';

import { useFormSubmit } from '../../utils/formioSupport';
import RenderForm from '../../components/RenderForm';
import Panel from '../../govuk/Panel';
import { FORM_NAME_TARGET_INFORMATION_SHEET } from '../../constants';

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
          FORM_NAME_TARGET_INFORMATION_SHEET,
        );
      }}
    >
      <Panel title="Thank you for submitting the target information sheet." />
    </RenderForm>
  );
};

export default IssueTargetPage;
