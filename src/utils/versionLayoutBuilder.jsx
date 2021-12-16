import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { formatKey, formatField } from './formatField';

const renderVersionSection = ({ fieldSetName, contents }) => {
  if (contents.length > 0) {
    const jsxElement = contents.map((content) => {
      if (!content.type.includes('HIDDEN')) {
        return (
          <div className="govuk-task-details-grid-item" key={uuidv4()}>
            <ul>
              <li className="govuk-grid-key font__light">{formatKey(content.type, content.fieldName)}</li>
              <li className="govuk-grid-value font__bold">{formatField(content.type, content.content)}</li>
            </ul>
          </div>
        );
      }
    });
    return (
      <div className="task-details-container border-bottom">
        <h3 className="title-heading">{fieldSetName}</h3>
        <div className="govuk-task-details-grid-column">
          {jsxElement}
        </div>
      </div>
    );
  }
};

const renderTargetingIndicatorsSection = ({ type, hasChildSet, childSets }) => {
  if (hasChildSet) {
    const targetingIndicators = childSets.map((childSet) => {
      const indicator = childSet.contents.filter(({ propName }) => propName === 'userfacingtext')[0].content;
      const score = childSet.contents.filter(({ propName }) => propName === 'score')[0].content;
      if (!type.includes('HIDDEN')) {
        return (
          <div className="govuk-task-details-grid-row bottom-border" key={uuidv4()}>
            {type.includes('CHANGED') ? <span className="govuk-grid-key font__light task-versions--highlight">{indicator}</span> : <span className="govuk-grid-key font__light">{indicator}</span>}
            <span className="govuk-grid-value font__bold">{formatField(type, score)}</span>
          </div>
        );
      }
    });
    if (targetingIndicators.length > 0) {
      return (
        <>
          <div className="govuk-task-details-indicator-container">
            <div className="govuk-task-details-grid-row bottom-border">
              <span className="govuk-grid-key font__light">Indicator</span>
              <span className="govuk-grid-value font__light">Score</span>
            </div>
            {targetingIndicators}
          </div>
        </>
      );
    }
  }
};

