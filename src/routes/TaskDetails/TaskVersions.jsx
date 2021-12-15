import React, { Fragment } from 'react';
import dayjs from 'dayjs';
import * as pluralise from 'pluralise';
import Accordion from '../../govuk/Accordion';
import { LONG_DATE_FORMAT } from '../../constants';
import TaskSummary from './TaskSummary';
import * as versionLayoutBuilder from '../../utils/versionLayoutBuilder';
import { calculateTaskVersionTotalRiskScore } from '../../utils/rickScoreCalculator';

const isPassengerValidToRender = (passengers) => {
  let isValidToRender = false;
  for (const passengerChildSets of passengers.childSets) {
    for (const passengerDataFieldObj of passengerChildSets.contents) {
      if (passengerDataFieldObj.content !== null) {
        isValidToRender = true;
        break;
      }
    }
  }
  return isValidToRender;
};

const renderFirstColumn = (version) => {
  const targIndicatorsField = version.filter(({ propName }) => propName === 'targetingIndicators');
  const vehicleField = version.filter(({ propName }) => propName === 'vehicle');
  const goodsField = version.filter(({ propName }) => propName === 'goods');
  const targetingIndicators = (targIndicatorsField !== null && targIndicatorsField !== undefined) && versionLayoutBuilder.renderTargetingIndicatorsSection(targIndicatorsField[0]);
  const vehicle = (vehicleField !== null && vehicleField !== undefined && vehicleField.length > 0) && versionLayoutBuilder.renderVehicleSection(vehicleField[0]);
  const trailer = (vehicleField !== null && vehicleField !== undefined && vehicleField.length > 0) && versionLayoutBuilder.renderTrailerSection(vehicleField[0]);
  const goods = (goodsField !== null && goodsField !== undefined && goodsField.length > 0) && versionLayoutBuilder.renderVersionSection(goodsField[0]);
  return (
    <>
      <div>
        <div className="targeting-indicator-container">
          <h3 className="title-heading">{targIndicatorsField[0].fieldSetName}</h3>
          <div className="govuk-task-details-grid-row bottom-border">
            <span className="govuk-grid-key font__bold">Indicators</span>
            <span className="govuk-grid-value font__bold">Total score</span>
          </div>
          <div className="govuk-task-details-grid-row bottom-border">
            <span className="govuk-grid-key font__bold">{targIndicatorsField[0].childSets.length}</span>
            <span className="govuk-grid-key font__bold">{calculateTaskVersionTotalRiskScore(targIndicatorsField[0].childSets)}</span>
          </div>
          {targetingIndicators}
        </div>
        {vehicle}
        {trailer}
        {goods}
      </div>
    </>
  );
};

const renderSecondColumn = (version) => {
  const haulierField = version.filter(({ propName }) => propName === 'haulier');
  const accountField = version.filter(({ propName }) => propName === 'account');
  const bookingField = version.filter(({ propName }) => propName === 'booking');
  const haulier = (haulierField !== null && haulierField !== undefined && haulierField.length > 0) && versionLayoutBuilder.renderVersionSection(haulierField[0]);
  const account = (accountField !== null && accountField !== undefined && accountField.length > 0) && versionLayoutBuilder.renderVersionSection(accountField[0]);
  const booking = (bookingField !== null && bookingField !== undefined && bookingField.length > 0) && versionLayoutBuilder.renderVersionSection(bookingField[0]);
  return (
    <>
      <div>
        {haulier}
        {account}
        {booking}
      </div>
    </>
  );
};

const renderThirdColumn = (version) => {
  const passengersField = version.find(({ propName }) => propName === 'passengers');
  const isValidToRender = isPassengerValidToRender(passengersField);
  const occupants = isValidToRender && passengersField.childSets.length > 0 && versionLayoutBuilder.renderOccupantsSection(passengersField);
  const driverField = version.find(({ propName }) => propName === 'driver');
  const driver = (driverField !== null && driverField !== undefined) && versionLayoutBuilder.renderVersionSection(driverField);
  return (
    <>
      <div>
        <div className="task-details-container">
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
    </>
  );
};

const renderRulesSection = (version) => {
  const rulesField = version.find(({ propName }) => propName === 'rules');
  return versionLayoutBuilder.renderRulesSection(rulesField);
};

const determineLatest = (index) => {
  return index === 0 ? '(latest)' : '';
};

/**
 * This will handle portions of the movement data and apply the neccessary changes
 * before they are rendered.
 */
const renderVersionSection = (taskSummaryBasedOnTIS, version) => {
  return (
    <>
      <div>
        <TaskSummary taskSummaryData={taskSummaryBasedOnTIS} />
      </div>
      <div className="govuk-task-details-grid">
        <div className="govuk-grid-column-one-third">
          {renderFirstColumn(version)}
        </div>
        <div className="govuk-grid-column-one-third vertical-dotted-line-one">
          <div className="data-container">
            {renderSecondColumn(version)}
          </div>
        </div>
        <div className="govuk-grid-column-one-third vertical-dotted-line-two">
          <div className="data-container">
            {renderThirdColumn(version)}
          </div>
        </div>
      </div>
      <div>
        {renderRulesSection(version)}
      </div>
    </>
  );
};

const stripOutSectionsByMovementMode = (version, movementMode) => {
  const roroTourist = 'RORO Tourist';
  const roroUnaccompFreight = 'RORO Unaccompanied Freight';
  switch (true) {
    case movementMode.toUpperCase() === roroTourist.toUpperCase():
      return version.filter(({ propName }) => propName !== 'haulier' && propName !== 'account' && propName !== 'goods');
    case movementMode.toUpperCase() === roroUnaccompFreight.toUpperCase():
      return version.filter(({ propName }) => propName !== 'vehicle');
    default:
      return version;
  }
};

const TaskVersions = ({ taskSummaryBasedOnTIS, taskVersions, businessKey, taskVersionDifferencesCounts, movementMode }) => {
  /*
   * There can be multiple versions of the data
   * We need to display each version
   * We currently get the data as an array of unnamed objects
   * That contain an array of unnamed objects
   * There is a plan to name the objects in the future
   * But for now we have to find the relevant object by looking at the propName
   */
  return (
    <Accordion
      className="task-versions"
      id={`task-versions-${businessKey}`}
      items={
        /* the task data is provided in an array,
         * there is only ever one item in the array
         */
        taskVersions.map((version, index) => {
          const booking = version.find((fieldset) => fieldset.propName === 'booking') || null;
          const bookingDate = booking?.contents.find((field) => field.propName === 'dateBooked').content || null;
          const versionNumber = taskVersions.length - index;
          const filteredVersion = stripOutSectionsByMovementMode(version, movementMode);
          const detailSectionTest = renderVersionSection(taskSummaryBasedOnTIS, filteredVersion);
          return {
            expanded: index === 0,
            heading: `Version ${versionNumber} ${determineLatest(index, taskVersions)}`,
            summary: (
              <>
                <div className="task-versions--left">
                  <div className="govuk-caption-m">{dayjs.utc(bookingDate ? bookingDate.split(',')[0] : null).format(LONG_DATE_FORMAT)}</div>
                </div>
                <div className="task-versions--right">
                  <ul className="govuk-list">
                    <li>{pluralise.withCount(taskVersionDifferencesCounts[index], '% change', '% changes', 'No changes')} in this version</li>
                  </ul>
                </div>
              </>
            ),
            children: detailSectionTest,
          };
        })
      }
    />
  );
};

export default TaskVersions;
