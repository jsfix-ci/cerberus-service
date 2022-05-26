/* eslint-disable no-console */
import React from 'react';
import YesNoComponent from './YesNoComponent';

import './__assets__/JustificationForm.scss';

const PnrRequestForm = ({
  pnrData,
  handleChange,
  handleSubmit,
  hasError,
  isSubmitted,
}) => {
  return (
    <>
      {!isSubmitted && (
        <div className="govuk-width-container ">
          <main className="govuk-main-wrapper govuk-main-wrapper--auto-spacing" id="main-content" role="main">
            <div className="govuk-grid-row">
              <div className="govuk-grid-column-two-thirds">
                <YesNoComponent
                  pnrData={pnrData}
                  handleChange={handleChange}
                  nextAction={handleSubmit}
                  hasError={hasError}
                />
              </div>
            </div>
          </main>
        </div>
      )}
    </>
  );
};

export default PnrRequestForm;
