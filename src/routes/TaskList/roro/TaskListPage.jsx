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
  MODE,
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
import Filter from '../../../components/Filter/Filter';
import Tabs from '../../../components/Tabs/Tabs';
import TaskManagementHeader from '../../../components/Headers/TaskManagementHeader';

// Context
import { TaskSelectedTabContext } from '../../../context/TaskSelectedTabContext';

// Services
import AxiosRequests from '../../../api/axiosRequests';

// Styling
import '../__assets__/TaskListPage.scss';
import TasksTab from '../TasksTab';

// RoRo V2
export const DEFAULT_APPLIED_RORO_FILTER_STATE_V2 = {
  movementModes: [MOVEMENT_MODES.ACCOMPANIED_FREIGHT, MOVEMENT_MODES.UNACCOMPANIED_FREIGHT, MOVEMENT_MODES.TOURIST],
  mode: [],
  selectors: 'ANY',
  ruleIds: [],
  searchText: '',
  assignees: [],
  assignedToMe: [],
};

// RoRo V2
export const DEFAULT_MOVEMENT_RORO_MODES_V2 = [
  {
    taskStatuses: [],
    movementModes: [MOVEMENT_MODES.UNACCOMPANIED_FREIGHT],
    selectors: 'ANY',
    ruleIds: [],
    searchText: '',
    assignees: [],
  },
  {
    taskStatuses: [],
    movementModes: [MOVEMENT_MODES.ACCOMPANIED_FREIGHT],
    selectors: 'ANY',
    ruleIds: [],
    searchText: '',
    assignees: [],
  },
  {
    taskStatuses: [],
    movementModes: [MOVEMENT_MODES.TOURIST],
    selectors: 'ANY',
    ruleIds: [],
    searchText: '',
    assignees: [],
  },
];

