import React, { Fragment } from 'react';
import dayjs from 'dayjs';
import * as pluralise from 'pluralise';
import { v4 as uuidv4 } from 'uuid';
import Accordion from '../../govuk/Accordion';
import { RORO_TOURIST, RORO_UNACCOMPANIED_FREIGHT, LONG_DATE_FORMAT, RORO_ACCOMPANIED_FREIGHT } from '../../constants';
import TaskSummary from './TaskSummary';
import { formatKey, formatField } from '../../utils/formatField';
import { calculateTaskVersionTotalRiskScore } from '../../utils/rickScoreCalculator';

const isLatest = (index) => {
  return index === 0 ? '(latest)' : '';
};

const hasPassenger = (passengers) => {
  let isPassenger = false;
  for (const passengerChildSets of passengers.childSets) {
    for (const passengerDataFieldObj of passengerChildSets.contents) {
      if (passengerDataFieldObj.content !== null) {
        isPassenger = true;
        break;
      }
    }
  }
  return isPassenger;
};

const stripOutSectionsByMovementMode = (version, movementMode) => {
  switch (true) {
    case movementMode.toUpperCase() === RORO_TOURIST.toUpperCase():
      return version.filter(({ propName }) => propName !== 'haulier' && propName !== 'account' && propName !== 'goods');
    default:
      return version;
  }
};

const renderVersionSection = ({ fieldSetName, contents }) => {
  if (contents.length > 0 && contents !== null && contents !== undefined) {
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
      <div className="task-details-container bottom-border-thick">
        <h3 className="title-heading">{fieldSetName}</h3>
        <div className="govuk-task-details-grid-column">
          {jsxElement}
        </div>
      </div>
    );
  }
};

const renderVersionSectionBody = (fieldSet) => {
  if (fieldSet.length > 0 && fieldSet !== null && fieldSet !== undefined) {
    const jsxElement = fieldSet.map((content) => {
      if (!content.type.includes('HIDDEN')) {
        return (
          <div key={uuidv4()}>
            <ul>
              <li className="govuk-grid-key font__light">{formatKey(content.type, content.fieldName)}</li>
              <li className="govuk-grid-value font__bold">{formatField(content.type, content.content)}</li>
            </ul>
          </div>
        );
      }
    });
    return jsxElement;
  }
};

