import React from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import * as pluralise from 'pluralise';

import { diff } from 'jsondiffpatch';
// Constants
import { LONG_DATE_FORMAT } from '../../../constants';
// Components/govuk
import Accordion from '../../../govuk/Accordion';
// Components
import Document from './builder/Document';
import Baggage from './builder/Baggage';
import Booking from './builder/Booking';
import Passenger from './builder/Passenger';
import Voyage from './builder/Voyage';
import Itinerary from './builder/Itinerary';
import CoTraveller from './builder/CoTraveller';
import SelectorMatches from './builder/SelectorMatches';
import RuleMatches from './builder/RuleMatches';
import TaskSummary from './TaskSummary';

const getPreviousVersion = (taskVersions, index) => {
  if (taskVersions.length === 1 || index === taskVersions.length - 1) {
    return undefined;
  }
  return taskVersions[index + 1];
};

const getVersionDiff = (versions, currentVersion, index) => {
  const previousVersion = getPreviousVersion(versions, index);
  if (!previousVersion) {
    return undefined;
  }
  // console.log("DIFF ", diff(currentVersion, previousVersion));
  return diff(currentVersion, previousVersion);
};

const renderVersionDetails = (version, versionDiff) => {
  return (
    <>
      <TaskSummary version={version} />
      <div className="govuk-task-details-grid">
        <div className="govuk-grid-column-one-third">
          <Passenger version={version} versionDiff={versionDiff} />
          <Document version={version} versionDiff={versionDiff} />
          <Baggage version={version} />
        </div>
        <div className="govuk-grid-column-one-third vertical-dotted-line__first">
          <div className="govuk-task-details__col-2">
            <Booking version={version} />
          </div>
        </div>
        <div className="govuk-grid-column-one-third vertical-dotted-line__second">
          <div className="govuk-task-details__col-3">
            <Voyage version={version} />
            <Itinerary version={version} />
          </div>
        </div>
      </div>
      <div>
        <CoTraveller version={version} />
      </div>
      <div>
        <SelectorMatches version={version} />
      </div>
      <div>
        <RuleMatches version={version} />
      </div>
    </>
  );
};

const TaskVersions = ({ taskVersions, businessKey, taskVersionDifferencesCounts }) => {
  dayjs.extend(utc);
  return (
    <Accordion
      className="task-versions"
      id={`task-versions-${businessKey}`}
      items={
        taskVersions.map((version, index) => {
          const threatLevel = version.risks.highestThreatLevel;
          const versionDiff = getVersionDiff(taskVersions, version, index);
          const sections = renderVersionDetails(version, versionDiff);
          return {
            expanded: index === 0,
            heading: `Version ${version.number}${index === 0 ? ' (latest)' : ''}`,
            summary: (
              <>
                <div className="task-versions--left">
                  <div className="govuk-caption-m">{dayjs.utc(version.createdAt).format(LONG_DATE_FORMAT)}</div>
                </div>
                <div className="task-versions--right">
                  <ul className="govuk-list">
                    { taskVersionDifferencesCounts
                      ? <li>{pluralise.withCount(taskVersionDifferencesCounts[index], '% change', '% changes', 'No changes')} in this version</li>
                      : <li>No changes in this version</li> }
                    {threatLevel?.type === 'RULE' && <li>Highest threat level is <span className="govuk-body govuk-tag govuk-tag--positiveTarget">{threatLevel.value}</span></li>}
                    {threatLevel?.type === 'SELECTOR' && <li>Highest threat level is <span className="govuk-body govuk-tag govuk-tag--positiveTarget">Category {threatLevel.value}</span></li>}
                    {!threatLevel && <li>No rule matches</li>}
                  </ul>
                </div>
              </>
            ),
            children: sections,
          };
        })
      }
    />
  );
};

export default TaskVersions;
