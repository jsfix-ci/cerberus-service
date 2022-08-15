/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import { Button } from '@ukhomeoffice/cop-react-components';
import { useInterval } from 'react-use';
import { useLocation } from 'react-router-dom';

import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import qs from 'qs';
import { useAxiosInstance } from '../../utils/Axios/axiosInstance';
import { useKeycloak } from '../../context/Keycloak';

// Config
import config from '../../utils/config';
import { CommonUtil, StringUtil } from '../../utils';

// Components/Pages
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import Pagination from '../../components/Pagination/Pagination';
import TaskListCard from './TaskListCard';
import { LOCAL_STORAGE_KEYS,
  STATUS_CODES,
  SORT_ORDER,
  TASK_STATUS,
  TASK_STATUS_MAPPING,
  VIEW } from '../../utils/constants';

// Context
import { PnrAccessContext } from '../../context/PnrAccessContext';

// Services
import AxiosRequests from '../../api/axiosRequests';

const TasksTab = ({
  taskStatus,
  filtersToApply,
  setError,
  targetTaskCount = 0,
}) => {
  dayjs.extend(utc);
  dayjs.extend(relativeTime);
  const keycloak = useKeycloak();
  const currentUser = keycloak.tokenParsed.email;
  const location = useLocation();
  const apiClient = useAxiosInstance(keycloak, config.taskApiUrl);
  const source = axios.CancelToken.source();
  const { canViewPnrData } = useContext(PnrAccessContext);
  const view = CommonUtil.setViewAndGet(location.pathname);
  const [activePage, setActivePage] = useState(0);
  const [targetTasks, setTargetTasks] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [refreshTaskList, setRefreshTaskList] = useState(false);

  // PAGINATION SETTINGS
  const index = activePage - 1;
  const itemsPerPage = 100;
  const offset = index * itemsPerPage < 0 ? 0 : index * itemsPerPage;
  const totalPages = Math.ceil(targetTaskCount / itemsPerPage);

  const startPnrAccessRequest = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.PNR_USER_SESSION_ID);
    window.location.reload();
  };

  const adaptPayloadByView = (_filtersToApply, tab, _taskStatus) => {
    return {
      filterParams: {
        ..._filtersToApply,
        taskStatuses: [tab],
        movementModes: _filtersToApply?.movementModes || _filtersToApply.mode,
      },
      ...(view === VIEW.AIRPAX && { sortParams: [
        {
          field: 'WINDOW_OF_OPPORTUNITY',
          order: SORT_ORDER.ASC,
        },
        {
          field: 'BOOKING_LEAD_TIME',
          order: SORT_ORDER.ASC,
        },
      ] }),
      ...((view === VIEW.RORO || view === VIEW.RORO_V2) && { sortParams: [
        {
          field: 'ARRIVAL_TIME',
          order: SORT_ORDER.ASC,
        },
        {
          field: 'THREAT_LEVEL',
          order: SORT_ORDER.DESC,
        },
      ] }),
      pageParams: {
        limit: itemsPerPage,
        offset,
      },
    };
  };

  const getTaskList = async () => {
    setLoading(true);
    const tab = StringUtil.format.snakeCase(taskStatus);
    const payload = adaptPayloadByView(filtersToApply, tab, taskStatus);
    try {
      const data = await AxiosRequests.getTasks(apiClient, payload);
      setTargetTasks(data);
      setError();
    } catch (e) {
      if (!e.message.endsWith(STATUS_CODES.FORBIDDEN)) {
        setError(e.message);
      }
      setTargetTasks([]);
    } finally {
      setLoading(false);
      setRefreshTaskList(false);
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
        AxiosRequests.cancel(source);
      };
    }
  }, [refreshTaskList]);

  useInterval(() => {
    getTaskList();
    return () => {
      AxiosRequests.cancel(source);
    };
  }, 180000);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!canViewPnrData && view === VIEW.AIRPAX) {
    const formattedStatus = TASK_STATUS_MAPPING[taskStatus];
    return (
      <>
        <p className="govuk-body-l govuk-!-margin-bottom-1">
          {`You do not have access to view ${formattedStatus} PNR data. 
          To view ${formattedStatus} PNR data, 
          you will need to request access.`}
        </p>
        <Button onClick={() => startPnrAccessRequest()}>
          {`Request access to ${formattedStatus} PNR data`}
        </Button>
      </>
    );
  }

  if (targetTasks.length === 0 && canViewPnrData) {
    return <p className="govuk-body-l">There are no {TASK_STATUS_MAPPING[taskStatus]} tasks</p>;
  }

  return (
    <>
      <Pagination
        totalItems={targetTaskCount}
        itemsPerPage={itemsPerPage}
        activePage={activePage}
        totalPages={totalPages}
      />

      {targetTasks.map((targetTask) => {
        return (
          <TaskListCard
            view={view}
            key={targetTask.id}
            targetTask={targetTask}
            taskStatus={StringUtil.format.camelCase(targetTask.status)}
            currentUser={currentUser}
          />
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

export default TasksTab;
