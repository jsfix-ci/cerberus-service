import React, { useState } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import * as pluralise from 'pluralise';
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
import Tabs from '../../../components/Tabs';
import TaskSummary from './TaskSummary';
// Config
import config from '../../../config';
import { useKeycloak } from '../../../utils/keycloak';
import useAxiosInstance from '../../../utils/axiosInstance';

const renderVersionDetails = (version, airlineCodes, businessKey) => {
  const keycloak = useKeycloak();
  const apiClient = useAxiosInstance(keycloak, config.taskApiUrl);
  const [pnrData, setPnrData] = useState();

  const getPNRData = async (taskId, versionNumber) => {
    try {
      const response = await apiClient.get(`/targeting-tasks/${taskId}/passenger-name-record-versions/${versionNumber}`);
      setPnrData(response.data);
    } catch (e) {
      setPnrData();
    }
  };

  return (
    <>
      <div>
        <TaskSummary version={version} airlineCodes={airlineCodes} />
      </div>
      <Tabs
        title="Versions"
        id="versions-data"
        onTabClick={(e) => {
          if (e.id === 'pnr-data') getPNRData(businessKey, version.number);
        }}
        items={[
          {
            id: 'overview',
            label: 'Overview',
            panel: (
              <>
                <div className="govuk-task-details-grid">
                  <div className="govuk-grid-column-one-third">
                    <Passenger version={version} />
                    <Document version={version} />
                    <Baggage version={version} />
                  </div>
                  <div className="govuk-grid-column-one-third vertical-dotted-line__first">
                    <div className="govuk-task-details__col-2">
                      <Booking version={version} />
                    </div>
                  </div>
                  <div className="govuk-grid-column-one-third vertical-dotted-line__second">
                    <div className="govuk-task-details__col-3">
                      <Voyage version={version} airlineCodes={airlineCodes} />
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
            ),
          },
          {
            id: 'pnr-data',
            label: 'PNR Data',
            panel: (
              <p className="word-break">{pnrData ? pnrData.raw : 'PNR data not available'}</p>
            ),
          },
        ]}
      />

    </>
  );
};

const TaskVersions = ({ taskVersions, businessKey, taskVersionDifferencesCounts, airlineCodes }) => {
  dayjs.extend(utc);
  return (
    <Accordion
      className="task-versions"
      id={`task-versions-${businessKey}`}
      items={
        taskVersions.map((version, index) => {
          const threatLevel = version.risks.highestThreatLevel;
          const sections = renderVersionDetails(version, airlineCodes, businessKey);
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