const renderRulesSection = (version) => {
  const field = version.find(({ propName }) => propName === 'rules');
  if (field.childSets.length > 0) {
    const firstRule = field.childSets[0];
    const otherRules = field.childSets.slice(1);
    return (
      <div className="govuk-rules-section">
        <div>
          <h2 className="govuk-heading-m rules-header">{field.fieldSetName}</h2>
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

        { otherRules.length > 0 && (
          <div>
            <h2 className="govuk-heading-m other-rules-header">Other rule matches ({otherRules.length})</h2>
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

const renderTargetingIndicatorsSection = ({ type, hasChildSet, childSets }) => {
  if (hasChildSet) {
    const targetingIndicators = childSets.map((childSet, index) => {
      const indicator = childSet.contents.filter(({ propName }) => propName === 'userfacingtext')[0].content;
      const score = childSet.contents.filter(({ propName }) => propName === 'score')[0].content;
      if (!type.includes('HIDDEN')) {
        const className = index !== childSets.length - 1 ? 'govuk-task-details-grid-row bottom-border' : 'govuk-task-details-grid-row';
        return (
          <div className={className} key={uuidv4()}>
            <ul className="list-bullet-container">
              {type.includes('CHANGED') ? <li className="govuk-grid-key list-bullet font__light task-versions--highlight">{indicator}</li> : <li className="govuk-grid-key list-bullet font__light">{indicator}</li>}
            </ul>
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
            <div className="task-details-container">
              {targetingIndicators}
            </div>
          </div>
        </>
      );
    }
  }
};

const renderVehicleSection = ({ contents }, movementMode) => {
  if (movementMode !== RORO_UNACCOMPANIED_FREIGHT.toUpperCase()) {
    if (contents.length > 0) {
      const vehicleArray = contents.filter(({ propName }) => {
        return propName === 'registrationNumber' || propName === 'make' || propName === 'model'
        || propName === 'type' || propName === 'registrationNationality' || propName === 'colour';
      });
      const vehicleSection = renderVersionSectionBody(vehicleArray);
      return (
        <div className="task-details-container bottom-border-thick">
          <h3 className="title-heading">Vehicle</h3>
          <div className="govuk-task-details-grid-column">
            {vehicleSection}
          </div>
        </div>
      );
    }
  }
};

const renderTrailerSection = ({ contents }, movementMode) => {
  if (movementMode === RORO_UNACCOMPANIED_FREIGHT.toUpperCase() || movementMode === RORO_ACCOMPANIED_FREIGHT.toUpperCase()) {
    const trailerDataArray = contents.filter(({ propName }) => {
      return propName === 'trailerRegistrationNumber' || propName === 'trailerType' || propName === 'trailerRegistrationNationality'
      || propName === 'trailerLength' || propName === 'trailerHeight' || propName === 'trailerEmptyOrLoaded';
    });
    // Check that trailer registration exists
    if (trailerDataArray[0].content !== null) {
      const trailerSection = renderVersionSectionBody(trailerDataArray);
      return (
        <div className="task-details-container bottom-border-thick">
          <h3 className="title-heading">Trailer</h3>
          <div className="govuk-task-details-grid-column">
            {trailerSection}
          </div>
        </div>
      );
    }
  }
};

const renderOccupantsSection = ({ fieldSetName, childSets }) => {
  const firstPassenger = childSets[0].contents;
  const otherPassengers = childSets.slice(1);
  let firstPassengerJsxElement;
  let otherPassengersJsxElementBlock;

  if (firstPassenger.length > 0) {
    firstPassengerJsxElement = firstPassenger.map((passenger) => {
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

    if (otherPassengers.length > 0) {
      otherPassengersJsxElementBlock = otherPassengers.map((otherPassenger, index) => {
        const passengerJsxElement = otherPassenger.contents.map((field) => {
          if (!field.type.includes('HIDDEN')) {
            return (
              <div className="govuk-task-details-grid-item" key={uuidv4()}>
                <ul>
                  <li className="govuk-grid-key font__light">{formatKey(field.type, field.fieldName)}</li>
                  <li className="govuk-grid-value font__bold">{formatField(field.type, field.content)}</li>
                </ul>
              </div>
            );
          }
        });
        const className = index !== otherPassengers.length - 1 ? 'govuk-task-details-grid-column bottom-border' : 'govuk-task-details-grid-column';
        return (
          <div className={className} key={uuidv4()}>
            {passengerJsxElement}
          </div>
        );
      });
    }
    return (
      <>
        <div className="task-details-container">
          <h3 className="title-heading">{fieldSetName}</h3>
          <div className="govuk-task-details-grid-column">
            {firstPassengerJsxElement}
          </div>
          {otherPassengersJsxElementBlock && (
          <details className="govuk-details" data-module="govuk-details">
            <summary className="govuk-details__summary">
              <span className="govuk-details__summary-text">
                Show more
              </span>
            </summary>
            <div className="govuk-hidden-passengers">
              {otherPassengersJsxElementBlock}
            </div>
          </details>
          )}
        </div>
      </>
    );
  }
};

const renderFirstColumn = (version, movementMode) => {
  const targIndicatorsField = version.find(({ propName }) => propName === 'targetingIndicators');
  const vehicleField = version.find(({ propName }) => propName === 'vehicle');
  const goodsField = version.find(({ propName }) => propName === 'goods');
  const targetingIndicators = (targIndicatorsField !== null && targIndicatorsField !== undefined) && renderTargetingIndicatorsSection(targIndicatorsField);
  const vehicle = (vehicleField !== null && vehicleField !== undefined) && renderVehicleSection(vehicleField, movementMode);
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
      {vehicle}
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
  const isValidToRender = hasPassenger(passengersField);
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

/**
 * This will handle portions of the movement data and apply the neccessary changes
 * before they are rendered.
 */
const renderSectionsBasedOnTIS = (movementMode, taskSummaryBasedOnTIS, version) => {
  return (
    <>
      <div>
        <TaskSummary movementMode={movementMode} taskSummaryData={taskSummaryBasedOnTIS} />
      </div>
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
      <div>
        {renderRulesSection(version)}
      </div>
    </>
  );
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
          const regexToReplace = /\s/g;
          const formattedMovementMode = movementMode.replace(regexToReplace, '_').toUpperCase();
          const filteredVersion = stripOutSectionsByMovementMode(version, formattedMovementMode);
          const detailSectionTest = renderSectionsBasedOnTIS(formattedMovementMode, taskSummaryBasedOnTIS, filteredVersion);
          return {
            expanded: index === 0,
            heading: `Version ${versionNumber} ${isLatest(index, taskVersions)}`,
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
