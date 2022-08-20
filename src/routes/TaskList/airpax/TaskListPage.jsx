import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import useIsMounted from '../../../utils/Hooks/hooks';

import {
  LOCAL_STORAGE_KEYS,
  STRINGS,
  TARGETER_GROUP,
  TAB_STATUS_MAPPING,
  TASK_LIST_PATHS,
  TASK_STATUS,
  SORT_ORDER,
  MOVEMENT_MODES,
} from '../../../utils/constants';

// Utils
import { CommonUtil, StorageUtil } from '../../../utils';
import { useKeycloak } from '../../../context/Keycloak';
import { useAxiosInstance } from '../../../utils/Axios/axiosInstance';

// Config
import config from '../../../utils/config';

// Components/Pages
import ErrorSummary from '../../../components/ErrorSummary/ErrorSummary';
import Filter from '../../../components/Filter/Custom/Filter';
import Tabs from '../../../components/Tabs/Tabs';
import TasksTab from '../TasksTab';
import TaskManagementHeader from '../../../components/Headers/TaskManagementHeader';

// Context
import { TaskSelectedTabContext } from '../../../context/TaskSelectedTabContext';

// Services
import AxiosRequests from '../../../api/axiosRequests';

// Forms
import { airpax } from '../../../forms/filters';

// Styling
import '../__assets__/TaskListPage.scss';

export const DEFAULT_APPLIED_AIRPAX_FILTER_STATE = {
  movementModes: [MOVEMENT_MODES.AIR_PASSENGER],
  mode: MOVEMENT_MODES.AIR_PASSENGER,
  selectors: 'ANY',
  rules: [],
  searchText: '',
  assignees: [],
  assignedToMe: [],
};

export const DEFAULT_MOVEMENT_AIRPAX_MODE = [
  {
    taskStatuses: [],
    movementModes: [MOVEMENT_MODES.AIR_PASSENGER],
    selectors: 'ANY',
    ruleIds: [],
    searchText: '',
    assignees: [],
  },
];

export const DEFAULT_AIRPAX_SELECTORS = [
  {
    taskStatuses: [],
    movementModes: [MOVEMENT_MODES.AIR_PASSENGER],
    selectors: 'PRESENT',
    ruleIds: [],
    searchText: '',
    assignees: [],
  },
  {
    taskStatuses: [],
    movementModes: [MOVEMENT_MODES.AIR_PASSENGER],
    selectors: 'NOT_PRESENT',
    ruleIds: [],
    searchText: '',
    assignees: [],
  },
  {
    taskStatuses: [],
    movementModes: [MOVEMENT_MODES.AIR_PASSENGER],
    selectors: 'ANY',
    ruleIds: [],
    searchText: '',
    assignees: [],
  },
];

