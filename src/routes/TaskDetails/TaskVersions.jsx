import React from 'react';
import * as pluralise from 'pluralise';
import dayjs from 'dayjs';

import Accordion from '../../govuk/Accordion';
import { LONG_DATE_FORMAT, SHORT_DATE_FORMAT } from '../../constants';

const formatField = (fieldType, content) => {
  if (!content) {
    return '';
  }
  switch (fieldType) {
    case 'DISTANCE':
      return `${content}m`;
    case 'WEIGHT':
      return `${content}kg`;
    case 'CURRENCY':
      return `£${content}`;
    case 'SHORT_DATE':
      return dayjs(0).add(content, 'days').format(SHORT_DATE_FORMAT);
    case 'DATETIME':
      return dayjs(content).format(LONG_DATE_FORMAT);
    default:
      return content;
  }
};

const fieldContent = (fieldSet) => {
  /*
  * When there are multiple entries for a section
  * e.g. 'Passengers' can have multiple passengers
  * the 'hasChildSet' flag will be set to true
  * which indicates we need to map out the childSet contents
  * and not the parent contents
  */
  if (fieldSet.hasChildSet === false) {
    return (
      fieldSet.contents.map(({ fieldName, content, type }, i) => {
        if (type !== 'HIDDEN') {
          return (
            <div className="govuk-summary-list__row" key={i}>
              { type !== 'HIDDEN'
            && (
            <>
              <dt className="govuk-summary-list__key">{fieldName}</dt>
              <dd className="govuk-summary-list__value">{formatField(type, content)}</dd>
            </>
            )}
            </div>
          );
        }
      })
    );
  } if (fieldSet.hasChildSet === true) {
    return (
      fieldSet.childSets.map((obj) => {
        return (fieldContent(obj));
      })
    );
  }
};

const TaskVersions = ({ taskVersions }) => {
  /*
  * There can be multiple versions of the data
  * We need to display each version
  * We currently get the data as an array of unnamed objects
  * That contain an array of unnamed objects
  * There is a plan to name the objects in the future
  * But for now we have to find the relevant object by looking at the fieldSetName
  */
  return (
    <Accordion
      className="task-versions"
      id="task-versions"
      items={
        taskVersions.reverse().map((version, index) => {
          const booking = version.find((fieldset) => { return fieldset.fieldSetName === 'Booking'; }) || null;
          const bookingDate = booking?.contents.find((field) => { return field.fieldName === 'Date and time'; }) || null;
          const versionNumber = taskVersions.length - index;
          const detailSection = version.map((field) => {
            return (
              <div key={field.fieldSetName}>
                <h2 className="govuk-heading-m">{field.fieldSetName}</h2>
                <dl className="govuk-summary-list govuk-!-margin-bottom-9">
                  {fieldContent(field)}
                </dl>
              </div>
            );
          });

          return (
            {
              heading: `Version ${versionNumber}`,
              summary: (
                <>
                  <div className="task-versions--left">
                    <div className="govuk-caption-m">{dayjs(bookingDate?.bookingDateTime).format(LONG_DATE_FORMAT) || null}</div>
                  </div>
                  <div className="task-versions--right">
                    <ul className="govuk-list">
                      <li>{pluralise.withCount(0, '% change', '% changes', 'No changes')} in this version</li>
                    </ul>
                  </div>
                </>
              ),
              children: detailSection,
            }
          );
        })
      }
    />
  );
};

export default TaskVersions;
