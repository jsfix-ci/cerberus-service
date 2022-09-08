import React from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import * as pluralise from 'pluralise';

// Constants
import { DATE_FORMATS } from '../../../../utils/constants';

// Components
import Accordion from '../../../../components/Accordion/Accordion';
import SelectorMatches from './SelectorMatches';
import RuleMatches from './RuleMatches';
import TaskSummary from './TaskSummary';
import getVersionDetails from '../../helper/versionDetails';

// Utils
import { MovementUtil } from '../../../../utils';

const renderVersionDetails = (version) => {
  const mode = MovementUtil.movementMode(version);
  return (
    <>
      <TaskSummary version={version} />
      {getVersionDetails(mode, version)}
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
          return {
            expanded: index === 0,
            heading: `Version ${version.number}${index === 0 ? ' (latest)' : ''}`,
            summary: (
              <>
                <div className="task-versions--left">
                  <div className="govuk-caption-m">{dayjs.utc(version.createdAt).format(DATE_FORMATS.LONG)}</div>
                </div>
                <div className="task-versions--right">
                  <ul className="govuk-list">
                    { taskVersionDifferencesCounts
                      ? <li>{pluralise.withCount(taskVersionDifferencesCounts[index], '% change', '% changes', 'No changes')} in this version</li>
                      : <li>No changes in this version</li> }
                    {threatLevel?.type === 'RULE'
                      && <li>Highest threat level is <span className="govuk-body govuk-tag govuk-tag--positiveTarget">{threatLevel.value}</span></li>}
                    {threatLevel?.type === 'SELECTOR'
                      && <li>Highest threat level is <span className="govuk-body govuk-tag govuk-tag--positiveTarget">Category {threatLevel.value}</span></li>}
                    {!threatLevel && <li>No rule matches</li>}
                  </ul>
                </div>
              </>
            ),
            children: renderVersionDetails(version),
          };
        })
      }
    />
  );
};

export default TaskVersions;
