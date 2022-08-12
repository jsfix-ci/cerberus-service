import React from 'react';
import { calculateTaskVersionTotalRiskScore } from '../../../../utils/Risks/risksUtil';

import {
  renderTargetingIndicatorsSection,
  renderVehicleSection,
  renderTrailerSection,
  renderGoodsSection,
  renderBookingSection,
  renderOccupantsSection,
  renderHaulierSection,
  renderAccountSection,
  renderDriverSection,
  renderOccupantCarrierCountsSection,
} from './SectionRenderer';

import {
  hasTaskVersionPassengers,
  extractTaskVersionsBookingField,
  modifyRoRoPassengersTaskList,
  modifyCountryCodeIfPresent,
} from '../../../../utils/RoRoData/roroDataUtil';

const renderFirstColumn = (version, movementMode) => {
  const targIndicatorsField = version.find(({ propName }) => propName === 'targetingIndicators');
  const vehicleField = version.find(({ propName }) => propName === 'vehicle');
  const goodsField = version.find(({ propName }) => propName === 'goods');
  const targetingIndicators = (targIndicatorsField !== null && targIndicatorsField !== undefined) && renderTargetingIndicatorsSection(targIndicatorsField);
  const vehicle = (vehicleField !== null && vehicleField !== undefined) && renderVehicleSection(vehicleField, movementMode);
  const trailer = (vehicleField !== null && vehicleField !== undefined) && renderTrailerSection(vehicleField, movementMode);
  const goods = (goodsField !== null && goodsField !== undefined) && renderGoodsSection(goodsField);
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
      {vehicle}
      {trailer}
      {goods}
    </div>
  );
};

const renderSecondColumn = (version, taskSummaryData) => {
  const haulierField = version.find(({ propName }) => propName === 'haulier');
  const accountField = version.find(({ propName }) => propName === 'account');
  let bookingField = extractTaskVersionsBookingField(version, taskSummaryData);
  bookingField = modifyCountryCodeIfPresent(bookingField);
  const haulier = (haulierField !== null && haulierField !== undefined) && renderHaulierSection(haulierField);
  const account = (accountField !== null && accountField !== undefined) && renderAccountSection(accountField);
  const booking = (bookingField !== null && bookingField !== undefined) && renderBookingSection(bookingField);
  return (
    <div className="govuk-task-details-col-2">
      {haulier}
      {account}
      {booking}
    </div>
  );
};

const renderThirdColumn = (version, movementMode, movementModeIcon, arrivalTime) => {
  const driverField = version.find(({ propName }) => propName === 'driver');
  const passengersField = version.find(({ propName }) => propName === 'passengers');
  const passengersMetadata = version.find(({ propName }) => propName === 'occupants');
  const isValidToRender = hasTaskVersionPassengers(passengersField);
  const occupants = isValidToRender && passengersField.childSets.length > 0 && renderOccupantsSection(passengersField, movementModeIcon, arrivalTime);
  const carrierOccupantCounts = renderOccupantCarrierCountsSection(driverField, passengersField, passengersMetadata, movementMode);
  const driver = (driverField !== null && driverField !== undefined) && renderDriverSection(driverField, arrivalTime);
  return (
    <div className="govuk-task-details-col-3">
      <div className="task-details-container">
        <h3 className="title-heading">Occupants</h3>
        {carrierOccupantCounts
        && (
        <div className="govuk-task-details-counts-container">
          <div className="task-details-container">
            {carrierOccupantCounts}
          </div>
        </div>
        )}
        {driver}
      </div>
      {occupants}
    </div>
  );
};

const RoRoAccompaniedTaskVersion = ({ version, movementMode, movementModeIcon, taskSummaryData }) => {
  const roroData = modifyRoRoPassengersTaskList({ ...taskSummaryData.roro.details });
  return (
    <>
      <div className="govuk-task-details-grid">
        <div className="govuk-grid-column-one-third">
          {renderFirstColumn(version, movementMode)}
        </div>
        <div className="govuk-grid-column-one-third vertical-dotted-line-one">
          {renderSecondColumn(version, taskSummaryData)}
        </div>
        <div className="govuk-grid-column-one-third vertical-dotted-line-two">
          {renderThirdColumn(version, movementMode, movementModeIcon, roroData.eta)}
        </div>
      </div>
    </>
  );
};

export default RoRoAccompaniedTaskVersion;
