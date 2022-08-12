import React from 'react';
import { RORO_TOURIST_CAR_ICON, GROUP_ICON, INDIVIDUAL_ICON } from '../../../../utils/constants';

import { calculateTaskVersionTotalRiskScore } from '../../../../utils/Risks/risksUtil';

import {
  renderTargetingIndicatorsSection,
  renderVehicleSection,
  renderDriverSection,
  renderOccupantsSection,
  renderPrimaryTraveller,
  renderPrimaryTravellerDocument,
  renderBookingSection,
  renderOccupantCarrierCountsSection,
} from './SectionRenderer';

import {
  hasTaskVersionPassengers,
  extractTaskVersionsBookingField,
  modifyRoRoPassengersTaskList,
  modifyCountryCodeIfPresent,
} from '../../../../utils/RoRoData/roroDataUtil';

const footPassengersTaskVersion = (version, movementMode, movementModeIcon, taskSummaryData) => {
  const renderFirstColumn = () => {
    const targIndicatorsField = version.find(({ propName }) => propName === 'targetingIndicators');
    const targetingIndicators = (targIndicatorsField !== null && targIndicatorsField !== undefined) && renderTargetingIndicatorsSection(targIndicatorsField);
    const passengersField = version.find(({ propName }) => propName === 'passengers');
    const primaryTraveller = (passengersField !== null && passengersField !== undefined) && renderPrimaryTraveller(passengersField);
    const primaryTravellerDocument = (passengersField !== null && passengersField !== undefined) && renderPrimaryTravellerDocument(passengersField);
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
        {primaryTraveller}
        {primaryTravellerDocument}
      </div>
    );
  };

  const renderSecondColumn = () => {
    let bookingField = extractTaskVersionsBookingField(version, taskSummaryData);
    bookingField = modifyCountryCodeIfPresent(bookingField);
    const booking = (bookingField !== null && bookingField !== undefined) && renderBookingSection(bookingField);
    return (
      <div className="govuk-task-details-col-2">
        {booking}
      </div>
    );
  };

  const renderThirdColumn = () => {
    const roroData = modifyRoRoPassengersTaskList({ ...taskSummaryData.roro.details });
    const driverField = version.find(({ propName }) => propName === 'driver');
    const passengersField = version.find(({ propName }) => propName === 'passengers');
    const passengersMetadata = version.find(({ propName }) => propName === 'occupants');
    const isValidToRender = hasTaskVersionPassengers(passengersField);
    const occupants = isValidToRender && passengersField.childSets.length > 0 && renderOccupantsSection(passengersField, movementModeIcon, roroData.eta);
    const carrierOccupantCounts = renderOccupantCarrierCountsSection(driverField, passengersField, passengersMetadata, movementMode, movementModeIcon);
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
        </div>
        <div className="task-details-container">
          <h3 className="title-heading">Other travellers</h3>
          {occupants}
        </div>
      </div>
    );
  };

  return (
    <div className="govuk-task-details-grid">
      <div className="govuk-grid-column-one-third">
        {renderFirstColumn()}
      </div>
      <div className="govuk-grid-column-one-third vertical-dotted-line-one">
        {renderSecondColumn()}
      </div>
      <div className="govuk-grid-column-one-third vertical-dotted-line-two">
        {renderThirdColumn()}
      </div>
    </div>
  );
};

