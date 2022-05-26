import React from 'react';

import { FormGroup,
  Radios,
  ButtonGroup,
  Button,
  Markup,
  ErrorSummary } from '@ukhomeoffice/cop-react-components';

const YesNoComponent = ({ pnrResource, handleChange, nextAction, hasError }) => {
  return (
    <>
      {hasError
      && (
      <ErrorSummary
        errors={[
          {
            error: `${pnrResource.text.errorText}`,
          },
        ]}
      />
      )}
      <FormGroup
        id="inline"
        label={(
          <>
            <h1 className="govuk-heading-l">{pnrResource.question}</h1>
            <Markup>{pnrResource.text.firstLine}</Markup>
            <Markup>{pnrResource.text.secondLine}</Markup>
            <Markup>{pnrResource.text.thirdLine}</Markup>
          </>
      )}
        error={hasError && pnrResource.text.errorText}
      >
        <Radios
          id="inline"
          fieldId={pnrResource.id}
          options={[
            ...pnrResource.options,
          ]}
          onChange={(e) => handleChange(e)}
        />
        <br />
        <ButtonGroup>
          <Button name={pnrResource.id} onClick={(e) => nextAction(e)}>
            Continue
          </Button>
        </ButtonGroup>
      </FormGroup>
    </>
  );
};

export default YesNoComponent;
