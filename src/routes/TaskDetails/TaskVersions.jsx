import React, { Fragment } from 'react';
import dayjs from 'dayjs';
import * as pluralise from 'pluralise';
import { v4 as uuidv4 } from 'uuid';
import Accordion from '../../govuk/Accordion';
import { LONG_DATE_FORMAT } from '../../constants';
import { formatField } from '../../utils/formatField';
import * as versionLayoutBuilder from '../../utils/versionLayoutBuilder';
import { calculateTaskVersionTotalRiskScore } from '../../utils/rickScoreCalculator';

const renderFieldSetContents = (contents) => contents.map(({ fieldName, content, type }) => {
  if (!type.includes('HIDDEN')) {
    return (
      <div className="govuk-summary-list__row" key={uuidv4()}>
        <dt className="govuk-summary-list__key">{type.includes('CHANGED') ? <span className="task-versions--highlight">{fieldName}</span> : fieldName}</dt>
        <dd className="govuk-summary-list__value">{formatField(type, content)}</dd>
      </div>
    );
  }
});

const renderChildSets = (childSets) => {
  return childSets.map((child) => {
    if (child.hasChildSet) {
      return (
        <div key={uuidv4()} className="govuk-!-margin-bottom-6">
          {renderFieldSetContents(child.contents)}
          {renderChildSets(child.childSets)}
        </div>
      );
    }
    return (
      <Fragment key={uuidv4()}>
        {renderFieldSetContents(child.contents)}
      </Fragment>
    );
  });
};

const renderFieldSets = (fieldSet) => {
  /*
   * When there are multiple entries for a section
   * e.g. 'Passengers' can have multiple passengers
   * the 'hasChildSet' flag will be set to true
   * which indicates we need to map out the childSet contents
   * and not the parent contents
   */
  if (fieldSet.hasChildSet) {
    return (
      <Fragment key={uuidv4()}>
        {renderFieldSetContents(fieldSet.contents)}
        {renderChildSets(fieldSet.childSets)}
      </Fragment>
    );
  }
  return renderFieldSetContents(fieldSet.contents);
};

const renderFirstColumn = (version) => {
  const targIndicatorsField = version.filter(({ propName }) => propName === 'targetingIndicators');
  const vehicleField = version.filter(({ propName }) => propName === 'vehicle');
  const goodsField = version.filter(({ propName }) => propName === 'goods');
  const targetingIndicators = versionLayoutBuilder.renderTargetingIndicatorsSection(targIndicatorsField[0]);
  const vehicle = versionLayoutBuilder.renderVehicleSection(vehicleField[0]);
  const trailer = versionLayoutBuilder.renderTrailerSection(vehicleField[0]);
  const goods = versionLayoutBuilder.renderVersionSection(goodsField[0]);
  return (
    <>
      <div>
        <div className="targeting-indicator-container">
          <h3 className="title-heading">{targIndicatorsField[0].fieldSetName}</h3>
          <div className="govuk-indicator-grid-row bottom-border">
            <span className="govuk-grid-key font__bold">Indicators</span>
            <span className="govuk-grid-value font__bold">Total score</span>
          </div>
          <div className="govuk-indicator-grid-row bottom-border">
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
  const haulier = versionLayoutBuilder.renderVersionSection(haulierField[0]);
  const account = versionLayoutBuilder.renderVersionSection(accountField[0]);
  const booking = versionLayoutBuilder.renderVersionSection(bookingField[0]);
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
  return (
    <>
      <div>
        {}
      </div>
    </>
  );
};

/**
 * This will handle portions of the movement data and apply the neccessary changes
 * before they are rendered.
 */
const renderVersionSection = (version) => {
  return (
    <div className="govuk-main-indicator-grid">
      <div className="grid-item">
        {renderFirstColumn(version)}
      </div>
      <div className="grid-item verticel-dotted-line">
        {renderSecondColumn(version)}
      </div>
      <div className="grid-item verticel-dotted-line">
        {renderThirdColumn(version)}
      </div>
    </div>
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

const TaskVersions = ({ taskVersions, businessKey, taskVersionDifferencesCounts, movementMode }) => {
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
          const detailSectionTest = renderVersionSection(filteredVersion);
          return {
            expanded: index === 0,
            heading: `Version ${versionNumber}`,
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