const footPassengerTaskVersion = (version, movementMode, movementModeIcon, taskSummaryData) => {
  const renderFirstColumn = () => {
    const targIndicatorsField = version.find(({ propName }) => propName === 'targetingIndicators');
    const targetingIndicators = (targIndicatorsField !== null && targIndicatorsField !== undefined) && renderTargetingIndicatorsSection(targIndicatorsField);
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
      </div>
    );
  };

  const renderSecondColumn = () => {
    let bookingField = extractTaskVersionsBookingField(version, taskSummaryData);
    bookingField = modifyCountryCodeIfPresent(bookingField);
    const booking = (bookingField !== null && bookingField !== undefined) && renderBookingSection(bookingField);
    return (
      <div className="govuk-task-details-col-2">
        {booking}
      </div>
    );
  };

  const renderThirdColumn = () => {
    const driverField = version.find(({ propName }) => propName === 'driver');
    const passengersField = version.find(({ propName }) => propName === 'passengers');
    const passengersMetadata = version.find(({ propName }) => propName === 'occupants');
    const primaryTraveller = (passengersField !== null && passengersField !== undefined) && renderPrimaryTraveller(passengersField, movementModeIcon);
    const carrierOccupantCounts = renderOccupantCarrierCountsSection(driverField, passengersField, passengersMetadata, movementMode, movementModeIcon);
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
        </div>
        {primaryTraveller}
      </div>
    );
  };

  return (
    <div className="govuk-task-details-grid">
      <div className="govuk-grid-column-one-third">
        {renderFirstColumn()}
      </div>
      <div className="govuk-grid-column-one-third vertical-dotted-line-one">
        {renderSecondColumn()}
      </div>
      <div className="govuk-grid-column-one-third vertical-dotted-line-two">
        {renderThirdColumn()}
      </div>
    </div>
  );
};

const touristCarTaskVersion = (version, movementMode, taskSummaryData) => {
  const renderFirstColumn = () => {
    const targIndicatorsField = version.find(({ propName }) => propName === 'targetingIndicators');
    const vehicleField = version.find(({ propName }) => propName === 'vehicle');
    const targetingIndicators = (targIndicatorsField !== null && targIndicatorsField !== undefined) && renderTargetingIndicatorsSection(targIndicatorsField);
    const vehicle = (vehicleField !== null && vehicleField !== undefined) && renderVehicleSection(vehicleField, movementMode);
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
      </div>
    );
  };

  const renderSecondColumn = () => {
    let bookingField = extractTaskVersionsBookingField(version, taskSummaryData);
    bookingField = modifyCountryCodeIfPresent(bookingField);
    const booking = (bookingField !== null && bookingField !== undefined) && renderBookingSection(bookingField);
    return (
      <div className="govuk-task-details-col-2">
        {booking}
      </div>
    );
  };

  const renderThirdColumn = () => {
    const roroData = modifyRoRoPassengersTaskList({ ...taskSummaryData.roro.details });
    const passengersField = version.find(({ propName }) => propName === 'passengers');
    const isValidToRender = hasTaskVersionPassengers(passengersField);
    const passengersMetadata = version.find(({ propName }) => propName === 'occupants');
    const driverField = version.find(({ propName }) => propName === 'driver');
    const occupants = isValidToRender && passengersField.childSets.length > 0 && renderOccupantsSection(passengersField, 'undefined', roroData.eta);
    const carrierOccupantCounts = renderOccupantCarrierCountsSection(driverField, passengersField, passengersMetadata, movementMode);
    const driver = (driverField !== null && driverField !== undefined) && renderDriverSection(driverField, roroData.eta);
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

  return (
    <div className="govuk-task-details-grid">
      <div className="govuk-grid-column-one-third">
        {renderFirstColumn()}
      </div>
      <div className="govuk-grid-column-one-third vertical-dotted-line-one">
        {renderSecondColumn()}
      </div>
      <div className="govuk-grid-column-one-third vertical-dotted-line-two">
        {renderThirdColumn()}
      </div>
    </div>
  );
};

const RoRoTouristTaskVersion = ({ version, movementMode, movementModeIcon, taskSummaryData }) => {
  if (movementModeIcon === RORO_TOURIST_CAR_ICON) {
    return touristCarTaskVersion(version, movementMode, taskSummaryData);
  }
  if (movementModeIcon === INDIVIDUAL_ICON) {
    return footPassengerTaskVersion(version, movementMode, movementModeIcon, taskSummaryData);
  }
  if (movementModeIcon === GROUP_ICON) {
    return footPassengersTaskVersion(version, movementMode, movementModeIcon, taskSummaryData);
  }
};

export default RoRoTouristTaskVersion;
