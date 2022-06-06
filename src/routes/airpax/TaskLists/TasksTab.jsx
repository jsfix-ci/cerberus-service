/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';

import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import qs from 'qs';
import useAxiosInstance from '../../../utils/axiosInstance';
import { useKeycloak } from '../../../utils/keycloak';

// Config
import config from '../../../config';
import { formatTaskStatusToCamelCase, formatTaskStatusToSnakeCase } from '../../../utils/formatTaskStatus';

// Components/Pages
import LoadingSpinner from '../../../components/LoadingSpinner';
import Pagination from '../../../components/Pagination';
import TaskListCard from './TaskListCard';

const TasksTab = ({
  taskStatus,
  filtersToApply = { taskStatuses: [], movementModes: ['AIR_PASSENGER'], selectors: 'ANY' },
  setError,
  targetTaskCount = 0,
}) => {
  dayjs.extend(relativeTime);
  dayjs.extend(utc);
  const keycloak = useKeycloak();
  const currentUser = keycloak.tokenParsed.email;

  const apiClient = useAxiosInstance(keycloak, config.taskApiUrl);
  const refDataClient = useAxiosInstance(keycloak, config.refdataApiUrl);
  const source = axios.CancelToken.source();

  const [activePage, setActivePage] = useState(0);
  const [targetTasks, setTargetTasks] = useState([]);
  const [refDataAirlineCodes, setRefDataAirlineCodes] = useState([]);

  const [isLoading, setLoading] = useState(true);
  const [refreshTaskList, setRefreshTaskList] = useState(false);

  // PAGINATION SETTINGS
  const index = activePage - 1;
  const itemsPerPage = 100;
  const offset = index * itemsPerPage < 0 ? 0 : index * itemsPerPage;
  const totalPages = Math.ceil(targetTaskCount / itemsPerPage);

  const getTaskList = async () => {
    setLoading(true);
    let response;
    const tab = formatTaskStatusToSnakeCase(taskStatus);
    const sortParams = [
      {
        field: 'WINDOW_OF_OPPORTUNITY',
        order: 'ASC',
      },
      {
        field: 'BOOKING_LEAD_TIME',
        order: 'ASC',
      },
    ];
    const postParams = {
      filterParams: {
        ...filtersToApply,
        taskStatuses: [tab],
        movementModes: filtersToApply?.movementModes || [filtersToApply.mode],
      },
      sortParams,
      pageParams: {
        limit: itemsPerPage,
        offset,
      },
    };
    try {
      response = await apiClient.post('/targeting-tasks/pages', postParams);
      setTargetTasks(response.data);
    } catch (e) {
      setError(e.message);
      setTargetTasks([]);
    } finally {
      setLoading(false);
      setRefreshTaskList(false);
    }
  };

  const getAirlineCodes = async () => {
    let response;
    try {
      response = await refDataClient.get('/v2/entities/carrierlist', {
        params: {
          mode: 'dataOnly',
        },
      });
      setRefDataAirlineCodes(response.data.data);
    } catch (e) {
      setRefDataAirlineCodes([]);
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

  useEffect(() => {
    getAirlineCodes();
    return () => {
      source.cancel('Cancelling request');
    };
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (targetTasks.length === 0) {
    return <p className="govuk-body-l">There are no {taskStatus} tasks</p>;
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
            key={targetTask.id}
            targetTask={targetTask}
            taskStatus={formatTaskStatusToCamelCase(targetTask.status)}
            airlineCodes={refDataAirlineCodes}
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
