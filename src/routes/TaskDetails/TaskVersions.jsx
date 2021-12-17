import React, { Fragment } from 'react';
import dayjs from 'dayjs';
import * as pluralise from 'pluralise';
import { v4 as uuidv4 } from 'uuid';
import Accordion from '../../govuk/Accordion';
import { RORO_TOURIST, RORO_UNACCOMPANIED_FREIGHT, LONG_DATE_FORMAT } from '../../constants';
import TaskSummary from './TaskSummary';
import { formatKey, formatField } from '../../utils/formatField';
import { calculateTaskVersionTotalRiskScore } from '../../utils/rickScoreCalculator';

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

        { otherRules && (
          <div className="govuk-!-margin-top-9">
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
      <div className="task-details-container bottom-border-thick">
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
            {type.includes('CHANGED') ? <span className="govuk-grid-key list-bullet font__light task-versions--highlight">{indicator}</span> : <span className="govuk-grid-key list-bullet font__light">{indicator}</span>}
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
            <div className="task-details-container bottom-border-thick">
              {targetingIndicators}
            </div>
          </div>
        </>
      );
    }
  }
};

const renderVehicleSection = ({ contents }) => {
  if (contents.length > 0) {
    const vehicleArray = contents.filter(({ propName }) => {
      return propName === 'registrationNumber' || propName === 'make' || propName === 'model'
      || propName === 'type' || propName === 'registrationNationality' || propName === 'colour';
    });
    const vehicleVrn = vehicleArray[0];
    const vehicleType = vehicleArray[1];
    const vehicleMake = vehicleArray[2];
    const vehicleModel = vehicleArray[3];
    const vehicleCountryOfReg = vehicleArray[4];
    const vehicleColour = vehicleArray[5];
    return (
      <div className="task-details-container bottom-border-thick">
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
        </div>
      </div>
    );
  }
};

const renderTrailerSection = ({ contents }, movementMode) => {
  if (movementMode !== RORO_TOURIST) {
    if (contents.length > 0) {
      const trailerArray = contents.filter(({ propName }) => {
        return propName === 'trailerRegistrationNumber' || propName === 'trailerType' || propName === 'trailerRegistrationNationality'
        || propName === 'trailerLength' || propName === 'trailerHeight' || propName === 'trailerEmptyOrLoaded';
      });
      const trailerRegistrationNumber = trailerArray[0];
      const trailerType = trailerArray[1];
      const trailerCountryOfRegistration = trailerArray[2];
      const trailerEmptyOrLoaded = trailerArray[3];
      const trailerLength = trailerArray[4];
      const trailerHeight = trailerArray[5];
      return (
        <div className="task-details-container bottom-border-thick">
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
      otherPassengersJsxElementBlock = otherPassengers.map((otherPassenger) => {
        const passengerJsxBlock = otherPassenger.contents.map((passenger) => {
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
        return (
          <div className="govuk-task-details-grid-column bottom-border" key={uuidv4()}>
            {passengerJsxBlock}
          </div>
        );
      });
      return (
        <>
          <div className="task-details-container">
            <h3 className="title-heading">{fieldSetName}</h3>
            <div className="govuk-task-details-grid-column">
              {firstPassengerJsxElement}
            </div>
          </div>
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
        </>
      );
    }
  }
};

const isOccupantValidToRender = (passengers) => {
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

const renderFirstColumn = (version, movementMode) => {
  const targIndicatorsField = version.find(({ propName }) => propName === 'targetingIndicators');
  const vehicleField = version.find(({ propName }) => propName === 'vehicle');
  const goodsField = version.find(({ propName }) => propName === 'goods');
  const targetingIndicators = (targIndicatorsField !== null && targIndicatorsField !== undefined) && renderTargetingIndicatorsSection(targIndicatorsField, true);
  const vehicle = (vehicleField !== null && vehicleField !== undefined) && renderVehicleSection(vehicleField, true);
  const trailer = (vehicleField !== null && vehicleField !== undefined) && renderTrailerSection(vehicleField, movementMode);
  const goods = (goodsField !== null && goodsField !== undefined) && renderVersionSection(goodsField, false);
  return (
    <div>
      <div className="govuk-task-details-indicator-container">
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
    <div>
      {haulier}
      {account}
      {booking}
    </div>
  );
};

const renderThirdColumn = (version) => {
  const passengersField = version.find(({ propName }) => propName === 'passengers');
  const isValidToRender = isOccupantValidToRender(passengersField);
  const occupants = isValidToRender && passengersField.childSets.length > 0 && renderOccupantsSection(passengersField);
  const driverField = version.find(({ propName }) => propName === 'driver');
  const driver = (driverField !== null && driverField !== undefined) && renderVersionSection(driverField);
  return (
    <div>
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

const determineLatest = (index) => {
  return index === 0 ? '(latest)' : '';
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

const stripOutSectionsByMovementMode = (version, movementMode) => {
  switch (true) {
    case movementMode.toUpperCase() === RORO_TOURIST.toUpperCase():
      return version.filter(({ propName }) => propName !== 'haulier' && propName !== 'account' && propName !== 'goods');
    case movementMode.toUpperCase() === RORO_UNACCOMPANIED_FREIGHT.toUpperCase():
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
          const detailSectionTest = renderSectionsBasedOnTIS(movementMode, taskSummaryBasedOnTIS, filteredVersion);
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
