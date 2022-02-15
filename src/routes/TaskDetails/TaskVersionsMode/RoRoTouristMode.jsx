import React from 'react';
import { RORO_TOURIST_CAR_ICON, RORO_TOURIST_GROUP_ICON, RORO_TOURIST_SINGLE_ICON } from '../../../constants';

import { calculateTaskVersionTotalRiskScore } from '../../../utils/rickScoreCalculator';
import { renderTargetingIndicatorsSection, renderVehicleSection, renderVersionSection,
  renderOccupantsSection, renderPrimaryTraveller, renderPrimaryTravellerDocument,
  renderOccupantsCategoryCountSection } from './SectionRenderer';
import { hasTaskVersionPassengers, extractTaskVersionsBookingField,
  getTaskDetailsTotalOccupants } from '../../../utils/roroDataUtil';

const footPassengersTaskVersion = (version, movementModeIcon, taskSummaryData) => {
  const renderFirstColumn = () => {
    const targIndicatorsField = version.find(({ propName }) => propName === 'targetingIndicators');
    const targetingIndicators = (targIndicatorsField !== null && targIndicatorsField !== undefined) && renderTargetingIndicatorsSection(targIndicatorsField);
    const driverField = version.find(({ propName }) => propName === 'driver');
    const primaryTraveller = (driverField !== null && driverField !== undefined) && renderPrimaryTraveller(driverField);
    const primaryTravellerDocument = (driverField !== null && driverField !== undefined) && renderPrimaryTravellerDocument(driverField);
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
    const bookingField = extractTaskVersionsBookingField(version, taskSummaryData);
    const booking = (bookingField !== null && bookingField !== undefined) && renderVersionSection(bookingField);
    return (
      <div className="govuk-task-details-col-2">
        {booking}
      </div>
    );
  };

  const renderThirdColumn = () => {
    const passengersField = version.find(({ propName }) => propName === 'passengers');
    const isValidToRender = hasTaskVersionPassengers(passengersField);
    const occupants = isValidToRender && passengersField.childSets.length > 0 && renderOccupantsSection(passengersField, movementModeIcon);
    return (
      <div className="govuk-task-details-col-3">
        <div className="task-details-container bottom-border-thick">
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

const footPassengerTaskVersion = (version, movementModeIcon, taskSummaryData) => {
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
    const bookingField = extractTaskVersionsBookingField(version, taskSummaryData);
    const booking = (bookingField !== null && bookingField !== undefined) && renderVersionSection(bookingField);
    return (
      <div className="govuk-task-details-col-2">
        {booking}
      </div>
    );
  };

  const renderThirdColumn = () => {
    const driverField = version.find(({ propName }) => propName === 'driver');
    const primaryTraveller = (driverField !== null && driverField !== undefined) && renderPrimaryTraveller(driverField, movementModeIcon);
    return (
      <div className="govuk-task-details-col-2">
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
    const bookingField = extractTaskVersionsBookingField(version, taskSummaryData);
    const booking = (bookingField !== null && bookingField !== undefined) && renderVersionSection(bookingField);
    return (
      <div className="govuk-task-details-col-2">
        {booking}
      </div>
    );
  };

  const renderThirdColumn = () => {
    const passengersField = version.find(({ propName }) => propName === 'passengers');
    const isValidToRender = hasTaskVersionPassengers(passengersField);
    const passengersMetadata = version.find(({ propName }) => propName === 'occupants');
    const driverField = version.find(({ propName }) => propName === 'driver');
    const occupants = isValidToRender && passengersField.childSets.length > 0 && renderOccupantsSection(passengersField);
    const occupantsCount = renderOccupantsCategoryCountSection(driverField, passengersField, passengersMetadata, movementMode);
    const totalCount = getTaskDetailsTotalOccupants(passengersMetadata);
    const linkFields = { name: 'entitySearchUrl' };
    const driver = (driverField !== null && driverField !== undefined) && renderVersionSection(driverField, linkFields);
    return (
      <div className="govuk-task-details-col-3">
        <div className="task-details-container bottom-border-thick">
          <h3 className="title-heading">Occupants</h3>
          <div className="govuk-task-details-grid-row">
            <span className="govuk-grid-key font__light">Total occupants</span>
          </div>
          <div className="govuk-task-details-grid-row">
            <span className="govuk-grid-key font__bold">{totalCount}</span>
          </div>
          {occupantsCount
          && (
          <div className="govuk-task-details-counts-container">
            <div className="task-details-container">
              {occupantsCount}
            </div>
          </div>
          )}
          {occupants}
        </div>
        {driver}
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
  if (movementModeIcon === RORO_TOURIST_SINGLE_ICON) {
    return footPassengerTaskVersion(version, movementModeIcon, taskSummaryData);
  }
  if (movementModeIcon === RORO_TOURIST_GROUP_ICON) {
    return footPassengersTaskVersion(version, movementModeIcon, taskSummaryData);
  }
};

export default RoRoTouristTaskVersion;
