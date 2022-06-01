// Third party imports
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useIsMounted } from '../../../utils/hooks';

// Config
import {
  FILTERS_KEY,
  DEFAULT_APPLIED_FILTER_STATE,
  DEFAULT_MOVEMENT_MODES,
  DEFAULT_HAS_SELECTORS,
  TAB_STATUS_MAPPING,
  TARGETER_GROUP,
  TASK_STATUS_COMPLETED,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_NEW,
  TASK_STATUS_TARGET_ISSUED,
  TASK_ID_KEY,
} from '../../../constants';
import config from '../../../config';

// Utils
import useAxiosInstance from '../../../utils/axiosInstance';
import { useKeycloak } from '../../../utils/keycloak';

// Components/Pages
import TasksTab from './TasksTab';
import ErrorSummary from '../../../govuk/ErrorSummary';
import LoadingSpinner from '../../../components/LoadingSpinner';
import Tabs from '../../../components/Tabs';
import RoRoFilter from '../../../components/RoRoFilter';

// Styling
import '../__assets__/TaskListPage.scss';

const TaskListPage = () => {
  const history = useHistory();
  const keycloak = useKeycloak();
  const isMounted = useIsMounted();
  const camundaClientV1 = useAxiosInstance(keycloak, config.camundaApiUrlV1);
  const [authorisedGroup, setAuthorisedGroup] = useState();
  const [error, setError] = useState(null);
  const [filtersToApply, setFiltersToApply] = useState('');
  const [taskCountsByStatus, setTaskCountsByStatus] = useState();
  const [filtersAndSelectorsCount, setFiltersAndSelectorsCount] = useState();
  const [isLoading, setLoading] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_APPLIED_FILTER_STATE);

  const getTaskId = () => {
    return localStorage.getItem(TASK_ID_KEY) !== null
      ? localStorage.getItem(TASK_ID_KEY) : TASK_STATUS_NEW;
  };

  // Check if we have stored selector in local storage
  const hasLocalStorageFilters = () => {
    return localStorage.getItem(FILTERS_KEY) !== null;
  };

  const getLocalStorageFilters = () => {
    return JSON.parse(localStorage.getItem(FILTERS_KEY));
  };

  const getAppliedFilters = () => {
    const taskId = getTaskId();
    const localStorageFilters = hasLocalStorageFilters() ? getLocalStorageFilters() : null;
    if (localStorage.getItem(FILTERS_KEY)) {
      const movementModes = DEFAULT_MOVEMENT_MODES.map((mode) => ({
        taskStatuses: [TAB_STATUS_MAPPING[taskId]],
        movementModes: mode.movementModes,
        hasSelectors: localStorageFilters?.hasSelectors
          ? localStorageFilters.hasSelectors : mode.hasSelectors,
      }));
      const selectedFilters = localStorageFilters ? [localStorageFilters.mode] : [];
      const selectors = DEFAULT_HAS_SELECTORS.map((selector) => ({
        taskStatuses: [TAB_STATUS_MAPPING[taskId]],
        movementModes: selectedFilters,
        hasSelectors: selector.hasSelectors,
      }));
      return movementModes.concat(selectors);
    }
    return [
      ...DEFAULT_MOVEMENT_MODES.map((mode) => ({
        ...mode,
        taskStatuses: [TAB_STATUS_MAPPING[taskId]],
      })),
      ...DEFAULT_HAS_SELECTORS.map((selector) => {
        return {
          ...selector,
          taskStatuses: [TAB_STATUS_MAPPING[taskId]],
        };
      }),
    ];
  };

  const getTaskCount = async (activeFilters) => {
    setTaskCountsByStatus();
    if (camundaClientV1) {
      try {
        const count = await camundaClientV1.post(
          '/targeting-tasks/status-counts',
          [activeFilters || {}],
        );
        if (!isMounted.current) return null;
        setTaskCountsByStatus(count.data[0].statusCounts);
      } catch (e) {
        if (!isMounted.current) return null;
        setError(e.message);
        setTaskCountsByStatus();
      }
    }
  };

  const getFiltersAndSelectorsCount = async (taskId = TASK_STATUS_NEW) => {
    localStorage.setItem(TASK_ID_KEY, taskId);
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

  const applyFilters = (payload) => {
    setLoading(true);
    localStorage.setItem(FILTERS_KEY, JSON.stringify(payload));
    setAppliedFilters(payload);
    const toApply = {
      ...payload,
      movementModes: payload?.mode ? [payload.mode] : [],
    };
    getTaskCount(toApply);
    setFiltersToApply(toApply);
    getFiltersAndSelectorsCount(getTaskId());
    setLoading(false);
  };

  const handleFilterReset = (e) => {
    e.preventDefault();
    localStorage.removeItem(FILTERS_KEY);
    setAppliedFilters(DEFAULT_APPLIED_FILTER_STATE);
    getFiltersAndSelectorsCount(getTaskId());
    getTaskCount(DEFAULT_APPLIED_FILTER_STATE);
    setFiltersToApply(DEFAULT_APPLIED_FILTER_STATE);
  };

  const applySavedFiltersOnLoad = () => {
    const loadedFilters = localStorage.getItem(FILTERS_KEY);
    applyFilters(JSON.parse(loadedFilters));
    getFiltersAndSelectorsCount(getTaskId());
    setLoading(false);
  };

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
    localStorage.removeItem(TASK_ID_KEY);
  }, []);

  return (
    <>
      <h1 className="govuk-heading-xl">Task management</h1>
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
              <RoRoFilter
                taskStatus={getTaskId()}
                onApply={applyFilters}
                appliedFilters={appliedFilters}
                filtersAndSelectorsCount={filtersAndSelectorsCount}
              />
            </div>
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
