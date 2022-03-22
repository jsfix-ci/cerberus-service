import React from 'react';

import { calculateTaskVersionTotalRiskScore } from '../../../utils/rickScoreCalculator';
import {
  renderTargetingIndicatorsSection,
  renderTrailerSection,
  renderHaulierSection,
  renderAccountSection,
  renderGoodsSection,
  renderBookingSection,
} from './SectionRenderer';
import {
  extractTaskVersionsBookingField,
  getCountryName,
} from '../../../utils/roroDataUtil';

const renderFirstColumn = (version, movementMode) => {
  const targIndicatorsField = version.find(({ propName }) => propName === 'targetingIndicators');
  const vehicleField = version.find(({ propName }) => propName === 'vehicle');
  const goodsField = version.find(({ propName }) => propName === 'goods');
  const targetingIndicators = (targIndicatorsField !== null && targIndicatorsField !== undefined) && renderTargetingIndicatorsSection(targIndicatorsField);
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
      {trailer}
      {goods}
    </div>
  );
};

const renderSecondColumn = (version, taskSummaryData) => {
  const haulierField = version.find(({ propName }) => propName === 'haulier');
  const accountField = version.find(({ propName }) => propName === 'account');
  let bookingField = extractTaskVersionsBookingField(version, taskSummaryData);
  bookingField = getCountryName(bookingField);
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

const RoRoUnaccompaniedTaskVersion = ({ version, movementMode, taskSummaryData }) => {
  return (
    <div className="govuk-task-details-grid">
      <div className="govuk-grid-column-one-third">
        {renderFirstColumn(version, movementMode)}
      </div>
      <div className="govuk-grid-column-one-third vertical-dotted-line-one">
        {renderSecondColumn(version, taskSummaryData)}
      </div>
      <div className="govuk-grid-column-one-third vertical-dotted-line-two" />
    </div>
  );
};

export default RoRoUnaccompaniedTaskVersion;
