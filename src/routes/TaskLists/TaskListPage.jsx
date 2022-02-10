// Third party imports
import React, { useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useInterval } from 'react-use';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import * as pluralise from 'pluralise';
import qs from 'qs';
// Config
import { TARGETER_GROUP, TASK_OUTCOME_INSUFFICIENT_RESOURCES, TASK_OUTCOME_MISSED, TASK_OUTCOME_NEGATIVE, TASK_OUTCOME_NO_SHOW, TASK_OUTCOME_POSITIVE, TASK_OUTCOME_TARGET_WITHDRAWN, TASK_STATUS_COMPLETED, TASK_STATUS_IN_PROGRESS, TASK_STATUS_NEW, TASK_STATUS_TARGET_ISSUED } from '../../constants';
import config from '../../config';
// Utils
import useAxiosInstance from '../../utils/axiosInstance';
import { useKeycloak } from '../../utils/keycloak';
import { calculateTaskListTotalRiskScore } from '../../utils/rickScoreCalculator';
import getMovementModeIcon from '../../utils/getVehicleModeIcon';
import { modifyRoRoPassengersTaskList } from '../../utils/roroDataUtil';
// Components/Pages
import ClaimButton from '../../components/ClaimTaskButton';
import ErrorSummary from '../../govuk/ErrorSummary';
import LoadingSpinner from '../../forms/LoadingSpinner';
import Pagination from '../../components/Pagination';
import Tabs from '../../govuk/Tabs';
import TaskListMode from './TaskListMode';
// Styling
import '../__assets__/TaskListPage.scss';

const filters = [
  {
    filterName: 'movementModes',
    filterType: 'checkbox',
    filterClassPrefix: 'checkboxes',
    filterLabel: 'Modes',
    filterOptions: [
      {
        optionName: 'RORO_UNACCOMPANIED_FREIGHT',
        optionLabel: 'RoRo unaccompanied freight',
        checked: false,
      },
      {
        optionName: 'RORO_ACCOMPANIED_FREIGHT',
        optionLabel: 'RoRo accompanied freight',
        checked: false,
      },
      {
        optionName: 'RORO_TOURIST',
        optionLabel: 'RoRo Tourist',
        checked: false,
      },
    ],
  },
  {
    filterName: 'hasSelectors',
    filterType: 'radio',
    filterClassPrefix: 'radios',
    filterLabel: 'Selectors',
    filterOptions: [
      {
        optionName: 'true',
        optionLabel: 'Present',
        checked: false,
      },
      {
        optionName: 'false',
        optionLabel: 'Not present',
        checked: false,
      },
      {
        optionName: 'any',
        optionLabel: 'Any',
        checked: true,
      },
    ],
  },
];

const TabStatusMapping = {
  new: 'NEW',
  inProgress: 'IN_PROGRESS',
  issued: 'ISSUED',
  complete: 'COMPLETE',
};

