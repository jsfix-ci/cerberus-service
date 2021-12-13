import React, { Fragment } from 'react';
import dayjs from 'dayjs';
import * as pluralise from 'pluralise';
import { v4 as uuidv4 } from 'uuid';
import Accordion from '../../govuk/Accordion';
import { LONG_DATE_FORMAT } from '../../constants';
import formatField from '../../utils/formatField';
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

const renderTargetingIndicators = ({ type, hasChildSet, childSets }) => {
  if (hasChildSet) {
    const targetingIndicators = childSets.map((childSet) => {
      const indicator = childSet.contents.filter(({ propName }) => propName === 'userfacingtext')[0].content;
      const score = childSet.contents.filter(({ propName }) => propName === 'score')[0].content;
      return (
        <div className="govuk-summary-list__row" key={uuidv4()}>
          <dl className="govuk-summary-list govuk-!-margin-bottom-2">
            <dt className="govuk-summary-list__key font__light">{type.includes('CHANGED') ? <span className="task-versions--highlight">{indicator}</span> : indicator}</dt>
            <dd className="govuk-summary-list__value font__bold">{formatField(type, score)}</dd>
          </dl>
        </div>
      );
    });
    if (targetingIndicators.length > 0) {
      return (
        <>
          <dl className="govuk-summary-list govuk-!-margin-bottom-9">
            <div className="govuk-summary-list__row" key={uuidv4()}>
              <dl className="govuk-summary-list govuk-!-margin-bottom-2">
                <dt className="govuk-summary-list__key font__light">Indicator</dt>
                <dd className="govuk-summary-list__value font__light">Score</dd>
              </dl>
            </div>
            {targetingIndicators}
          </dl>
        </>
      );
    }
    return (
      <dl className="govuk-summary-list govuk-!-margin-bottom-4" />
    );
  }
};

/**
 * This will handle portions of the movement data and apply the neccessary changes
 * before they are rendered.
 */
const renderVersionSection = (field) => {
  switch (true) {
    case field.propName.includes('passengers'): {
      let isValidToRender = false;
      if (field.childSets.length > 0) {
        for (const passengerChildSets of field.childSets) {
          for (const passengerDataFieldObj of passengerChildSets.contents) {
            if (passengerDataFieldObj.content !== null) {
              isValidToRender = true;
              break;
            }
          }
        }
        if (isValidToRender) {
          return (
            <div key={field.propName}>
              <h2 className="govuk-heading-m">{field.fieldSetName}</h2>
              <dl className="govuk-summary-list govuk-!-margin-bottom-9">
                {renderFieldSets(field)}
              </dl>
            </div>
          );
        }
      }
      break;
    }
    case field.propName.includes('targetingIndicators'): {
      const targetingIndicators = renderTargetingIndicators(field);
      return (
        <div key={field.propName}>
          <h2 className="govuk-heading-m">{field.fieldSetName}</h2>
          <dl className="govuk-summary-list govuk-!-margin-bottom-0 govuk-summary-list__row--no-border">
            <dd className="govuk-summary-list__key font__light">Indicators</dd>
            <dd className="govuk-summary-list__value font__light">Total score</dd>
          </dl>
          <dl className="govuk-summary-list govuk-summary-list__row--no-border">
            <dt className="govuk-summary-list__key">{field.childSets.length}</dt>
            <dd className="govuk-summary-list__value font__bold">{calculateTaskVersionTotalRiskScore(field.childSets)}</dd>
          </dl>
          {targetingIndicators}
        </div>
      );
    }
    case field.propName === 'rules': {
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
      break;
    }
    default:
      return (
        <div key={field.propName}>
          <h2 className="govuk-heading-m">{field.fieldSetName}</h2>
          <dl className="govuk-summary-list govuk-!-margin-bottom-9">
            {renderFieldSets(field)}
          </dl>
        </div>
      );
  }
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
          const detailSection = filteredVersion.map((field) => {
            return renderVersionSection(field);
          });
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
            children: detailSection,
          };
        })
      }
    />
  );
};

export default TaskVersions;
