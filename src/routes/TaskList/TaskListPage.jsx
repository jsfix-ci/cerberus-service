import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import axios from 'axios';
import useIsMounted from '../../utils/Hooks/hooks';

import {
  DEFAULT_APPLIED_AIRPAX_FILTER_STATE,
  DEFAULT_MOVEMENT_AIRPAX_MODE,
  DEFAULT_AIRPAX_SELECTORS,
  DEFAULT_APPLIED_RORO_FILTER_STATE_V2,
  DEFAULT_MOVEMENT_RORO_MODES_V2,
  DEFAULT_RORO_SELECTORS_V2,
  LOCAL_STORAGE_KEYS,
  TARGETER_GROUP,
  TAB_STATUS_MAPPING,
  TASK_STATUS,
  VIEW,
} from '../../utils/constants';

// Utils
import { CommonUtil, StorageUtil } from '../../utils';
import { useKeycloak } from '../../context/Keycloak';
import { useAxiosInstance } from '../../utils/Axios/axiosInstance';

// Config
import config from '../../utils/config';

// Components/Pages
import ErrorSummary from '../../components/ErrorSummary/ErrorSummary';
import Filter from '../../components/Filter/Filter';
import Tabs from '../../components/Tabs/Tabs';
import TasksTab from './TasksTab';
import Header from './Header';

// Context
import { TaskSelectedTabContext } from '../../context/TaskSelectedTabContext';

// Services
import AxiosRequests from '../../api/axiosRequests';

// Styling
import './TaskListPage.scss';

