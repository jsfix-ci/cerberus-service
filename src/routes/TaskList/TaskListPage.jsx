import React, { useEffect, useState, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useIsMounted } from '../../utils/Hooks/hooks';

import { LOCAL_STORAGE_KEYS,
  TAB_STATUS_MAPPING,
  TARGETER_GROUP,
  TASK_STATUS } from '../../utils/constants';

import DEFAULTS from './constants';

// Utils
import { CommonUtil, StorageUtil } from '../../utils';
import { useKeycloak } from '../../context/Keycloak';
import { useAxiosInstance } from '../../utils/Axios/axiosInstance';

// Config
import config from '../../utils/config';

// Components/Pages
import ErrorSummary from '../../components/ErrorSummary/ErrorSummary';
import Tabs from '../../components/Tabs/Tabs';
import TaskManagementHeader from '../../components/Headers/TaskManagementHeader';

// Context
import { TaskSelectedTabContext } from '../../context/TaskSelectedTabContext';
import { ViewContext } from '../../context/ViewContext';
import { PnrAccessContext } from '../../context/PnrAccessContext';

// Services
import AxiosRequests from '../../api/axiosRequests';

// Styling
import './components/shared/TaskListPage.scss';
import TasksTab from './components/shared/TasksTab';
import getFilter from '../../components/Filter/Custom/getFilter';

