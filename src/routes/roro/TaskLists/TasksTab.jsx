// Third party imports
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useInterval } from 'react-use';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import * as pluralise from 'pluralise';
import qs from 'qs';

// Config
import {
  TASK_OUTCOME_INSUFFICIENT_RESOURCES,
  TASK_OUTCOME_MISSED,
  TASK_OUTCOME_NEGATIVE,
  TASK_OUTCOME_NO_SHOW,
  TASK_OUTCOME_POSITIVE,
  TASK_OUTCOME_TARGET_WITHDRAWN,
  TASK_STATUS_COMPLETED,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_NEW,
} from '../../../constants';
import config from '../../../config';

// Utils
import useAxiosInstance from '../../../utils/axiosInstance';
import { useKeycloak } from '../../../utils/keycloak';
import { useIsMounted } from '../../../utils/hooks';
import { calculateTaskListTotalRiskScore } from '../../../utils/rickScoreCalculator';
import getMovementModeIcon from '../../../utils/getVehicleModeIcon';
import { modifyRoRoPassengersTaskList, toRoRoSelectorsValue } from '../../../utils/roroDataUtil';

// Components/Pages
import ClaimButton from '../../../components/ClaimTaskButton';
import Pagination from '../../../components/Pagination';
import TaskListMode from './TaskListMode';
import LoadingSpinner from '../../../components/LoadingSpinner';