const TaskListPage = () => {
  const keycloak = useKeycloak();
  const history = useHistory();
  const isMounted = useIsMounted();
  const location = useLocation();
  const view = CommonUtil.setViewAndGet(location.pathname);
  const apiClient = useAxiosInstance(keycloak, config.taskApiUrl);
  const currentUser = keycloak.tokenParsed.email;
  const source = axios.CancelToken.source();
  const [authorisedGroup, setAuthorisedGroup] = useState();
  const [error, setError] = useState(null);
  const [taskCountsByStatus, setTaskCountsByStatus] = useState();
  const [filtersAndSelectorsCount, setFiltersAndSelectorsCount] = useState();
  const [appliedFilters, setAppliedFilters] = useState(
    () => (view === VIEW.AIRPAX ? DEFAULT_APPLIED_AIRPAX_FILTER_STATE : DEFAULT_APPLIED_RORO_FILTER_STATE_V2),
  );
  const [rulesOptions, setRulesOptions] = useState([]);
  const { taskManagementTabIndex, selectTaskManagementTabIndex, selectTabIndex } = useContext(TaskSelectedTabContext);

  const hasAssignee = () => {
    const payload = StorageUtil.localStorageItem(CommonUtil.filtersKeyByView(view));
    return !!payload?.assignedToMe?.length;
  };

  const getTaskCount = async (payload) => {
    try {
      const data = await AxiosRequests.taskCount(apiClient, payload);
      if (!isMounted.current) return null;
      setTaskCountsByStatus(data);
    } catch (e) {
      if (!isMounted.current) return null;
      setError(e.message);
      setTaskCountsByStatus(undefined);
    }
  };

  const getAppliedFilters = () => {
    const taskStatusKey = CommonUtil.taskStatusKeyByView(view);
    const filterKey = CommonUtil.filtersKeyByView(view);
    const taskStatus = StorageUtil.localStorageTaskStatus(taskStatusKey);
    const storedData = StorageUtil.localStorageItem(filterKey);

    const commonParams = () => {
      return {
        taskStatuses: [TAB_STATUS_MAPPING[taskStatus]],
        ruleIds: storedData.ruleIds,
        searchText: storedData.searchText,
        assignees: ((taskStatus === TASK_STATUS.IN_PROGRESS) && hasAssignee()) ? [currentUser] : [],
      };
    };

    if (view === VIEW.AIRPAX) {
      if (storedData) {
        const movementModes = DEFAULT_MOVEMENT_AIRPAX_MODE.map((mode) => ({
          movementModes: mode.movementModes,
          selectors: storedData.selectors,
          ...commonParams(),
        }));
        const selectors = DEFAULT_AIRPAX_SELECTORS.map((selector) => ({
          movementModes: [storedData.mode] || [],
          selectors: selector.selectors,
          ...commonParams(),
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
    }
    if (view === VIEW.RORO) {
      if (storedData) {
        const movementModes = DEFAULT_MOVEMENT_RORO_MODES_V2.map((mode) => ({
          movementModes: mode.movementModes,
          selectors: storedData.selectors,
          ...commonParams(),
        }));
        const selectors = DEFAULT_RORO_SELECTORS_V2.map((selector) => ({
          movementModes: storedData.movementModes || [],
          selectors: selector.selectors,
          ...commonParams(),
        }));
        return movementModes.concat(selectors);
      }
      return [
        ...DEFAULT_MOVEMENT_RORO_MODES_V2.map((mode) => ({
          ...mode,
          taskStatuses: [TAB_STATUS_MAPPING[taskStatus]],
        })),
        ...DEFAULT_RORO_SELECTORS_V2.map((selector) => {
          return {
            ...selector,
            taskStatuses: [TAB_STATUS_MAPPING[taskStatus]],
          };
        }),
      ];
    }
  };

  const getRulesOptions = async () => {
    try {
      const data = await AxiosRequests.getRules(apiClient);
      if (!isMounted.current) return null;
      setRulesOptions(data);
    } catch (e) {
      if (!isMounted.current) return null;
      setError(e.message);
      setRulesOptions([]);
    }
  };

  const getFiltersAndSelectorsCount = async (taskStatus = TASK_STATUS.NEW) => {
    CommonUtil.setTaskStatusByView(view, taskStatus);
    try {
      const data = await AxiosRequests.filtersCount(apiClient, getAppliedFilters());
      if (!isMounted.current) return null;
      setFiltersAndSelectorsCount(data);
    } catch (e) {
      if (!isMounted.current) return null;
      setError(e.message);
      setFiltersAndSelectorsCount(undefined);
    }
  };

  const handleAssignedToMeFilter = async (tabId) => {
    const filtersToApply = tabId !== TASK_STATUS.IN_PROGRESS ? {
      ...appliedFilters,
      assignees: [],
    } : {
      ...appliedFilters,
      assignees: ((tabId === TASK_STATUS.IN_PROGRESS) && hasAssignee()) ? [currentUser] : [],
    };
    setAppliedFilters(filtersToApply);
    await getTaskCount(filtersToApply);
  };

  const applyFilters = async (payload) => {
    const taskStatusKey = CommonUtil.taskStatusKeyByView(view);
    payload = {
      ...payload,
      ...(view === VIEW.AIRPAX && {
        movementModes: payload?.mode ? [payload.mode] : [],
      }),
      ...((view === VIEW.RORO) && {
        movementModes: payload?.mode.length ? payload.mode : payload.movementModes,
      }),
      ruleIds: payload?.rules ? payload.rules.map((rule) => rule.id).filter((id) => typeof id === 'number') : [],
      searchText: payload?.searchText ? payload.searchText.toUpperCase().trim() : null,
      assignees: StorageUtil.localStorageTaskStatus(taskStatusKey) === TASK_STATUS.IN_PROGRESS ? payload?.assignedToMe : [],
    };
    if (view === VIEW.RORO) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.RORO_FILTERS, JSON.stringify(payload));
    }
    if (view === VIEW.AIRPAX) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.AIRPAX_FILTERS, JSON.stringify(payload));
    }
    setAppliedFilters(payload);
    await getTaskCount(payload);
    await getFiltersAndSelectorsCount(StorageUtil.localStorageTaskStatus(taskStatusKey));
  };

  const handleFilterReset = async (e) => {
    e.preventDefault();
    const defaultFilters = (view !== VIEW.RORO)
      ? DEFAULT_APPLIED_AIRPAX_FILTER_STATE : DEFAULT_APPLIED_RORO_FILTER_STATE_V2;
    CommonUtil.removeFiltersByView(view);
    await getFiltersAndSelectorsCount(StorageUtil.localStorageTaskStatus(CommonUtil.taskStatusKeyByView(view)));
    setAppliedFilters(defaultFilters);
    await getTaskCount(defaultFilters);
  };

  const applySavedFiltersOnLoad = async () => {
    const taskStatusKey = CommonUtil.taskStatusKeyByView(view);
    let storedFilters;
    if (view === VIEW.RORO) {
      storedFilters = StorageUtil.localStorageItem(LOCAL_STORAGE_KEYS.RORO_FILTERS) || DEFAULT_APPLIED_RORO_FILTER_STATE_V2;
    }
    if (view === VIEW.AIRPAX) {
      storedFilters = StorageUtil.localStorageItem(LOCAL_STORAGE_KEYS.AIRPAX_FILTERS) || DEFAULT_APPLIED_AIRPAX_FILTER_STATE;
    }
    await applyFilters(storedFilters);
    await getFiltersAndSelectorsCount(StorageUtil.localStorageTaskStatus(taskStatusKey));
  };

  useEffect(() => {
    selectTabIndex(taskManagementTabIndex);
  }, []);

  useEffect(() => {
    CommonUtil.removeTaskStatusByView(view);
    const isTargeter = keycloak.tokenParsed.groups.indexOf(TARGETER_GROUP) > -1;
    if (!isTargeter) {
      setAuthorisedGroup(false);
    }
    if (isTargeter) {
      setAuthorisedGroup(true);
      applySavedFiltersOnLoad();
    }
    return () => {
      AxiosRequests.cancel(source);
    };
  }, []);

  useEffect(() => {
    if (view === VIEW.AIRPAX) {
      getRulesOptions();
    }
    return () => {
      AxiosRequests.cancel(source);
    };
  }, []);

  return (
    <>
      <Header
        view={view}
        selectTabIndex={selectTabIndex}
        selectTaskManagementTabIndex={selectTaskManagementTabIndex}
      />
      {!authorisedGroup && <p>You are not authorised to view these tasks.</p>}
      {error && (
        <ErrorSummary
          title="There is a problem"
          errorList={[{ children: error }]}
        />
      )}
      {authorisedGroup && (
        <div className="govuk-grid-row">
          <section className="govuk-grid-column-one-quarter sticky">
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
                  view={view}
                  taskStatus={StorageUtil.localStorageTaskStatus(CommonUtil.taskStatusKeyByView(view))}
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
                handleAssignedToMeFilter(e.id);
                getFiltersAndSelectorsCount(e.id);
              }}
              items={[
                {
                  id: TASK_STATUS.NEW,
                  label: `New (${taskCountsByStatus?.new || 0})`,
                  panel: (
                    <>
                      <h2 className="govuk-heading-l">New tasks</h2>
                      <TasksTab
                        taskStatus={TASK_STATUS.NEW}
                        filtersToApply={appliedFilters}
                        setError={setError}
                        targetTaskCount={taskCountsByStatus?.new}
                      />
                    </>
                  ),
                },
                {
                  id: TASK_STATUS.IN_PROGRESS,
                  label: `In progress (${taskCountsByStatus?.inProgress || 0})`,
                  panel: (
                    <>
                      <h2 className="govuk-heading-l">In progress tasks</h2>
                      <TasksTab
                        taskStatus={TASK_STATUS.IN_PROGRESS}
                        filtersToApply={appliedFilters}
                        setError={setError}
                        targetTaskCount={taskCountsByStatus?.inProgress}
                      />
                    </>
                  ),
                },
                {
                  id: TASK_STATUS.ISSUED,
                  label: `Issued (${taskCountsByStatus?.issued || 0})`,
                  panel: (
                    <>
                      <h2 className="govuk-heading-l">Target issued tasks</h2>
                      <TasksTab
                        taskStatus={TASK_STATUS.ISSUED}
                        filtersToApply={appliedFilters}
                        setError={setError}
                        targetTaskCount={taskCountsByStatus?.issued}
                      />
                    </>
                  ),
                },
                {
                  id: TASK_STATUS.COMPLETE,
                  label: `Complete (${taskCountsByStatus?.complete || 0})`,
                  panel: (
                    <>
                      <h2 className="govuk-heading-l">Completed tasks</h2>
                      <TasksTab
                        taskStatus={TASK_STATUS.COMPLETE}
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
      )}
    </>
  );
};

export default TaskListPage;