const TaskListPage = () => {
  const keycloak = useKeycloak();
  const history = useHistory();
  const location = useLocation();
  const isMounted = useIsMounted();
  const apiClient = useAxiosInstance(keycloak, config.taskApiUrl);
  const currentUser = keycloak.tokenParsed.email;
  const source = axios.CancelToken.source();
  const [authorisedGroup, setAuthorisedGroup] = useState();
  const [error, setError] = useState(null);
  const [taskCountsByStatus, setTaskCountsByStatus] = useState();
  const [filtersAndSelectorsCount, setFiltersAndSelectorsCount] = useState();
  const [appliedFilters, setAppliedFilters] = useState();
  const [rulesOptions, setRulesOptions] = useState([]);
  const { taskManagementTabIndex, selectTaskManagementTabIndex } = useContext(TaskSelectedTabContext);
  const { setView, getView } = useContext(ViewContext);
  const { canViewPnrData } = useContext(PnrAccessContext);

  const adaptMovementDirection = (payload) => {
    if (payload?.movementDirection?.length <= 1) {
      return payload.movementDirection;
    }
    return payload.movementDirection.filter((direction) => direction !== 'ANY');
  };

  const adaptMovementModes = (payload) => {
    if (typeof payload?.mode === 'string') {
      return [payload.mode];
    }
    if (Array.isArray(payload?.mode)) {
      return payload?.mode?.length ? payload?.mode : payload?.movementModes;
    }
  };

  const getTaskCount = async (payload) => {
    if (canViewPnrData) {
      try {
        const data = await AxiosRequests.taskCount(apiClient, payload);
        if (!isMounted.current) return null;
        setTaskCountsByStatus(data);
      } catch (e) {
        if (!isMounted.current) return null;
        setError(e.message);
        setTaskCountsByStatus(undefined);
      }
    } else {
      setTaskCountsByStatus(undefined);
    }
  };

  // Used for already applied filters
  const getAppliedFilters = () => {
    const taskStatus = StorageUtil.getTaskStatus(LOCAL_STORAGE_KEYS.TASK_STATUS);
    const storedData = StorageUtil.getItem(DEFAULTS[getView()].filters.key);
    if (storedData) {
      const movementModes = DEFAULTS[getView()].filters.movementModes.map((mode) => ({
        taskStatuses: [TAB_STATUS_MAPPING[taskStatus]],
        movementModes: mode.movementModes,
        selectors: storedData.selectors,
        ruleIds: storedData.ruleIds,
        searchText: storedData.searchText,
        assignees: ((taskStatus === TASK_STATUS.IN_PROGRESS)
          && CommonUtil.hasAssignee(DEFAULTS[getView()].filters.key)) ? [currentUser] : [],
        movementDirection: adaptMovementDirection(storedData),
      }));
      const selectors = DEFAULTS[getView()].filters.selectors.map((selector) => ({
        taskStatuses: [TAB_STATUS_MAPPING[taskStatus]],
        movementModes: adaptMovementModes(storedData),
        selectors: selector.selectors,
        ruleIds: storedData.ruleIds,
        searchText: storedData.searchText,
        assignees: ((taskStatus === TASK_STATUS.IN_PROGRESS)
          && CommonUtil.hasAssignee(DEFAULTS[getView()].filters.key)) ? [currentUser] : [],
        movementDirection: adaptMovementDirection(storedData),
      }));
      return movementModes.concat(selectors);
    }
    return [
      ...DEFAULTS[getView()].filters.movementModes.map((mode) => ({
        ...mode,
        taskStatuses: [TAB_STATUS_MAPPING[taskStatus]],
      })),
      ...DEFAULTS[getView()].filters.selectors.map((selector) => {
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
    localStorage.setItem(LOCAL_STORAGE_KEYS.TASK_STATUS, taskStatus);
    if (canViewPnrData) {
      try {
        const data = await AxiosRequests.filtersCount(apiClient, getAppliedFilters());
        if (!isMounted.current) return null;
        setFiltersAndSelectorsCount(data);
      } catch (e) {
        if (!isMounted.current) return null;
        setError(e.message);
        setFiltersAndSelectorsCount(undefined);
      }
    } else {
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
        && CommonUtil.hasAssignee(DEFAULTS[getView()].filters.key)) ? [currentUser] : [],
    };
    setAppliedFilters(filtersToApply);
    await getTaskCount(filtersToApply);
  };

  // Used for when filters are applied via the filter component
  const applyFilters = async (payload) => {
    payload = {
      ...payload,
      movementModes: adaptMovementModes(payload),
      ruleIds: payload?.rules ? payload.rules.map((rule) => rule.id).filter((id) => typeof id === 'number') : [],
      searchText: payload?.searchText ? payload.searchText.toUpperCase().trim() : null,
      assignees: StorageUtil.getTaskStatus(LOCAL_STORAGE_KEYS.TASK_STATUS) === TASK_STATUS.IN_PROGRESS
        ? payload?.assignedToMe : [],
      movementDirection: adaptMovementDirection(payload),
    };
    localStorage.setItem(DEFAULTS[getView()].filters.key, JSON.stringify(payload));
    setAppliedFilters(payload);
    await getTaskCount(payload);
    await getFiltersAndSelectorsCount(StorageUtil.getTaskStatus(LOCAL_STORAGE_KEYS.TASK_STATUS));
  };

  const handleFilterReset = async (e) => {
    e.preventDefault();
    localStorage.removeItem(DEFAULTS[getView()].filters.key);
    await getFiltersAndSelectorsCount(StorageUtil.getTaskStatus(LOCAL_STORAGE_KEYS.TASK_STATUS));
    setAppliedFilters(DEFAULTS[getView()].filters.default);
    await getTaskCount(DEFAULTS[getView()].filters.default);
  };

  const applySavedFiltersOnLoad = async () => {
    const storedFilters = StorageUtil.getItem(DEFAULTS[getView()].filters.key) || DEFAULTS[getView()].filters.default;
    await applyFilters(storedFilters);
    await getFiltersAndSelectorsCount(StorageUtil.getTaskStatus(LOCAL_STORAGE_KEYS.TASK_STATUS));
  };

  useEffect(() => {
    setView(CommonUtil.viewByPath(location.pathname));
  }, []);

  useEffect(() => {
    if (!canViewPnrData) {
      setFiltersAndSelectorsCount(undefined);
      setTaskCountsByStatus(undefined);
    }
  }, [canViewPnrData]);

  useEffect(() => {
    if (getView() && !appliedFilters) {
      setAppliedFilters(DEFAULTS[getView()].filters.default);
    }
  }, [getView()]);

  useEffect(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.TASK_STATUS);
    CommonUtil.setStatus(taskManagementTabIndex);
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

  if (!getView()) {
    return null;
  }

  return (
    <>
      <TaskManagementHeader
        headerText={DEFAULTS[getView()].headers.title}
        links={DEFAULTS[getView()].headers.links}
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
          <section className="govuk-grid-column-one-quarter">
            {getFilter(
              getView(),
              currentUser,
              StorageUtil.getTaskStatus(LOCAL_STORAGE_KEYS.TASK_STATUS),
              appliedFilters,
              filtersAndSelectorsCount,
              {
                rules: rulesOptions,
              },
              applyFilters,
              handleFilterReset,
            )}
          </section>
          <section className="govuk-grid-column-three-quarters">
            <Tabs
              title="Title"
              id="tasks"
              onTabClick={async (e) => {
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
                        sortParams={DEFAULTS[getView()].sortParams}
                        setError={setError}
                        targetTaskCount={taskCountsByStatus?.new}
                        redirectPath={DEFAULTS[getView()].redirectPath}
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
                        sortParams={DEFAULTS[getView()].sortParams}
                        setError={setError}
                        targetTaskCount={taskCountsByStatus?.inProgress}
                        redirectPath={DEFAULTS[getView()].redirectPath}
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
                        sortParams={DEFAULTS[getView()].sortParams}
                        setError={setError}
                        targetTaskCount={taskCountsByStatus?.issued}
                        redirectPath={DEFAULTS[getView()].redirectPath}
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
                        sortParams={DEFAULTS[getView()].sortParams}
                        setError={setError}
                        targetTaskCount={taskCountsByStatus?.complete}
                        redirectPath={DEFAULTS[getView()].redirectPath}
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