const TasksTab = ({
  taskStatus,
  filtersToApply,
  setError,
  targetTaskCount = 0,
}) => {
  dayjs.extend(relativeTime);
  dayjs.extend(utc);
  const keycloak = useKeycloak();
  const location = useLocation();
  const isMounted = useIsMounted();
  const camundaClientV1 = useAxiosInstance(keycloak, config.camundaApiUrlV1);
  const source = axios.CancelToken.source();

  const [activePage, setActivePage] = useState(0);
  const [targetTasks, setTargetTasks] = useState([]);

  const [isLoading, setLoading] = useState(true);
  const [refreshTaskList, setRefreshTaskList] = useState(false);

  // PAGINATION SETTINGS
  const index = activePage - 1;
  const itemsPerPage = 100;
  const offset = index * itemsPerPage < 0 ? 0 : index * itemsPerPage;
  const totalPages = Math.ceil(targetTaskCount / itemsPerPage);

  // STATUS SETTINGS
  const currentUser = keycloak.tokenParsed.email;
  const activeTab = taskStatus;

  const getTaskList = async () => {
    setLoading(true);
    if (camundaClientV1) {
      const tab = taskStatus === 'inProgress' ? 'IN_PROGRESS' : taskStatus.toUpperCase();
      const sortParams = taskStatus === 'new' || taskStatus === 'inProgress'
        ? [
          {
            field: 'arrival-date',
            order: 'asc',
          },
          {
            field: 'highest-threat-level',
            order: 'desc',
          },
        ]
        : null;
      // Modify the post post param to be different from what is stored in stage.
      filtersToApply = {
        ...filtersToApply,
        hasSelectors: toRoRoSelectorsValue(filtersToApply?.hasSelectors),
        movementModes: filtersToApply?.movementModes || [filtersToApply.mode],
      };
      try {
        const tasks = await camundaClientV1.post('/targeting-tasks/pages', {
          status: tab,
          filterParams: filtersToApply,
          sortParams,
          pageParams: {
            limit: itemsPerPage,
            offset,
          },
        });
        if (!isMounted.current) return null;
        setTargetTasks(tasks.data);
      } catch (e) {
        if (!isMounted.current) return null;
        setError(e.message);
        setTargetTasks([]);
      } finally {
        if (isMounted.current) {
          setLoading(false);
          setRefreshTaskList(false);
        }
      }
    }
  };

  const extractDescription = (risk) => {
    const contents = risk.contents;
    if (!contents) {
      return risk.name;
    }
    return contents.groupReference
      ? contents.groupReference
      : contents.localReference || contents.name;
  };

  const extractThreatLevel = (risk) => {
    const contents = risk.contents;
    if (!contents) {
      return risk.rulePriority;
    }
    return contents.category ? (
      <>
        <span className="govuk-body govuk-!-font-weight-bold">SELECTOR {' '}</span>
        <span className="govuk-tag govuk-tag--riskTier">{contents.category}</span>
      </>
    ) : (
      <span className="govuk-tag govuk-tag--riskTier">
        {contents.rulePriority}
      </span>
    );
  };

  const extractRiskType = (risk) => {
    const contents = risk.contents;
    if (!contents) {
      return risk.abuseType;
    }
    return contents.threatType ? contents.threatType : contents.abuseType;
  };

  const formatTargetRisk = (target, highestRisk) => {
    const risksRules = target.risks.rules?.length + target.risks.selectors?.length;
    if (highestRisk) {
      const topRisk = extractRiskType(highestRisk);
      const count = risksRules > 0 && risksRules - 1;
      return `${topRisk} and ${pluralise.withCount(
        count,
        '% other rule',
        '% other rules',
      )}`;
    }
    return null;
  };

  const formatTargetIndicators = (target) => {
    if (target.threatIndicators?.length > 0) {
      const threatIndicatorList = target.threatIndicators.map(
        (threatIndicator) => {
          return threatIndicator.userfacingtext;
        },
      );
      return (
        <ul className="govuk-list item-list--bulleted">
          <li>
            {`${pluralise.withCount(
              threatIndicatorList.length,
              '% indicator',
              '% indicators',
            )}`}
          </li>
          {threatIndicatorList.map((threat) => {
            return <li key={threat}>{threat}</li>;
          })}
        </ul>
      );
    }
  };

  const hasUpdatedStatus = (target) => {
    if (target.numberOfVersions > 1) {
      return (
        <p className="govuk-body govuk-tag govuk-tag--updatedTarget">Updated</p>
      );
    }
  };

  const getOutcome = (outcome) => {
    let outcomeText;
    let outcomeClass = 'genericOutcome';
    switch (outcome) {
      case TASK_OUTCOME_POSITIVE:
        outcomeText = 'Positive Exam';
        outcomeClass = 'positiveOutcome';
        break;
      case TASK_OUTCOME_NEGATIVE:
        outcomeText = 'Negative Exam';
        break;
      case TASK_OUTCOME_NO_SHOW:
        outcomeText = 'No Show';
        break;
      case TASK_OUTCOME_MISSED:
        outcomeText = 'Missed Target';
        break;
      case TASK_OUTCOME_INSUFFICIENT_RESOURCES:
        outcomeText = 'Insufficient Resources';
        break;
      case TASK_OUTCOME_TARGET_WITHDRAWN:
        outcomeText = 'Target Withdrawn';
        break;
      default:
        break;
    }
    return (
      outcomeText && (
        <p className={`govuk-body govuk-tag govuk-tag--${outcomeClass}`}>
          {outcomeText}
        </p>
      )
    );
  };

  const hasOutcome = (target) => {
    if (target.status.toUpperCase() === TASK_STATUS_COMPLETED.toUpperCase()) {
      return getOutcome(target.outcome);
    }
  };

  const hasRelistedStatus = (target) => {
    if (target.isRelisted) {
      return (
        <p className="govuk-body govuk-tag govuk-tag--relistedTarget">
          Relisted
        </p>
      );
    }
  };

  useEffect(() => {
    const { page } = qs.parse(location.search, { ignoreQueryPrefix: true });
    const newActivePage = parseInt(page || 1, 10);
    setActivePage(newActivePage);
    setRefreshTaskList(true);
  }, [location.search]);

  useEffect(() => {
    setRefreshTaskList(true);
  }, [filtersToApply]);

  useEffect(() => {
    if (refreshTaskList === true) {
      getTaskList();
      return () => {
        source.cancel('Cancelling request');
      };
    }
  }, [refreshTaskList]);

  useInterval(() => {
    getTaskList();
    return () => {
      source.cancel('Cancelling request');
    };
  }, 180000);

  const categoryThreatMapping = {
    A: 1,
    B: 2,
    C: 3,
    D: 4,
    E: 5,
    F: 6,
    G: 7,
  };

  const getHighestThreatLevel = (risks) => {
    let sortedThreatsArray = [];
    const selectors = risks.selectors;
    const rules = risks.rules;

    if (selectors && selectors.length) {
      selectors.map((selector) => {
        const category = selector.contents.category;
        if (sortedThreatsArray[categoryThreatMapping[category]]) {
          sortedThreatsArray[
            parseInt(categoryThreatMapping[category], 10) + 1
          ] = selector;
        } else {
          sortedThreatsArray[parseInt(categoryThreatMapping[category], 10)] = selector;
        }
      });
    }

    if (!selectors?.length && rules && rules.length) {
      rules.map((rule) => {
        const position = rule.contents.rulePriority.split(' ')[1];
        if (sortedThreatsArray[position]) {
          sortedThreatsArray[parseInt(position, 10) + 1] = rule;
        } else sortedThreatsArray[parseInt(position, 10)] = rule;
      });
    }

    // Creating a filtered array removing off empty array elements
    sortedThreatsArray = sortedThreatsArray.filter((i) => i === 0 || i);
    return sortedThreatsArray[0];
  };

  return (
    <>
      {isLoading && (
        <LoadingSpinner>
          <br />
          <br />
          <br />
        </LoadingSpinner>
      )}
      {!isLoading && targetTasks.length === 0 && (
        <p className="govuk-body-l">No more tasks available</p>
      )}

      {!isLoading && targetTasks.length > 0 && (
        <Pagination
          totalItems={targetTaskCount}
          itemsPerPage={itemsPerPage}
          activePage={activePage}
          totalPages={totalPages}
        />
      )}

      {!isLoading
        && targetTasks.length > 0
        && targetTasks.map((target) => {
          const roroData = modifyRoRoPassengersTaskList({
            ...target.summary.roro.details,
          });
          const movementModeIcon = getMovementModeIcon(
            target.movementMode,
            roroData.vehicle,
            roroData.passengers,
          );
          const highestRisk = target.summary.risks[0]
            || getHighestThreatLevel(target.summary.risks);
          return (
            <div
              className="govuk-task-list-card"
              key={target.summary.parentBusinessKey.businessKey}
            >
              <div className="card-container">
                <section className="task-list--item-1">
                  <div className="govuk-grid-row">
                    <div className="govuk-grid-item">
                      <div className="title-container">
                        <div className="heading-container">
                          <h4 className="govuk-heading-s task-heading">
                            {target.summary.parentBusinessKey.businessKey}
                          </h4>
                        </div>
                      </div>
                      <div className="govuk-grid-column task-highest-risk">
                        {highestRisk && (
                          <span className="govuk-body govuk-!-font-weight-bold">
                            {extractDescription(highestRisk)}
                          </span>
                        )}
                      </div>
                      <div className="govuk-grid-column">
                        {highestRisk && extractThreatLevel(highestRisk)}
                        <span className="govuk-body task-risk-statement">
                          {formatTargetRisk(target.summary, highestRisk)}
                        </span>
                      </div>
                      <div className="govuk-grid-column">
                        {hasUpdatedStatus(target.summary)}
                        {hasRelistedStatus(target.summary)}
                        {hasOutcome(target)}
                      </div>
                    </div>
                    <div className="govuk-grid-item">
                      <div className="govuk-!-font-size-19">
                        <div className="claim-button-container">
                          <div>
                            {(activeTab === TASK_STATUS_NEW
                              || activeTab === TASK_STATUS_IN_PROGRESS
                              || currentUser === target.assignee) && (
                              <ClaimButton
                                className="govuk-!-font-weight-bold govuk-button"
                                assignee={target.assignee}
                                taskId={target.id}
                                setError={setError}
                                businessKey={
                                  target.summary.parentBusinessKey.businessKey
                                }
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                <TaskListMode
                  roroData={roroData}
                  target={target}
                  movementModeIcon={movementModeIcon}
                />
                <section className="task-list--item-4">
                  <div className="govuk-grid-row">
                    <div className="govuk-grid-item">
                      <div className="govuk-grid-column">
                        <ul className="govuk-list task-labels govuk-!-margin-top-2">
                          <li className="task-labels-item">
                            <strong className="govuk-!-font-weight-bold">
                              {calculateTaskListTotalRiskScore(target.summary)}
                            </strong>
                          </li>
                        </ul>
                      </div>
                      <div className="govuk-grid-column">
                        <ul className="govuk-list task-labels govuk-!-margin-top-0">
                          <li className="task-labels-item">
                            {formatTargetIndicators(target.summary)}
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="govuk-grid-item task-link-container">
                      <div>
                        <Link
                          className="govuk-link govuk-link--no-visited-state govuk-!-font-weight-bold"
                          to={`/tasks/${target.summary.parentBusinessKey.businessKey}`}
                        >
                          View details
                        </Link>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          );
        })}

      <Pagination
        totalItems={targetTaskCount}
        itemsPerPage={itemsPerPage}
        activePage={activePage}
        totalPages={totalPages}
      />
    </>
  );
};

export default TasksTab;
