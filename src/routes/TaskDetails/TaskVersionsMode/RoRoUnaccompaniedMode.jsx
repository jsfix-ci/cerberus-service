import React from 'react';

import { calculateTaskVersionTotalRiskScore } from '../../../utils/rickScoreCalculator';
import { renderTargetingIndicatorsSection, renderTrailerSection, renderVersionSection,
  renderOccupantsSection } from './SectionRenderer';
import { hasTaskVersionPassengers } from '../../../utils/roroDataUtil';

const renderFirstColumn = (version, movementMode) => {
  const targIndicatorsField = version.find(({ propName }) => propName === 'targetingIndicators');
  const vehicleField = version.find(({ propName }) => propName === 'vehicle');
  const goodsField = version.find(({ propName }) => propName === 'goods');
  const targetingIndicators = (targIndicatorsField !== null && targIndicatorsField !== undefined) && renderTargetingIndicatorsSection(targIndicatorsField);
  const trailer = (vehicleField !== null && vehicleField !== undefined) && renderTrailerSection(vehicleField, movementMode);
  const goods = (goodsField !== null && goodsField !== undefined) && renderVersionSection(goodsField);
  return (
    <div className="govuk-task-details-col-1">
      <div className="govuk-task-details-indicator-container  bottom-border-thick">
        <h3 className="title-heading">{targIndicatorsField.fieldSetName}</h3>
        <div className="govuk-task-details-grid-row bottom-border">
          <span className="govuk-grid-key font__bold">Indicators</span>
          <span className="govuk-grid-value font__bold">Total score</span>
        </div>
        <div className="govuk-task-details-grid-row">
          <span className="govuk-grid-key font__bold">{targIndicatorsField.childSets.length}</span>
          <span className="govuk-grid-key font__bold">{calculateTaskVersionTotalRiskScore(targIndicatorsField.childSets)}</span>
        </div>
        {targetingIndicators}
      </div>
      {trailer}
      {goods}
    </div>
  );
};

const renderSecondColumn = (version) => {
  const haulierField = version.find(({ propName }) => propName === 'haulier');
  const accountField = version.find(({ propName }) => propName === 'account');
  const bookingField = version.find(({ propName }) => propName === 'booking');
  const haulier = (haulierField !== null && haulierField !== undefined) && renderVersionSection(haulierField);
  const account = (accountField !== null && accountField !== undefined) && renderVersionSection(accountField);
  const booking = (bookingField !== null && bookingField !== undefined) && renderVersionSection(bookingField);
  return (
    <div className="govuk-task-details-col-2">
      {haulier}
      {account}
      {booking}
    </div>
  );
};

const renderThirdColumn = (version) => {
  const passengersField = version.find(({ propName }) => propName === 'passengers');
  const isValidToRender = hasTaskVersionPassengers(passengersField);
  const occupants = isValidToRender && passengersField.childSets.length > 0 && renderOccupantsSection(passengersField);
  const driverField = version.find(({ propName }) => propName === 'driver');
  const driver = (driverField !== null && driverField !== undefined) && renderVersionSection(driverField);
  return (
    <div className="govuk-task-details-col-3">
      <div className="task-details-container bottom-border-thick">
        <h3 className="title-heading">Occupants</h3>
        <div className="govuk-task-details-grid-row">
          <span className="govuk-grid-key font__light">Total occupants</span>
        </div>
        <div className="govuk-task-details-grid-row">
          <span className="govuk-grid-key font__bold">{isValidToRender ? passengersField.childSets.length : 0}</span>
        </div>
        {occupants}
      </div>
      {driver}
    </div>
  );
};

const RoRoUnaccompaniedTaskVersion = ({ version, movementMode }) => {
  return (
    <div className="govuk-task-details-grid">
      <div className="govuk-grid-column-one-third">
        {renderFirstColumn(version, movementMode)}
      </div>
      <div className="govuk-grid-column-one-third vertical-dotted-line-one">
        {renderSecondColumn(version)}
      </div>
      <div className="govuk-grid-column-one-third vertical-dotted-line-two">
        {renderThirdColumn(version)}
      </div>
    </div>
  );
};

export default RoRoUnaccompaniedTaskVersion;
