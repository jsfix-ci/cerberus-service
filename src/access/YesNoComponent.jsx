import React from 'react';

import { FormGroup,
  Radios,
  ButtonGroup,
  Button,
  Markup,
  ErrorSummary } from '@ukhomeoffice/cop-react-components';

const YesNoComponent = ({ pnrData, handleChange, nextAction, hasError }) => {
  return (
    <>
      {hasError
      && (
      <ErrorSummary
        errors={[
          {
            error: `${pnrData.text.errorText}`,
          },
        ]}
      />
      )}
      <FormGroup
        id="inline"
        label={(
          <>
            <h1 className="govuk-heading-l">{pnrData.question}</h1>
            <Markup>{pnrData.text.firstLine}</Markup>
            <Markup>{pnrData.text.secondLine}</Markup>
            <Markup>{pnrData.text.thirdLine}</Markup>
          </>
      )}
        error={hasError && pnrData.text.errorText}
      >
        <Radios
          id="inline"
          fieldId={pnrData.id}
          options={[
            ...pnrData.options,
          ]}
          onChange={(e) => handleChange(e)}
        />
        <br />
        <ButtonGroup>
          <Button name={pnrData.id} onClick={(e) => nextAction(e)}>
            Continue
          </Button>
        </ButtonGroup>
      </FormGroup>
    </>
  );
};

export default YesNoComponent;
