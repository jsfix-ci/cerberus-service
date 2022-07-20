import React, { useEffect, useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { useIsMounted } from '../../../utils/hooks';

import { DEFAULT_APPLIED_AIRPAX_FILTER_STATE,
  DEFAULT_MOVEMENT_AIRPAX_MODE,
  DEFAULT_AIRPAX_SELECTORS,
  AIRPAX_FILTERS_KEY,
  TARGETER_GROUP,
  TAB_STATUS_MAPPING,
  TASK_STATUS_COMPLETED,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_NEW,
  TASK_STATUS_TARGET_ISSUED,
  TASK_STATUS_KEY,
  MOVEMENT_VARIANT } from '../../../constants';

// Utils
import { getTaskStatus,
  getLocalStoredItemByKeyValue } from '../../../utils/roroDataUtil';
import { useKeycloak } from '../../../utils/keycloak';
import useAxiosInstance from '../../../utils/axiosInstance';

// Config
import config from '../../../config';

// Components/Pages
import ErrorSummary from '../../../govuk/ErrorSummary';
import LoadingSpinner from '../../../components/LoadingSpinner';
import Filter from '../../../components/Filter';
import Tabs from '../../../components/Tabs';
import TasksTab from './TasksTab';

// Context
import { TaskSelectedTabContext } from '../../../context/TaskSelectedTabContext';

// Styling
import '../__assets__/TaskListPage.scss';

const TaskListPage = () => {
  const keycloak = useKeycloak();
  const history = useHistory();
  const isMounted = useIsMounted();
  const apiClient = useAxiosInstance(keycloak, config.taskApiUrl);
  const source = axios.CancelToken.source();
  const [authorisedGroup, setAuthorisedGroup] = useState();
  const [error, setError] = useState(null);
  const [taskCountsByStatus, setTaskCountsByStatus] = useState();
  const [filtersAndSelectorsCount, setFiltersAndSelectorsCount] = useState();
  const [isLoading, setLoading] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_APPLIED_AIRPAX_FILTER_STATE);
  const [rulesOptions, setRulesOptions] = useState([]);
  const { taskManagementTabIndex, selectTaskManagementTabIndex, selectTabIndex } = useContext(TaskSelectedTabContext);

  const getRulesOptions = async () => {
    try {
      const response = await apiClient.get('/filters/rules');
      if (!isMounted.current) return null;
      setRulesOptions(response.data);
    } catch (e) {
      if (!isMounted.current) return null;
      setError(e.message);
      setRulesOptions([]);
    }
  };

  const getAppliedFilters = () => {
    const taskStatus = getTaskStatus(TASK_STATUS_KEY);
    const storedData = getLocalStoredItemByKeyValue(AIRPAX_FILTERS_KEY);
    if (storedData) {
      const movementModes = DEFAULT_MOVEMENT_AIRPAX_MODE.map((mode) => ({
        taskStatuses: [TAB_STATUS_MAPPING[taskStatus]],
        movementModes: mode.movementModes,
        selectors: storedData.selectors || mode.selectors,
        ruleIds: storedData.ruleIds || mode.ruleIds,
        searchText: storedData.searchText || mode.searchText,
      }));
      const selectors = DEFAULT_AIRPAX_SELECTORS.map((selector) => ({
        taskStatuses: [TAB_STATUS_MAPPING[taskStatus]],
        movementModes: [storedData.mode] || [],
        selectors: selector.selectors,
        ruleIds: storedData.ruleIds || [],
        searchText: storedData.searchText || selector.searchText,
      }));
      return movementModes.concat(selectors);
    }
    return [
      ...DEFAULT_MOVEMENT_AIRPAX_MODE.map((mode) => ({
        ...mode,
        taskStatuses: [TAB_STATUS_MAPPING[taskStatus]],
      })),
      ...DEFAULT_AIRPAX_SELECTORS.map((selector) => {
        return {
          ...selector,
          taskStatuses: [TAB_STATUS_MAPPING[taskStatus]],
        };
      }),
    ];
  };

  const getTaskCount = async (activeFilters) => {
    try {
      const count = await apiClient.post(
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
  };

  const getFiltersAndSelectorsCount = async (taskStatus = TASK_STATUS_NEW) => {
    localStorage.setItem(TASK_STATUS_KEY, taskStatus);
    try {
      const countsResponse = await apiClient.post(
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
  };

  const applyFilters = (payload) => {
    setLoading(true);
    payload = {
      ...payload,
      movementModes: payload?.mode ? [payload.mode] : [],
      ruleIds: payload?.rules ? payload.rules.map((rule) => rule.id).filter((id) => typeof id === 'number') : [],
    };
    localStorage.setItem(AIRPAX_FILTERS_KEY, JSON.stringify(payload));
    getTaskCount(payload);
    setAppliedFilters(payload);
    getFiltersAndSelectorsCount(getTaskStatus(TASK_STATUS_KEY));
    setLoading(false);
  };

  const handleFilterReset = (e) => {
    e.preventDefault();
    localStorage.removeItem(AIRPAX_FILTERS_KEY);
    getFiltersAndSelectorsCount(getTaskStatus(TASK_STATUS_KEY));
    setAppliedFilters(DEFAULT_APPLIED_AIRPAX_FILTER_STATE);
    getTaskCount(DEFAULT_APPLIED_AIRPAX_FILTER_STATE);
  };

  const applySavedFiltersOnLoad = () => {
    applyFilters(getLocalStoredItemByKeyValue(AIRPAX_FILTERS_KEY) || DEFAULT_APPLIED_AIRPAX_FILTER_STATE);
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
    getRulesOptions();
    return () => {
      source.cancel('Cancelling request');
    };
  }, []);

  useEffect(() => {
    selectTabIndex(taskManagementTabIndex);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="heading-container govuk-!-margin-bottom-8">
        <h1 className="govuk-heading-xl govuk-!-margin-bottom-0 govuk-!-padding-right-1">Task management (AirPax)</h1>
        <Link
          className="roro-task-link"
          onClick={() => { selectTabIndex(0); selectTaskManagementTabIndex(0); }}
          to="/tasks"
        >
          RoRo tasks
        </Link>
      </div>
      {!authorisedGroup && <p>You are not authorised to view these tasks.</p>}
      {error && (
        <ErrorSummary
          title="There is a problem"
          errorList={[{ children: error }]}
        />
      )}
      <div className="govuk-grid-row">
        <section className="govuk-grid-column-one-quarter">
          <div className="cop-filters-container">
            <div className="cop-filters-header">
              <h2 className="govuk-heading-s">Filters</h2>
              <button
                className="govuk-link govuk-heading-s "
                data-module="govuk-button"
                type="button"
                onClick={(e) => handleFilterReset(e)}
              >
                Clear all filters
              </button>
            </div>
            <div>
              <Filter
                mode={MOVEMENT_VARIANT.AIRPAX}
                taskStatus={getTaskStatus(TASK_STATUS_KEY)}
                onApply={applyFilters}
                appliedFilters={appliedFilters}
                filtersAndSelectorsCount={filtersAndSelectorsCount}
                rulesOptions={rulesOptions}
              />
            </div>
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
                label: `New (${taskCountsByStatus?.new || 0})`,
                panel: (
                  <>
                    <h2 className="govuk-heading-l">New tasks</h2>
                    <TasksTab
                      taskStatus={TASK_STATUS_NEW}
                      filtersToApply={appliedFilters}
                      setError={setError}
                      targetTaskCount={taskCountsByStatus?.new}
                    />
                  </>
                ),
              },
              {
                id: TASK_STATUS_IN_PROGRESS,
                label: `In progress (${taskCountsByStatus?.inProgress || 0})`,
                panel: (
                  <>
                    <h2 className="govuk-heading-l">In progress tasks</h2>
                    <TasksTab
                      taskStatus={TASK_STATUS_IN_PROGRESS}
                      filtersToApply={appliedFilters}
                      setError={setError}
                      targetTaskCount={taskCountsByStatus?.inProgress}
                    />
                  </>
                ),
              },
              {
                id: TASK_STATUS_TARGET_ISSUED,
                label: `Issued (${taskCountsByStatus?.issued || 0})`,
                panel: (
                  <>
                    <h2 className="govuk-heading-l">Target issued tasks</h2>
                    <TasksTab
                      taskStatus={TASK_STATUS_TARGET_ISSUED}
                      filtersToApply={appliedFilters}
                      setError={setError}
                      targetTaskCount={taskCountsByStatus?.issued}
                    />
                  </>
                ),
              },
              {
                id: TASK_STATUS_COMPLETED,
                label: `Complete (${taskCountsByStatus?.complete || 0})`,
                panel: (
                  <>
                    <h2 className="govuk-heading-l">Completed tasks</h2>
                    <TasksTab
                      taskStatus={TASK_STATUS_COMPLETED}
                      filtersToApply={appliedFilters}
                      setError={setError}
                      targetTaskCount={taskCountsByStatus?.complete}
                    />
                  </>
                ),
              },
            ]}
          />
        </section>
      </div>
    </>
  );
};

export default TaskListPage;
