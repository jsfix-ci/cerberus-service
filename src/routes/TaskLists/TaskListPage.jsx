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
import { TARGETER_GROUP, TASK_STATUS_COMPLETED, TASK_STATUS_IN_PROGRESS, TASK_STATUS_NEW, TASK_STATUS_TARGET_ISSUED } from '../../constants';
import config from '../../config';
// Utils
import useAxiosInstance from '../../utils/axiosInstance';
import { useKeycloak } from '../../utils/keycloak';
import { calculateTaskListTotalRiskScore } from '../../utils/rickScoreCalculator';
import getMovementModeIcon from '../../utils/getVehicleModeIcon';
import modify from '../../utils/roroDataUtil';
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
        checked: false,
      },
    ],
  },
];

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

  const formatTargetRisk = (target) => {
    if (target.risks.length >= 1) {
      const topRisk = target.risks[0].contents
        ? target.risks[0].contents.threatType
        : target.risks[0].abuseType;
      const count = target.risks.length - 1;
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

  return (
    <>
      {isLoading && <LoadingSpinner><br /><br /><br /></LoadingSpinner>}
      {!isLoading && targetTasks.length === 0 && (
        <p className="govuk-body-l">No more tasks available</p>
      )}

      {!isLoading && targetTasks.length > 0 && targetTasks.map((target) => {
        const roroData = modify({ ...target.summary.roro.details });
        const movementModeIcon = getMovementModeIcon(target.movementMode, roroData.vehicle, roroData.passengers);
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
                          <span className="dot" />
                          {target.summary.risks[0] && (
                          <span className="govuk-body">
                            {target.summary.risks[0].contents ? target.summary.risks[0].contents.groupReference : target.summary.risks[0].name}
                          </span>
                          )}
                        </h4>
                      </div>
                    </div>
                    <div className="govuk-grid-column">
                      {target.summary.risks[0] && (
                      <span className="govuk-tag govuk-tag--riskTier">
                        {target.summary.risks[0].contents ? target.summary.risks[0].contents.category : target.summary.risks[0].rulePriority}
                      </span>
                      )}
                      <span className="govuk-body task-risk-statement">
                        {formatTargetRisk(target.summary)}
                      </span>
                    </div>
                    <div className="govuk-grid-column">
                      {hasUpdatedStatus(target.summary)}
                      {hasRelistedStatus(target.summary)}
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
  const [storedFilters, setStoredFilters] = useState();
  const [taskCountsByStatus, setTaskCountsByStatus] = useState();
  const [filtersAndSelectorsCount, setFiltersAndSelectorsCount] = useState();

  const [hasSelectors, setHasSelectors] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [movementModesSelected, setMovementModesSelected] = useState([]);

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

  const getFiltersAndSelectorsCount = async () => {
    setFiltersAndSelectorsCount();
    if (camundaClientV1) {
      try {
        const filtersSelectorsCount = await camundaClientV1.post('/targeting-tasks/status-counts', [
          {
            movementModes: ['RORO_UNACCOMPANIED_FREIGHT'],
            hasSelectors: null,
          },
          {
            movementModes: ['RORO_ACCOMPANIED_FREIGHT'],
            hasSelectors: null,
          },
          {
            movementModes: ['RORO_TOURIST'],
            hasSelectors: null,
          },
          {
            movementModes: [],
            hasSelectors: true,
          },
          {
            movementModes: [],
            hasSelectors: false,
          },
          {
            movementModes: [],
            hasSelectors: null,
          },
        ]);
        setFiltersAndSelectorsCount(filtersSelectorsCount.data);
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
    getFiltersAndSelectorsCount();
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
    getFiltersAndSelectorsCount();
    setLoading(false);
  };

  useEffect(() => {
    const selectedArray = [];
    if (hasSelectors) { selectedArray.push(hasSelectors); }
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

  const showFilterAndSelectorCount = (parentIndex, index) => {
    let count = 0;
    if (filtersAndSelectorsCount) {
      count = filtersAndSelectorsCount[parentIndex === 0 ? index : index + 3]?.statusCounts.total;
    }
    return count;
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
                          let checked = !!((storedFilters && !!storedFilters.find((filter) => filter === option.optionName)));
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
                                defaultChecked={checked}
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
                                {option.optionLabel}
                              </label>
                              <span className="govuk-!-margin-top-2 inline-block">({showFilterAndSelectorCount(parentIndex, index)})</span>
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
              onTabClick={() => { history.push(); }}
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