const renderVehicleSection = ({ contents }) => {
  if (contents.length > 0) {
    const vehicleVrn = contents.filter(({ propName }) => propName === 'registrationNumber')[0];
    const vehicleMake = contents.filter(({ propName }) => propName === 'make')[0];
    const vehicleModel = contents.filter(({ propName }) => propName === 'model')[0];
    const vehicleType = contents.filter(({ propName }) => propName === 'type')[0];
    const vehicleCountryOfReg = contents.filter(({ propName }) => propName === 'registrationNationality')[0];
    const vehicleColour = contents.filter(({ propName }) => propName === 'colour')[0];
    const vehicleNetWeight = contents.filter(({ propName }) => propName === 'netWeight')[0];
    const vehicleGrossWeight = contents.filter(({ propName }) => propName === 'grossWeight')[0];
    return (
      <div className="task-details-container border-bottom">
        <h3 className="title-heading">Vehicle</h3>
        <div className="govuk-task-details-grid-column">
          <div className="govuk-task-details-grid-item">
            <ul>
              <li className="govuk-grid-key font__light">{formatKey(vehicleVrn.type, 'VRN')}</li>
              <li className="govuk-grid-value font__bold">{formatField(vehicleVrn.type, vehicleVrn.content)}</li>
            </ul>
          </div>
          <div className="govuk-task-details-grid-item">
            <ul>
              <li className="govuk-grid-key font__light">{formatKey(vehicleType.type, 'Type')}</li>
              <li className="govuk-grid-value font__bold">{formatField(vehicleType.type, vehicleType.content)}</li>
            </ul>
          </div>
          <div className="govuk-task-details-grid-item">
            <ul>
              <li className="govuk-grid-key font__light">{formatKey(vehicleMake.type, 'Make')}</li>
              <li className="govuk-grid-value font__bold">{formatField(vehicleMake.type, vehicleMake.content)}</li>
            </ul>
          </div>
          <div className="govuk-task-details-grid-item">
            <ul>
              <li className="govuk-grid-key font__light">{formatKey(vehicleModel.type, 'Model')}</li>
              <li className="govuk-grid-value font__bold">{formatField(vehicleModel.type, vehicleModel.content)}</li>
            </ul>
          </div>
          <div className="govuk-task-details-grid-item">
            <ul>
              <li className="govuk-grid-key font__light">{formatKey(vehicleCountryOfReg.type, 'Country of registration')}</li>
              <li className="govuk-grid-value font__bold">{formatField(vehicleCountryOfReg.type, vehicleCountryOfReg.content)}</li>
            </ul>
          </div>
          <div className="govuk-task-details-grid-item">
            <ul>
              <li className="govuk-grid-key font__light">{formatKey(vehicleColour.type, 'Colour')}</li>
              <li className="govuk-grid-value font__bold">{formatField(vehicleColour.type, vehicleColour.content)}</li>
            </ul>
          </div>
          <div className="govuk-task-details-grid-item">
            <ul>
              <li className="govuk-grid-key font__light">{formatKey(vehicleNetWeight.type, 'Net weight')}</li>
              <li className="govuk-grid-value font__bold">{formatField(vehicleNetWeight.type, vehicleNetWeight.content)}</li>
            </ul>
          </div>
          <div className="govuk-task-details-grid-item">
            <ul>
              <li className="govuk-grid-key font__light">{formatKey(vehicleGrossWeight.type, 'Gross weight')}</li>
              <li className="govuk-grid-value font__bold">{formatField(vehicleGrossWeight.type, vehicleGrossWeight.content)}</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
};

const renderTrailerSection = ({ contents }) => {
  if (contents.length > 0) {
    const trailerRegistrationNumber = contents.filter(({ propName }) => propName === 'trailerRegistrationNumber')[0];
    const trailerType = contents.filter(({ propName }) => propName === 'trailerType')[0];
    const trailerCountryOfRegistration = contents.filter(({ propName }) => propName === 'trailerRegistrationNationality')[0];
    const trailerLength = contents.filter(({ propName }) => propName === 'trailerLength')[0];
    const trailerHeight = contents.filter(({ propName }) => propName === 'trailerHeight')[0];
    const trailerEmptyOrLoaded = contents.filter(({ propName }) => propName === 'trailerEmptyOrLoaded')[0];
    return (
      <div className="task-details-container border-bottom">
        <h3 className="title-heading">Trailer</h3>
        <div className="govuk-task-details-grid-column">
          <div className="govuk-task-details-grid-item">
            <ul>
              <li className="govuk-grid-key font__light">{formatKey(trailerRegistrationNumber.type, 'Trailer Registration Number')}</li>
              <li className="govuk-grid-value font__bold">{formatField(trailerRegistrationNumber.type, trailerRegistrationNumber.content)}</li>
            </ul>
          </div>
          <div className="govuk-task-details-grid-item">
            <ul>
              <li className="govuk-grid-key font__light">{formatKey(trailerType.type, 'Type')}</li>
              <li className="govuk-grid-value font__bold">{formatField(trailerType.type, trailerType.content)}</li>
            </ul>
          </div>
          <div className="govuk-task-details-grid-item">
            <ul>
              <li className="govuk-grid-key font__light">{formatKey(trailerLength.type, 'Length')}</li>
              <li className="govuk-grid-value font__bold">{formatField(trailerLength.type, trailerLength.content)}</li>
            </ul>
          </div>
          <div className="govuk-task-details-grid-item">
            <ul>
              <li className="govuk-grid-key font__light">{formatKey(trailerHeight.type, 'Height')}</li>
              <li className="govuk-grid-value font__bold">{formatField(trailerHeight.type, trailerHeight.content)}</li>
            </ul>
          </div>
          <div className="govuk-task-details-grid-item">
            <ul>
              <li className="govuk-grid-key font__light">{formatKey(trailerCountryOfRegistration.type, 'Country of registration')}</li>
              <li className="govuk-grid-value font__bold">{formatField(trailerCountryOfRegistration.type, trailerCountryOfRegistration.content)}</li>
            </ul>
          </div>
          <div className="govuk-task-details-grid-item">
            <ul>
              <li className="govuk-grid-key font__light">{formatKey(trailerEmptyOrLoaded.type, 'Empty or loaded')}</li>
              <li className="govuk-grid-value font__bold">{formatField(trailerEmptyOrLoaded.type, trailerEmptyOrLoaded.content)}</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
};

const renderHaulierSection = ({ contents }) => {
  if (contents.length > 0) {
    const haulierName = contents.filter(({ propName }) => propName === 'name')[0];
    const haulierAddress = contents.filter(({ propName }) => propName === 'address')[0];
    const haulierTelephone = contents.filter(({ propName }) => propName === 'telephone')[0];
    const haulierMobile = contents.filter(({ propName }) => propName === 'mobile')[0];
    return (
      <div className="task-details-container border-bottom">
        <h3 className="title-heading">Haulier</h3>
        <div className="govuk-task-details-grid-column">
          <div className="govuk-task-details-grid-item">
            <ul>
              <li className="govuk-grid-key font__light">{formatKey(haulierName.type, 'Name')}</li>
              <li className="govuk-grid-value font__bold">{formatField(haulierName.type, haulierName.content)}</li>
            </ul>
          </div>
          <div className="govuk-task-details-grid-item">
            <ul>
              <li className="govuk-grid-key font__light">{formatKey(haulierAddress.type, 'Address')}</li>
              <li className="govuk-grid-value font__bold">{formatField(haulierAddress.type, haulierAddress.content)}</li>
            </ul>
          </div>
          <div className="govuk-task-details-grid-item">
            <ul>
              <li className="govuk-grid-key font__light">{formatKey(haulierTelephone.type, 'Telephone')}</li>
              <li className="govuk-grid-value font__bold">{formatField(haulierTelephone.type, haulierTelephone.content)}</li>
            </ul>
          </div>
          <div className="govuk-task-details-grid-item">
            <ul>
              <li className="govuk-grid-key font__light">{formatKey(haulierMobile.type, 'Mobile')}</li>
              <li className="govuk-grid-value font__bold">{formatField(haulierMobile.type, haulierMobile.content)}</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
};

const renderPassengersSection = (fieldSetName, passenger) => {
  if (passenger.length > 0) {
    const jsxPassengerElement = passenger.map((content) => {
      if (!content.type.includes('HIDDEN')) {
        return (
          <div className="govuk-task-details-grid-item" key={uuidv4()}>
            <ul>
              <li className="govuk-grid-key font__light">{formatKey(content.type, content.fieldName)}</li>
              <li className="govuk-grid-value font__bold">{formatField(content.type, content.content)}</li>
            </ul>
          </div>
        );
      }
    });
    return (
      <div className="task-details-container border-bottom">
        <h3 className="title-heading">{fieldSetName}</h3>
        <div className="govuk-task-details-grid-column">
          {jsxPassengerElement}
        </div>
      </div>
    );
  }
};

const renderHiddenPassengersChildsets = (otherPassengers) => {
  if (otherPassengers.length > 0) {
    const jsxPassengerElement = otherPassengers.map((hiddenPassenger) => {
      return hiddenPassenger.contents.map((passenger) => {
        if (!passenger.type.includes('HIDDEN')) {
          return (
            <div className="govuk-task-details-grid-item" key={uuidv4()}>
              <ul>
                <li className="govuk-grid-key font__light">{formatKey(passenger.type, passenger.fieldName)}</li>
                <li className="govuk-grid-value font__bold">{formatField(passenger.type, passenger.content)}</li>
              </ul>
            </div>
          );
        }
      });
    });
    return (
      <details className="govuk-details" data-module="govuk-details">
        <summary className="govuk-details__summary">
          <span className="govuk-details__summary-text">
            Other passengers
          </span>
        </summary>
        <div className="govuk-hidden-passengers">
          {jsxPassengerElement}
        </div>
      </details>
    );
  }
};

const renderOccupantsSection = ({ fieldSetName, childSets }) => {
  const firstPassenger = childSets[0].contents;
  const otherPassengers = childSets.slice(1);
  const firstPassengerElement = renderPassengersSection(fieldSetName, firstPassenger);
  const hiddenPaddengersElement = renderHiddenPassengersChildsets(otherPassengers);
  return (
    <>
      {firstPassengerElement}
      {hiddenPaddengersElement}
    </>
  );
};

const renderRulesSection = (field) => {
  if (field.childSets.length > 0) {
    const firstRule = field.childSets[0];
    const otherRules = field.childSets.slice(1);
    return (
      <div>
        <div>
          <h2 className="govuk-heading-m">{field.fieldSetName}</h2>
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-one-quarter">
              <h4 className="govuk-heading-s">Rule name</h4>
              <p>{firstRule.contents.find((item) => item.propName === 'name').content}</p>
            </div>
            <div className="govuk-grid-column-one-quarter">
              <h4 className="govuk-heading-s">Threat</h4>
              <p className="govuk-body govuk-tag govuk-tag--positiveTarget">
                {firstRule.contents.find((item) => item.propName === 'rulePriority').content}
              </p>
            </div>

            <div className="govuk-grid-column-one-quarter">
              <h4 className="govuk-heading-s">Rule verison</h4>
              <p>{firstRule.contents.find((item) => item.propName === 'ruleVersion').content}</p>
            </div>
            <div className="govuk-grid-column-one-quarter">
              <h4 className="govuk-heading-s">Abuse Type</h4>
              <p>{firstRule.contents.find((item) => item.propName === 'abuseType').content}</p>
            </div>
          </div>
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-three-quarters">
              <h4 className="govuk-heading-s">Description</h4>
              <p>{firstRule.contents.find((item) => item.propName === 'description').content}</p>
            </div>
            <div className="govuk-grid-column-one-quarter">
              <h4 className="govuk-heading-s">Agency</h4>
              <p>{firstRule.contents.find((item) => item.propName === 'agencyCode').content}</p>
            </div>
          </div>
        </div>

        { otherRules && (
          <div className="govuk-!-margin-top-9">
            <h2 className="govuk-heading-m">Other rule matches ({otherRules.length})</h2>
            {otherRules.map((rule, index) => (
              <div key={index}>
                <div className="govuk-grid-row">
                  <div className="govuk-grid-column-one-quarter">
                    <h4 className="govuk-heading-s">Rule name</h4>
                    <p>{rule.contents.find((item) => item.propName === 'name').content}</p>
                  </div>
                  <div className="govuk-grid-column-one-quarter">
                    <h4 className="govuk-heading-s">Threat</h4>
                    <p className="govuk-body govuk-tag govuk-tag--positiveTarget">
                      {rule.contents.find((item) => item.propName === 'rulePriority').content}
                    </p>
                  </div>

                  <div className="govuk-grid-column-one-quarter">
                    <h4 className="govuk-heading-s">Rule verison</h4>
                    <p>{rule.contents.find((item) => item.propName === 'ruleVersion').content}</p>
                  </div>
                  <div className="govuk-grid-column-one-quarter">
                    <h4 className="govuk-heading-s">Abuse Type</h4>
                    <p>{rule.contents.find((item) => item.propName === 'abuseType').content}</p>
                  </div>
                </div>

                <details className="govuk-details" data-module="govuk-details">
                  <summary className="govuk-details__summary">
                    <span className="govuk-details__summary-text">View further details</span>
                  </summary>
                  <div className="govuk-details__text" style={{ overflow: 'hidden' }}>
                    <div className="govuk-grid-column-three-quarters">
                      <h4 className="govuk-heading-s">Description</h4>
                      <p>{rule.contents.find((item) => item.propName === 'description').content}</p>
                    </div>
                    <div className="govuk-grid-column-one-quarter">
                      <h4 className="govuk-heading-s">Agency</h4>
                      <p>{rule.contents.find((item) => item.propName === 'agencyCode').content}</p>
                    </div>
                  </div>
                </details>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
};

export { renderTargetingIndicatorsSection,
  renderVehicleSection,
  renderTrailerSection,
  renderHaulierSection,
  renderVersionSection,
  renderOccupantsSection,
  renderRulesSection };