const TaskListPage = () => {
  const keycloak = useKeycloak();
  const history = useHistory();
  const isMounted = useIsMounted();
  const apiClient = useAxiosInstance(keycloak, config.taskApiUrl);
  const currentUser = keycloak.tokenParsed.email;
  const source = axios.CancelToken.source();
  const [authorisedGroup, setAuthorisedGroup] = useState();
  const [error, setError] = useState(null);
  const [taskCountsByStatus, setTaskCountsByStatus] = useState();
  const [filtersAndSelectorsCount, setFiltersAndSelectorsCount] = useState();
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_APPLIED_AIRPAX_FILTER_STATE);
  const [rulesOptions, setRulesOptions] = useState([]);
  const { taskManagementTabIndex, selectTaskManagementTabIndex, selectTabIndex } = useContext(TaskSelectedTabContext);
  const sortParams = [
    {
      field: 'WINDOW_OF_OPPORTUNITY',
      order: SORT_ORDER.ASC,
    },
    {
      field: 'BOOKING_LEAD_TIME',
      order: SORT_ORDER.ASC,
    },
  ];

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
    const taskStatus = StorageUtil.getTaskStatus(LOCAL_STORAGE_KEYS.AIRPAX_TASK_STATUS);
    const storedData = StorageUtil.getItem(LOCAL_STORAGE_KEYS.AIRPAX_FILTERS);
    if (storedData) {
      const movementModes = DEFAULT_MOVEMENT_AIRPAX_MODE.map((mode) => ({
        taskStatuses: [TAB_STATUS_MAPPING[taskStatus]],
        movementModes: mode.movementModes,
        selectors: storedData.selectors,
        ruleIds: storedData.ruleIds,
        searchText: storedData.searchText,
        assignees: ((taskStatus === TASK_STATUS.IN_PROGRESS)
          && CommonUtil.hasAssignee(LOCAL_STORAGE_KEYS.AIRPAX_FILTERS)) ? [currentUser] : [],
      }));
      const selectors = DEFAULT_AIRPAX_SELECTORS.map((selector) => ({
        taskStatuses: [TAB_STATUS_MAPPING[taskStatus]],
        movementModes: [storedData.mode] || [],
        selectors: selector.selectors,
        ruleIds: storedData.ruleIds,
        searchText: storedData.searchText,
        assignees: ((taskStatus === TASK_STATUS.IN_PROGRESS)
          && CommonUtil.hasAssignee(LOCAL_STORAGE_KEYS.AIRPAX_FILTERS)) ? [currentUser] : [],
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
    localStorage.setItem(LOCAL_STORAGE_KEYS.AIRPAX_TASK_STATUS, taskStatus);
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
      assignees: ((tabId === TASK_STATUS.IN_PROGRESS)
        && CommonUtil.hasAssignee(LOCAL_STORAGE_KEYS.AIRPAX_FILTERS)) ? [currentUser] : [],
    };
    setAppliedFilters(filtersToApply);
    await getTaskCount(filtersToApply);
  };

  const applyFilters = async (payload) => {
    payload = {
      ...payload,
      movementModes: payload?.mode ? [payload.mode] : [],
      ruleIds: payload?.rules ? payload.rules.map((rule) => rule.id).filter((id) => typeof id === 'number') : [],
      searchText: payload?.searchText ? payload.searchText.toUpperCase().trim() : null,
      assignees: StorageUtil.getTaskStatus(LOCAL_STORAGE_KEYS.AIRPAX_TASK_STATUS) === TASK_STATUS.IN_PROGRESS
        ? payload?.assignedToMe : [],
    };
    localStorage.setItem(LOCAL_STORAGE_KEYS.AIRPAX_FILTERS, JSON.stringify(payload));
    setAppliedFilters(payload);
    await getTaskCount(payload);
    await getFiltersAndSelectorsCount(StorageUtil.getTaskStatus(LOCAL_STORAGE_KEYS.AIRPAX_TASK_STATUS));
  };

  const handleFilterReset = async (e) => {
    e.preventDefault();
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AIRPAX_FILTERS);
    await getFiltersAndSelectorsCount(StorageUtil.getTaskStatus(LOCAL_STORAGE_KEYS.AIRPAX_TASK_STATUS));
    setAppliedFilters(DEFAULT_APPLIED_AIRPAX_FILTER_STATE);
    await getTaskCount(DEFAULT_APPLIED_AIRPAX_FILTER_STATE);
  };

  const applySavedFiltersOnLoad = async () => {
    const storedFilters = StorageUtil.getItem(LOCAL_STORAGE_KEYS.AIRPAX_FILTERS)
      || DEFAULT_APPLIED_AIRPAX_FILTER_STATE;
    await applyFilters(storedFilters);
    await getFiltersAndSelectorsCount(StorageUtil.getTaskStatus(LOCAL_STORAGE_KEYS.AIRPAX_TASK_STATUS));
  };

  useEffect(() => {
    selectTabIndex(taskManagementTabIndex);
  }, []);

  useEffect(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AIRPAX_TASK_STATUS);
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
    getRulesOptions();
    return () => {
      AxiosRequests.cancel(source);
    };
  }, []);

  return (
    <>
      <TaskManagementHeader
        headerText={STRINGS.TASK_MANAGEMENT_INLINE_HEADERS.AIRPAX}
        links={[
          {
            url: TASK_LIST_PATHS.RORO,
            label: STRINGS.TASK_LINK_HEADERS.RORO_V1,
            show: true,
          },
          {
            url: TASK_LIST_PATHS.RORO_V2,
            label: STRINGS.TASK_LINK_HEADERS.RORO_V2,
            show: config.roroV2ViewEnabled,
          },
        ]}
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
            <Filter
              filter={airpax}
              taskStatus={StorageUtil.getTaskStatus(LOCAL_STORAGE_KEYS.AIRPAX_TASK_STATUS)}
              currentUser={currentUser}
              data={appliedFilters}
              filtersAndSelectorsCount={{
                movementModeCounts: filtersAndSelectorsCount?.slice(0, 1),
                modeSelectorCounts: filtersAndSelectorsCount?.slice(1),
              }}
              customOptions={{ rulesOptions }}
              onApply={applyFilters}
              handleFilterReset={handleFilterReset}
            />
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
                        sortParams={sortParams}
                        setError={setError}
                        targetTaskCount={taskCountsByStatus?.new}
                        redirectPath={TASK_LIST_PATHS.AIRPAX}
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
                        sortParams={sortParams}
                        setError={setError}
                        targetTaskCount={taskCountsByStatus?.inProgress}
                        redirectPath={TASK_LIST_PATHS.AIRPAX}
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
                        sortParams={sortParams}
                        setError={setError}
                        targetTaskCount={taskCountsByStatus?.issued}
                        redirectPath={TASK_LIST_PATHS.AIRPAX}
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
                        sortParams={sortParams}
                        setError={setError}
                        targetTaskCount={taskCountsByStatus?.complete}
                        redirectPath={TASK_LIST_PATHS.AIRPAX}
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
