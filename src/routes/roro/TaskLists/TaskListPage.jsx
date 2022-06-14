// Third party imports
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useIsMounted } from '../../../utils/hooks';

// Config
import {
  RORO_FILTERS_KEY,
  DEFAULT_APPLIED_RORO_FILTER_STATE,
  DEFAULT_MOVEMENT_RORO_MODES,
  DEFAULT_RORO_HAS_SELECTORS,
  TAB_STATUS_MAPPING,
  TARGETER_GROUP,
  TASK_STATUS_COMPLETED,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_NEW,
  TASK_STATUS_TARGET_ISSUED,
  TASK_STATUS_KEY,
  MOVEMENT_VARIANT,
} from '../../../constants';
import config from '../../../config';

// Utils
import useAxiosInstance from '../../../utils/axiosInstance';
import { useKeycloak } from '../../../utils/keycloak';
import { getTaskStatus,
  getLocalStoredItemByKeyValue,
  toRoRoSelectorsValue } from '../../../utils/roroDataUtil';

// Components/Pages
import TasksTab from './TasksTab';
import ErrorSummary from '../../../govuk/ErrorSummary';
import LoadingSpinner from '../../../components/LoadingSpinner';
import Tabs from '../../../components/Tabs';
import Filter from '../../../components/Filter';

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
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_APPLIED_RORO_FILTER_STATE);

  const getAppliedFilters = () => {
    const taskStatus = getTaskStatus(TASK_STATUS_KEY);
    const storedData = getLocalStoredItemByKeyValue(RORO_FILTERS_KEY);
    if (storedData) {
      const movementModes = DEFAULT_MOVEMENT_RORO_MODES.map((mode) => ({
        taskStatuses: [TAB_STATUS_MAPPING[taskStatus]],
        movementModes: mode.movementModes,
        hasSelectors: toRoRoSelectorsValue(storedData.hasSelectors) || toRoRoSelectorsValue(mode.hasSelectors),
      }));
      const selectors = DEFAULT_RORO_HAS_SELECTORS.map((selector) => ({
        taskStatuses: [TAB_STATUS_MAPPING[taskStatus]],
        movementModes: [storedData.mode].filter((mode) => !!mode) || [],
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

  const getFiltersAndSelectorsCount = async (taskStatus = TASK_STATUS_NEW) => {
    localStorage.setItem(TASK_STATUS_KEY, taskStatus);
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
    localStorage.setItem(RORO_FILTERS_KEY, JSON.stringify(payload));
    // Modify the post post param to be different from what is stored in stage.
    const toApply = {
      ...payload,
      movementModes: payload?.mode ? [payload.mode] : [],
      hasSelectors: payload?.hasSelectors !== DEFAULT_APPLIED_RORO_FILTER_STATE.hasSelectors
        ? payload?.hasSelectors : null,
    };
    getTaskCount(toApply);
    setAppliedFilters(payload);
    getFiltersAndSelectorsCount(getTaskStatus(TASK_STATUS_KEY));
    setLoading(false);
  };

  const handleFilterReset = (e) => {
    e.preventDefault();
    localStorage.removeItem(RORO_FILTERS_KEY);
    getFiltersAndSelectorsCount(getTaskStatus(TASK_STATUS_KEY));
    getTaskCount(DEFAULT_APPLIED_RORO_FILTER_STATE);
    setAppliedFilters(DEFAULT_APPLIED_RORO_FILTER_STATE);
  };

  const applySavedFiltersOnLoad = () => {
    applyFilters(getLocalStoredItemByKeyValue(RORO_FILTERS_KEY) || DEFAULT_APPLIED_RORO_FILTER_STATE);
    getFiltersAndSelectorsCount(getTaskStatus(TASK_STATUS_KEY));
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
    localStorage.removeItem(TASK_STATUS_KEY);
  }, []);

  return (
    <>
      <div className="heading-container govuk-!-margin-bottom-8">
        <h1 className="govuk-heading-xl govuk-!-margin-bottom-0 govuk-!-padding-right-1">Task management (RoRo)</h1>
        <Link className="airpax-task-link" to="/airpax/tasks">Airpax tasks</Link>
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
              <Filter
                mode={MOVEMENT_VARIANT.RORO}
                taskStatus={getTaskStatus(TASK_STATUS_KEY)}
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
                        filtersToApply={appliedFilters}
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
                        filtersToApply={appliedFilters}
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
                        filtersToApply={appliedFilters}
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
                        filtersToApply={appliedFilters}
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