const TasksTab = ({ taskStatus, filtersToApply, setError, targetTaskCount = 0 }) => {
  dayjs.extend(relativeTime);
  dayjs.extend(utc);
  const keycloak = useKeycloak();
  const location = useLocation();
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
      const sortParams = (taskStatus === 'new' || taskStatus === 'inProgress')
        ? [
          {
            field: 'arrival-date',
            order: 'asc',
          },
        ]
        : null;
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
        setTargetTasks(tasks.data);
      } catch (e) {
        setError(e.message);
        setTargetTasks([]);
      } finally {
        setLoading(false);
        setRefreshTaskList(false);
      }
    }
  };

  const extractDescription = (risk) => {
    const contents = risk.contents;
    if (!contents) {
      return risk.name;
    }
    return contents.groupReference ? contents.groupReference : contents.localReference || contents.name;
  };

  const extractThreatLevel = (risk) => {
    const contents = risk.contents;
    if (!contents) {
      return risk.rulePriority;
    }
    return contents.category ? <span className="govuk-body">SELECTOR <span className="govuk-tag govuk-tag--riskTier">{contents.category}</span></span> : <span className="govuk-tag govuk-tag--riskTier">{contents.rulePriority}</span>;
  };

  const extractRiskType = (risk) => {
    const contents = risk.contents;
    if (!contents) {
      return risk.abuseType;
    }
    return contents.threatType ? contents.threatType : contents.abuseType;
  };

  const formatTargetRisk = (target, highestRisk) => {
    if (highestRisk) {
      const topRisk = extractRiskType(highestRisk);
      const count = highestRisk.contents?.rulePriority ? target.risks?.rules?.length - 1 : target.risks?.rules?.length;
      return `${topRisk} and ${pluralise.withCount(count, '% other rule', '% other rules')}`;
    }
    return null;
  };

  const formatTargetIndicators = (target) => {
    if (target.threatIndicators?.length > 0) {
      const threatIndicatorList = target.threatIndicators.map((threatIndicator) => {
        return threatIndicator.userfacingtext;
      });
      return (
        <ul className="govuk-list item-list--bulleted">
          <li>{`${pluralise.withCount(threatIndicatorList.length, '% indicator', '% indicators')}`}</li>{threatIndicatorList.map((threat) => {
            return (
              <li key={threat}>{threat}</li>
            );
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
    return outcomeText && <p className={`govuk-body govuk-tag govuk-tag--${outcomeClass}`}>{outcomeText}</p>;
  };

  const hasOutcome = (target) => {
    if (target.status.toUpperCase() === TASK_STATUS_COMPLETED.toUpperCase()) {
      return getOutcome(target.outcome);
    }
  };

  const hasRelistedStatus = (target) => {
    if (target.isRelisted) {
      return (
        <p className="govuk-body govuk-tag govuk-tag--relistedTarget">Relisted</p>
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
  }, 60000);

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
        if (sortedThreatsArray[categoryThreatMapping[category]]) sortedThreatsArray[parseInt(categoryThreatMapping[category], 10) + 1] = selector;
        else sortedThreatsArray[parseInt(categoryThreatMapping[category], 10)] = selector;
      });
    }

    if (!selectors?.length && (rules && rules.length)) {
      rules.map((rule) => {
        const position = rule.contents.rulePriority.split(' ')[1];
        if (sortedThreatsArray[position]) sortedThreatsArray[parseInt(position, 10) + 1] = rule;
        else sortedThreatsArray[parseInt(position, 10)] = rule;
      });
    }

    // Creating a filtered array removing off empty array elements
    sortedThreatsArray = sortedThreatsArray.filter((i) => i === 0 || i);
    return sortedThreatsArray[0];
  };

  return (
    <>
      {isLoading && <LoadingSpinner><br /><br /><br /></LoadingSpinner>}
      {!isLoading && targetTasks.length === 0 && (
        <p className="govuk-body-l">No more tasks available</p>
      )}

      {!isLoading && targetTasks.length > 0 && targetTasks.map((target) => {
        const roroData = modifyRoRoPassengersTaskList({ ...target.summary.roro.details });
        const movementModeIcon = getMovementModeIcon(target.movementMode, roroData.vehicle, roroData.passengers);
        const highestRisk = target.summary.risks[0] || getHighestThreatLevel(target.summary.risks);
        return (
          <div className="govuk-task-list-card" key={target.summary.parentBusinessKey.businessKey}>
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
                      <span className="govuk-body">
                        {extractDescription(highestRisk)}
                      </span>
                      )}
                    </div>
                    <div className="govuk-grid-column">
                      {highestRisk && (
                        extractThreatLevel(highestRisk)
                      )}
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
                          {(activeTab === TASK_STATUS_NEW || activeTab === TASK_STATUS_IN_PROGRESS || currentUser === target.assignee)
                          && (
                            <ClaimButton
                              className="govuk-!-font-weight-bold govuk-button"
                              assignee={target.assignee}
                              taskId={target.id}
                              setError={setError}
                              businessKey={target.summary.parentBusinessKey.businessKey}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <TaskListMode roroData={roroData} target={target} movementModeIcon={movementModeIcon} />
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

const TaskListPage = () => {
  const history = useHistory();
  const keycloak = useKeycloak();
  const camundaClientV1 = useAxiosInstance(keycloak, config.camundaApiUrlV1);
  const [authorisedGroup, setAuthorisedGroup] = useState();
  const [error, setError] = useState(null);
  const [filtersToApply, setFiltersToApply] = useState('');
  const [storedFilters, setStoredFilters] = useState(null);
  const [taskCountsByStatus, setTaskCountsByStatus] = useState();
  const [filtersAndSelectorsCount, setFiltersAndSelectorsCount] = useState();

  const [hasSelectors, setHasSelectors] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [movementModesSelected, setMovementModesSelected] = useState([]);

  const defaultMovementModes = [
    {
      taskStatuses: [],
      movementModes: ['RORO_UNACCOMPANIED_FREIGHT'],
      hasSelectors: null,
    },
    {
      taskStatuses: [],
      movementModes: ['RORO_ACCOMPANIED_FREIGHT'],
      hasSelectors: null,
    },
    {
      taskStatuses: [],
      movementModes: ['RORO_TOURIST'],
      hasSelectors: null,
    },
  ];

  const defaultHasSelectors = [
    {
      taskStatuses: [],
      movementModes: [],
      hasSelectors: true,
    },
    {
      taskStatuses: [],
      movementModes: [],
      hasSelectors: false,
    },
    {
      taskStatuses: [],
      movementModes: [],
      hasSelectors: null,
    },
  ];

  let filterPosition = 0;

  const getAppliedFilters = () => {
    const taskId = localStorage.getItem('taskId') !== 'null' ? localStorage.getItem('taskId') : 'new';
    if (localStorage.getItem('filterMovementMode') || localStorage.getItem('hasSelector')) {
      const movementModes = defaultMovementModes.map((mode) => ({ taskStatuses: [TabStatusMapping[taskId]], movementModes: mode.movementModes, hasSelectors: localStorage.getItem('hasSelector') ? localStorage.getItem('hasSelector') : mode.hasSelectors }));
      const selectedFilters = localStorage.getItem('filterMovementMode') ? localStorage.getItem('filterMovementMode').split(',') : [];
      const selectors = defaultHasSelectors.map((selector) => ({ taskStatuses: [TabStatusMapping[taskId]], movementModes: selectedFilters, hasSelectors: selector.hasSelectors }));
      return movementModes.concat(selectors);
    }

    return [
      {
        taskStatuses: [TabStatusMapping[taskId]],
        movementModes: ['RORO_UNACCOMPANIED_FREIGHT'],
        hasSelectors: null,
      },
      {
        taskStatuses: [TabStatusMapping[taskId]],
        movementModes: ['RORO_ACCOMPANIED_FREIGHT'],
        hasSelectors: null,
      },
      {
        taskStatuses: [TabStatusMapping[taskId]],
        movementModes: ['RORO_TOURIST'],
        hasSelectors: null,
      },
      {
        taskStatuses: [TabStatusMapping[taskId]],
        movementModes: [],
        hasSelectors: true,
      },
      {
        taskStatuses: [TabStatusMapping[taskId]],
        movementModes: [],
        hasSelectors: false,
      },
      {
        taskStatuses: [TabStatusMapping[taskId]],
        movementModes: [],
        hasSelectors: null,
      },
    ];
  };

  const getTaskCount = async (activeFilters) => {
    setTaskCountsByStatus();
    if (camundaClientV1) {
      try {
        const count = await camundaClientV1.post('/targeting-tasks/status-counts', [activeFilters || {}]);
        setTaskCountsByStatus(count.data[0].statusCounts);
      } catch (e) {
        setError(e.message);
        setTaskCountsByStatus();
      }
    }
  };

  const getFiltersAndSelectorsCount = async (taskId = 'new') => {
    localStorage.setItem('taskId', taskId);
    setFiltersAndSelectorsCount();
    if (camundaClientV1) {
      try {
        const countsResponse = await camundaClientV1.post('/targeting-tasks/status-counts', getAppliedFilters());
        setFiltersAndSelectorsCount(countsResponse.data);
      } catch (e) {
        setError(e.message);
        setFiltersAndSelectorsCount();
      }
    }
  };

  const handleFilterChange = (e, option, filterSet) => {
    if (filterSet.filterName === 'hasSelectors') {
      if (option.optionName !== 'any') {
        setHasSelectors(option.optionName);
      } else {
        setHasSelectors(null);
      }
    }
    if (filterSet.filterName === 'movementModes') {
      if (e.target.checked) {
        setMovementModesSelected([...movementModesSelected, option.optionName]);
      } else {
        const adjustedMovementModeSelected = [...movementModesSelected];
        adjustedMovementModeSelected.splice(movementModesSelected.indexOf(option.optionName), 1);
        setMovementModesSelected(adjustedMovementModeSelected);
      }
    }
  };

  const handleFilterApply = (e, resetToDefault) => {
    setLoading(true);
    if (e) { e.preventDefault(); }
    let apiParams = [];
    if (!resetToDefault) {
      localStorage.setItem('filterMovementMode', movementModesSelected);
      localStorage.setItem('hasSelector', hasSelectors);
      apiParams = {
        movementModes: movementModesSelected || [],
        hasSelectors,
      };
    } else {
      apiParams = {
        movementModes: [],
        hasSelectors: null,
      };
    }
    getTaskCount(apiParams);
    setFiltersToApply(apiParams);
    getFiltersAndSelectorsCount(localStorage.getItem('taskId'));
    setLoading(false);
  };

  const handleFilterReset = (e) => {
    e.preventDefault();
    // Clear localStorage
    localStorage.removeItem('filterMovementMode');
    localStorage.removeItem('hasSelector');
    /* Clear checked options :
     * when hasSelectors was not selected, it stores 'null' as a string in the
     * localStorage so needs to be excluded in the if condition
    */
    if (hasSelectors && hasSelectors !== 'null') {
      document.getElementById(hasSelectors).checked = false;
      setHasSelectors(null);
    }
    if (movementModesSelected) {
      movementModesSelected.map((mode) => {
        document.getElementById(mode).checked = false;
      });
      setMovementModesSelected([]);
    }
    setStoredFilters([]);
    handleFilterApply(e, 'resetToDefault'); // run with default params
  };

  const applySavedFiltersOnLoad = () => {
    const selectors = localStorage.getItem('hasSelector');
    const movementModes = localStorage.getItem('filterMovementMode') ? localStorage.getItem('filterMovementMode').split(',') : [];
    setHasSelectors(selectors);
    setMovementModesSelected(movementModes);

    const selectedArray = [];
    if (selectors) { selectedArray.push(selectors); }
    if (movementModes?.length > 0) { selectedArray.push(...movementModes); }
    setStoredFilters(selectedArray);

    const apiParams = {
      movementModes,
      hasSelectors: selectors,
    };

    getTaskCount(apiParams);
    setFiltersToApply(apiParams);
    getFiltersAndSelectorsCount(localStorage.getItem('taskId'));
    setLoading(false);
  };

  useEffect(() => {
    const selectedArray = [];
    if (hasSelectors) { selectedArray.push(hasSelectors); } else { selectedArray.push('null'); }
    if (movementModesSelected?.length > 0) { selectedArray.push(...movementModesSelected); }
    setStoredFilters(selectedArray);
  }, [hasSelectors, movementModesSelected]);

  useEffect(() => {
    const isTargeter = (keycloak.tokenParsed.groups).indexOf(TARGETER_GROUP) > -1;
    if (!isTargeter) {
      setAuthorisedGroup(false);
    }
    if (isTargeter) {
      setAuthorisedGroup(true);
      applySavedFiltersOnLoad();
    }
  }, []);

  useEffect(() => {
    localStorage.removeItem('taskId');
  }, []);

  const getDefaultFiltersAndSelectorsCount = (parentIndex, index) => {
    return filtersAndSelectorsCount[parentIndex === 0 ? index : index + 3]?.statusCounts.total;
  };

  const renderSelectedFiltersCount = () => {
    const totalCount = filtersAndSelectorsCount[filterPosition]?.statusCounts?.total;
    filterPosition += 1;
    return totalCount;
  };

  const showFilterAndSelectorCount = (parentIndex, index) => {
    let count = 0;
    if (filtersAndSelectorsCount) {
      if (!localStorage.getItem('filterMovementMode')) {
        count = getDefaultFiltersAndSelectorsCount(parentIndex, index);
      } else {
        count = renderSelectedFiltersCount();
      }
    }
    return count || 0;
  };

  return (
    <>
      <h1 className="govuk-heading-xl">Task management</h1>
      {!authorisedGroup && (<p>You are not authorised to view these tasks.</p>)}
      {isLoading && <LoadingSpinner><br /><br /><br /></LoadingSpinner>}
      {error && (
        <ErrorSummary
          title="There is a problem"
          errorList={[
            { children: error },
          ]}
        />
      )}

      {!isLoading && authorisedGroup && (
        <div className="govuk-grid-row">
          <section className="govuk-grid-column-one-quarter">
            <div className="cop-filters-container">
              <div className="cop-filters-header">
                <h2 className="govuk-heading-s">Filters</h2>
                <button
                  className="govuk-link govuk-heading-s "
                  data-module="govuk-button"
                  type="button"
                  onClick={(e) => {
                    handleFilterReset(e);
                  }}
                >
                  Clear all filters
                </button>
              </div>

              {filters.length > 0 && filters.map((filterSet, parentIndex) => {
                return (
                  <div className="govuk-form-group" key={filterSet.filterLabel}>
                    <fieldset className="govuk-fieldset">
                      <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
                        <h4 className="govuk-fieldset__heading">{filterSet.filterLabel}</h4>
                      </legend>
                      <ul className={`govuk-${filterSet.filterClassPrefix} govuk-${filterSet.filterClassPrefix}--small`}>
                        {filterSet.filterOptions.map((option, index) => {
                          let checked = !!((storedFilters && !!storedFilters.find((filter) => {
                            if (filter === 'null' && option.optionName === 'any') return true;
                            return filter === option.optionName;
                          })));
                          return (
                            <li
                              className={`govuk-${filterSet.filterClassPrefix}__item`}
                              key={option.optionName}
                            >
                              <input
                                className={`govuk-${filterSet.filterClassPrefix}__input`}
                                id={option.optionName}
                                name={filterSet.filterName}
                                type={filterSet.filterType}
                                value={option.optionName}
                                checked={checked}
                                onChange={(e) => {
                                  checked = !checked;
                                  handleFilterChange(e, option, filterSet);
                                }}
                                data-testid={`${filterSet.filterLabel}-${option.optionName}`}
                              />
                              <label
                                className={`govuk-!-padding-right-1 govuk-label govuk-${filterSet.filterClassPrefix}__label`}
                                htmlFor={option.optionName}
                              >
                                {option.optionLabel} ({showFilterAndSelectorCount(parentIndex, index)})
                              </label>
                            </li>
                          );
                        })}
                      </ul>
                    </fieldset>
                  </div>
                );
              })}
            </div>
            <button
              className="govuk-button"
              data-module="govuk-button"
              type="button"
              onClick={(e) => {
                handleFilterApply(e);
              }}
            >
              Apply filters
            </button>
          </section>

          <section className="govuk-grid-column-three-quarters">
            <Tabs
              title="Title"
              id="tasks"
              onTabClick={(e) => {
                history.push();
                getFiltersAndSelectorsCount(e.id);
              }}
              items={[
                {
                  id: TASK_STATUS_NEW,
                  label: `New (${taskCountsByStatus?.new || '0'})`,
                  panel: (
                    <>
                      <h2 className="govuk-heading-l">New tasks</h2>
                      <TasksTab
                        taskStatus={TASK_STATUS_NEW}
                        filtersToApply={filtersToApply}
                        targetTaskCount={taskCountsByStatus?.new}
                        setError={setError}
                      />
                    </>
                  ),
                },
                {
                  id: TASK_STATUS_IN_PROGRESS,
                  label: `In progress (${taskCountsByStatus?.inProgress || '0'})`,
                  panel: (
                    <>
                      <h2 className="govuk-heading-l">In progress tasks</h2>
                      <TasksTab
                        taskStatus={TASK_STATUS_IN_PROGRESS}
                        filtersToApply={filtersToApply}
                        targetTaskCount={taskCountsByStatus?.inProgress}
                        setError={setError}
                      />
                    </>
                  ),
                },
                {
                  id: TASK_STATUS_TARGET_ISSUED,
                  label: `Issued (${taskCountsByStatus?.issued || '0'})`,
                  panel: (
                    <>
                      <h2 className="govuk-heading-l">Target issued tasks</h2>
                      <TasksTab
                        taskStatus={TASK_STATUS_TARGET_ISSUED}
                        filtersToApply={filtersToApply}
                        targetTaskCount={taskCountsByStatus?.issued}
                        setError={setError}
                      />
                    </>
                  ),
                },
                {
                  id: TASK_STATUS_COMPLETED,
                  label: `Complete (${taskCountsByStatus?.complete || '0'})`,
                  panel: (
                    <>
                      <h2 className="govuk-heading-l">Completed tasks</h2>
                      <TasksTab
                        taskStatus={TASK_STATUS_COMPLETED}
                        filtersToApply={filtersToApply}
                        targetTaskCount={taskCountsByStatus?.complete}
                        setError={setError}
                      />
                    </>
                  ),
                },
              ]}
            />
          </section>
        </div>
      )}
    </>
  );
};

export default TaskListPage;
