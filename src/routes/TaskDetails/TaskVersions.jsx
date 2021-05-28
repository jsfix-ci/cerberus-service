import React from 'react';
import * as pluralise from 'pluralise';
import dayjs from 'dayjs';

import Accordion from '../../govuk/Accordion';
import { LONG_DATE_FORMAT } from '../../constants';

const TaskVersions = ({ taskVersions }) => {
  /* There can be multiple versions of the data
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
        taskVersions.map((version, index) => {
          const booking = version.find((fieldset) => { return fieldset.fieldSetName === 'Booking'; }) || null;
          const bookingDate = booking?.contents.find((field) => { return field.fieldName === 'Date and time'; }) || null;
          const versionNumber = taskVersions.length - index;
          let childrenSection;

          childrenSection = version.map((field) => {
            return (
              <div key={field.fieldSetName}>
                <h2 className="govuk-heading-m">{field.fieldSetName}</h2>
                <dl className="govuk-summary-list govuk-!-margin-bottom-9">
                  {field.contents.map((content, i) => {
                    return (
                      <div className="govuk-summary-list__row" key={i}>
                        <dt className="govuk-summary-list__key">{content.fieldName}</dt>
                        <dd className="govuk-summary-list__value">{content.content}</dd>
                      </div>
                    );
                  })}
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
                    <div className="govuk-caption-m">{dayjs(bookingDate?.bookingDateTime || null).format(LONG_DATE_FORMAT)}</div>
                  </div>
                  <div className="task-versions--right">
                    <ul className="govuk-list">
                      <li>{pluralise.withCount(0, '% change', '% changes', 'No changes')} in this version</li>
                    </ul>
                  </div>
                </>
              ),
              children: childrenSection,
            }
          );
        })
      }
    />
  );
};

export default TaskVersions;