// RoRo V2
export const DEFAULT_RORO_SELECTORS_V2 = [
  {
    taskStatuses: [],
    movementModes: [MOVEMENT_MODES.ACCOMPANIED_FREIGHT, MOVEMENT_MODES.UNACCOMPANIED_FREIGHT, MOVEMENT_MODES.TOURIST],
    selectors: 'PRESENT',
    ruleIds: [],
    searchText: '',
    assignees: [],
  },
  {
    taskStatuses: [],
    movementModes: [MOVEMENT_MODES.ACCOMPANIED_FREIGHT, MOVEMENT_MODES.UNACCOMPANIED_FREIGHT, MOVEMENT_MODES.TOURIST],
    selectors: 'NOT_PRESENT',
    ruleIds: [],
    searchText: '',
    assignees: [],
  },
  {
    taskStatuses: [],
    movementModes: [MOVEMENT_MODES.ACCOMPANIED_FREIGHT, MOVEMENT_MODES.UNACCOMPANIED_FREIGHT, MOVEMENT_MODES.TOURIST],
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
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_APPLIED_RORO_FILTER_STATE_V2);
  const { taskManagementTabIndex, selectTaskManagementTabIndex, selectTabIndex } = useContext(TaskSelectedTabContext);
  const sortParams = [
    {
      field: 'ARRIVAL_TIME',
      order: SORT_ORDER.ASC,
    },
    {
      field: 'THREAT_LEVEL',
      order: SORT_ORDER.DESC,
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
    const taskStatus = StorageUtil.getTaskStatus(LOCAL_STORAGE_KEYS.RORO_TASK_STATUS);
    const storedData = StorageUtil.getItem(LOCAL_STORAGE_KEYS.RORO_FILTERS);
    if (storedData) {
      const movementModes = DEFAULT_MOVEMENT_RORO_MODES_V2.map((mode) => ({
        movementModes: mode.movementModes,
        selectors: storedData.selectors,
        taskStatuses: [TAB_STATUS_MAPPING[taskStatus]],
        ruleIds: storedData.ruleIds,
        searchText: storedData.searchText,
        assignees: ((taskStatus === TASK_STATUS.IN_PROGRESS)
          && CommonUtil.hasAssignee(LOCAL_STORAGE_KEYS.RORO_FILTERS)) ? [currentUser] : [],
      }));
      const selectors = DEFAULT_RORO_SELECTORS_V2.map((selector) => ({
        movementModes: storedData.movementModes || [],
        selectors: selector.selectors,
        taskStatuses: [TAB_STATUS_MAPPING[taskStatus]],
        ruleIds: storedData.ruleIds,
        searchText: storedData.searchText,
        assignees: ((taskStatus === TASK_STATUS.IN_PROGRESS)
          && CommonUtil.hasAssignee(LOCAL_STORAGE_KEYS.RORO_FILTERS)) ? [currentUser] : [],
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
  };

  const getFiltersAndSelectorsCount = async (taskStatus = TASK_STATUS.NEW) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.RORO_TASK_STATUS, taskStatus);
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
        && CommonUtil.hasAssignee(LOCAL_STORAGE_KEYS.RORO_FILTERS)) ? [currentUser] : [],
    };
    setAppliedFilters(filtersToApply);
    await getTaskCount(filtersToApply);
  };

  const applyFilters = async (payload) => {
    payload = {
      ...payload,
      movementModes: payload?.mode.length ? payload.mode : payload.movementModes,
      ruleIds: payload?.rules ? payload.rules.map((rule) => rule.id).filter((id) => typeof id === 'number') : [],
      searchText: payload?.searchText ? payload.searchText.toUpperCase().trim() : null,
      assignees: StorageUtil.getTaskStatus(LOCAL_STORAGE_KEYS.RORO_TASK_STATUS) === TASK_STATUS.IN_PROGRESS
        ? payload?.assignedToMe : [],
    };
    localStorage.setItem(LOCAL_STORAGE_KEYS.RORO_FILTERS, JSON.stringify(payload));
    setAppliedFilters(payload);
    await getTaskCount(payload);
    await getFiltersAndSelectorsCount(StorageUtil.getTaskStatus(LOCAL_STORAGE_KEYS.RORO_TASK_STATUS));
  };

  const handleFilterReset = async (e) => {
    e.preventDefault();
    localStorage.removeItem(LOCAL_STORAGE_KEYS.RORO_FILTERS);
    await getFiltersAndSelectorsCount(StorageUtil.getTaskStatus(LOCAL_STORAGE_KEYS.RORO_TASK_STATUS));
    setAppliedFilters(DEFAULT_APPLIED_RORO_FILTER_STATE_V2);
    await getTaskCount(DEFAULT_APPLIED_RORO_FILTER_STATE_V2);
  };

  const applySavedFiltersOnLoad = async () => {
    const storedFilters = StorageUtil.getItem(LOCAL_STORAGE_KEYS.RORO_FILTERS) || DEFAULT_APPLIED_RORO_FILTER_STATE_V2;
    await applyFilters(storedFilters);
    await getFiltersAndSelectorsCount(StorageUtil.getTaskStatus(LOCAL_STORAGE_KEYS.RORO_TASK_STATUS));
  };

  useEffect(() => {
    selectTabIndex(taskManagementTabIndex);
  }, []);

  useEffect(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.RORO_TASK_STATUS);
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

  return (
    <>
      <TaskManagementHeader
        headerText={STRINGS.TASK_MANAGEMENT_INLINE_HEADERS.RORO_V2}
        links={[
          {
            url: TASK_LIST_PATHS.RORO,
            label: STRINGS.TASK_LINK_HEADERS.RORO_V1,
            show: true,
          },
          {
            url: TASK_LIST_PATHS.AIRPAX,
            label: STRINGS.TASK_LINK_HEADERS.AIRPAX,
            show: config.copTargetingApiEnabled,
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
              mode={MODE.RORO}
              taskStatus={StorageUtil.getTaskStatus(LOCAL_STORAGE_KEYS.RORO_TASK_STATUS)}
              currentUser={currentUser}
              onApply={applyFilters}
              appliedFilters={appliedFilters}
              filtersAndSelectorsCount={filtersAndSelectorsCount}
              handleFilterReset={(e) => handleFilterReset(e)}
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
                        redirectPath={TASK_LIST_PATHS.RORO_V2}
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
                        redirectPath={TASK_LIST_PATHS.RORO_V2}
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
                        redirectPath={TASK_LIST_PATHS.RORO_V2}
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
                        redirectPath={TASK_LIST_PATHS.RORO_V2}
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
