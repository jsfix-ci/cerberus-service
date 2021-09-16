import React, { Fragment } from 'react';
import dayjs from 'dayjs';
import * as pluralise from 'pluralise';
import { v4 as uuidv4 } from 'uuid';

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

const renderFieldSetContents = (contents) => (
  contents.map(({ fieldName, content, type }) => {
    if (type !== 'HIDDEN') {
      return (
        <div className="govuk-summary-list__row" key={uuidv4()}>
          <dt className="govuk-summary-list__key">{fieldName}</dt>
          <dd className="govuk-summary-list__value">{formatField(type, content)}</dd>
        </div>
      );
    }
  })
);

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

const TaskVersions = ({ taskVersions, businessKey }) => {
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
      id={`task-versions-${businessKey}`}
      items={
        /* the task data is provided in an array,
         * there is only ever one item in the array
        */
        taskVersions.reverse().map((version, index) => {
          const booking = version.find((fieldset) => { return fieldset.fieldSetName === 'Booking'; }) || null;
          const bookingDate = booking?.contents.find((field) => { return field.fieldName === 'Date and time'; }) || null;
          const versionNumber = taskVersions.length - index;
          const detailSection = version.map((field) => {
            return (
              <div key={field.fieldSetName}>
                <h2 className="govuk-heading-m">{field.fieldSetName}</h2>
                <dl className="govuk-summary-list govuk-!-margin-bottom-9">
                  {renderFieldSets(field)}
                </dl>
              </div>
            );
          });
          return (
            {
              expanded: index === 0,
              heading: `Version ${versionNumber}`,
              summary: (
                <>
                  <div className="task-versions--left">
                    <div className="govuk-caption-m">{dayjs(bookingDate?.content || null).format(LONG_DATE_FORMAT)}</div>
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
