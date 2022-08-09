// Third party imports
import React, { useEffect, useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useIsMounted } from '../../../utils/hooks';

// Config
import {
  DEFAULT_MOVEMENT_RORO_MODES,
  DEFAULT_RORO_HAS_SELECTORS,
  RORO_FILTERS,
  TAB_STATUS_MAPPING,
  TARGETER_GROUP,
  TASK_STATUS_COMPLETED,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_NEW,
  TASK_STATUS_TARGET_ISSUED,
  TASK_STATUS_KEY,
} from '../../../constants';
import config from '../../../config';

// Utils
import useAxiosInstance from '../../../utils/axiosInstance';
import { useKeycloak } from '../../../utils/keycloak';
import { toRoRoSelectorsValue } from '../../../utils/roroDataUtil';

// Components/Pages
import TasksTab from './TasksTab';
import ErrorSummary from '../../../govuk/ErrorSummary';
import LoadingSpinner from '../../../components/LoadingSpinner';
import Tabs from '../../../components/Tabs';
import Filter from './Filter';

// Context
import { TaskSelectedTabContext } from '../../../context/TaskSelectedTabContext';

// Styling
import '../__assets__/TaskListPage.scss';

const TaskListPage = () => {
  const history = useHistory();
  const keycloak = useKeycloak();
  const isMounted = useIsMounted();
  const camundaClientV1 = useAxiosInstance(keycloak, config.camundaApiUrlV1);
  const [authorisedGroup, setAuthorisedGroup] = useState();
  const [error, setError] = useState(null);
  const [taskCountsByStatus, setTaskCountsByStatus] = useState();
  const [filtersAndSelectorsCount, setFiltersAndSelectorsCount] = useState();
  const [isLoading, setLoading] = useState(true);
  const [filtersToApply, setFiltersToApply] = useState('');
  const [storedFilters, setStoredFilters] = useState(null);
  const [hasSelectors, setHasSelectors] = useState(null);
  const [movementModesSelected, setMovementModesSelected] = useState([]);
  const { selectTabIndex, selectTaskManagementTabIndex } = useContext(TaskSelectedTabContext);

  let filterPosition = 0;

  const getAppliedFilters = () => {
    const taskStatus = localStorage.getItem('taskId') !== 'null'
      ? localStorage.getItem('taskId')
      : 'new';
    if (
      localStorage.getItem('filterMovementMode')
      || localStorage.getItem('hasSelector')
    ) {
      const movementModes = DEFAULT_MOVEMENT_RORO_MODES.map((mode) => ({
        taskStatuses: [TAB_STATUS_MAPPING[taskStatus]],
        movementModes: mode.movementModes,
        hasSelectors: localStorage.getItem('hasSelector')
          ? localStorage.getItem('hasSelector')
          : mode.hasSelectors,
      }));
      const selectedFilters = localStorage.getItem('filterMovementMode')
        ? localStorage.getItem('filterMovementMode').split(',')
        : [];
      const selectors = DEFAULT_RORO_HAS_SELECTORS.map((selector) => ({
        taskStatuses: [TAB_STATUS_MAPPING[taskStatus]],
        movementModes: selectedFilters,
        hasSelectors: selector.hasSelectors,
      }));
      return movementModes.concat(selectors);
    }

    return [
      ...DEFAULT_MOVEMENT_RORO_MODES.map((mode) => ({
        ...mode,
        taskStatuses: [TAB_STATUS_MAPPING[taskStatus]],
      })),
      ...DEFAULT_RORO_HAS_SELECTORS.map((selector) => {
        return {
          ...selector,
          taskStatuses: [TAB_STATUS_MAPPING[taskStatus]],
        };
      }),
    ];
  };

  const getTaskCount = async (activeFilters) => {
    try {
      const count = await camundaClientV1.post(
        '/targeting-tasks/status-counts',
        [{
          ...activeFilters,
          hasSelectors: toRoRoSelectorsValue(activeFilters?.hasSelectors),
        } || {}],
      );
      if (!isMounted.current) return null;
      setTaskCountsByStatus(count.data[0].statusCounts);
    } catch (e) {
      if (!isMounted.current) return null;
      setError(e.message);
      setTaskCountsByStatus();
    }
  };

  const getFiltersAndSelectorsCount = async (taskId = 'new') => {
    localStorage.setItem('taskId', taskId);
    setFiltersAndSelectorsCount();
    if (camundaClientV1) {
      try {
        const countsResponse = await camundaClientV1.post(
          '/targeting-tasks/status-counts',
          getAppliedFilters(),
        );
        if (!isMounted.current) return null;
        setFiltersAndSelectorsCount(countsResponse.data);
      } catch (e) {
        if (!isMounted.current) return null;
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
        adjustedMovementModeSelected.splice(
          movementModesSelected.indexOf(option.optionName),
          1,
        );
        setMovementModesSelected(adjustedMovementModeSelected);
      }
    }
  };

  const handleFilterApply = (e, resetToDefault) => {
    setLoading(true);
    if (e) {
      e.preventDefault();
    }
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
    const movementModes = localStorage.getItem('filterMovementMode')
      ? localStorage.getItem('filterMovementMode').split(',')
      : [];
    setHasSelectors(selectors);
    setMovementModesSelected(movementModes);

    const selectedArray = [];
    if (selectors) {
      selectedArray.push(selectors);
    }
    if (movementModes?.length > 0) {
      selectedArray.push(...movementModes);
    }
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

  const getDefaultFiltersAndSelectorsCount = (parentIndex, index) => {
    return filtersAndSelectorsCount[parentIndex === 0 ? index : index + 3]
      ?.statusCounts.total;
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

  useEffect(() => {
    const selectedArray = [];
    if (hasSelectors) {
      selectedArray.push(hasSelectors);
    } else {
      selectedArray.push('null');
    }
    if (movementModesSelected?.length > 0) {
      selectedArray.push(...movementModesSelected);
    }
    setStoredFilters(selectedArray);
  }, [hasSelectors, movementModesSelected]);

  useEffect(() => {
    const isTargeter = keycloak.tokenParsed.groups.indexOf(TARGETER_GROUP) > -1;
    if (!isTargeter) {
      setAuthorisedGroup(false);
    }
    if (isTargeter) {
      setAuthorisedGroup(true);
      applySavedFiltersOnLoad();
    }
  }, []);

  useEffect(() => {
    localStorage.removeItem(TASK_STATUS_KEY);
  }, []);

  return (
    <>
      <div className="heading-container govuk-!-margin-bottom-8">
        <h1 className="govuk-heading-xl govuk-!-margin-bottom-0 govuk-!-padding-right-1">Task management (RoRo)</h1>
        {config.copTargetingApiEnabled && (
        <Link
          className="airpax-task-link"
          onClick={() => { selectTabIndex(0); selectTaskManagementTabIndex(0); }}
          to="/airpax/tasks"
        >
          Airpax tasks
        </Link>
        )}
      </div>
      {!authorisedGroup && <p>You are not authorised to view these tasks.</p>}
      {isLoading && (
        <LoadingSpinner>
          <br />
          <br />
          <br />
        </LoadingSpinner>
      )}
      {error && (
        <ErrorSummary
          title="There is a problem"
          errorList={[{ children: error }]}
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
              {RORO_FILTERS.map((filterSet, parentIndex) => {
                return (
                  <Filter
                    key={parentIndex}
                    filterSet={filterSet}
                    storedFilters={storedFilters}
                    handleFilterChange={handleFilterChange}
                    showFilterAndSelectorCount={showFilterAndSelectorCount}
                    parentIndex={parentIndex}
                  />
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
              Apply
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
                  label: `In progress (${
                    taskCountsByStatus?.inProgress || '0'
                  })`,
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
