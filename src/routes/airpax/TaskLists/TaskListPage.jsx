/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';

import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';

import { TARGETER_GROUP,
  TASK_STATUS_COMPLETED,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_NEW,
  TASK_STATUS_TARGET_ISSUED } from '../../../constants';
import config from '../../../config';

import { useKeycloak } from '../../../utils/keycloak';
import useAxiosInstance from '../../../utils/axiosInstance';

// Components/Pages
import Tabs from '../../../components/Tabs';
import LoadingSpinner from '../../../components/LoadingSpinner';
import Pagination from '../../../components/Pagination';
import TaskListCard from '../../../components/TaskListPage/TaskListCard';

// Styling
import '../__assets__/TaskListPage.scss';

const TasksTab = ({ taskStatus, filtersToApply, setError, targetTaskCount = 0 }) => {
  dayjs.extend(relativeTime);
  dayjs.extend(utc);
  const keycloak = useKeycloak();
  const location = useLocation();

  const targetingTaskClient = useAxiosInstance(keycloak, config.targetingTaskApi);
  const source = axios.CancelToken.source();

  const [activePage, setActivePage] = useState(0);
  const [targetTasks, setTargetTasks] = useState([]);

  const [isLoading, setLoading] = useState(true);
  const [refreshTaskList, setRefreshTaskList] = useState(false);

  // PAGINATION SETTINGS
  const index = activePage - 1;
  const itemsPerPage = 100;
  const offset = index * itemsPerPage < 0 ? 0 : index * itemsPerPage;
  const totalPages = Math.ceil(targetTaskCount / itemsPerPage);

  // STATUS SETTINGS
  const currentUser = keycloak.tokenParsed.email;
  const activeTab = taskStatus;

  const getTaskList = async () => {
    setLoading(true);
    if (targetingTaskClient) {
      const tab = taskStatus === 'inProgress' ? 'IN_PROGRESS' : taskStatus.toUpperCase();
      const sortParams = taskStatus === 'new' || taskStatus === 'inProgress'
        ? [
          {
            field: 'ARRIVAL_TIME',
            order: 'ASC',
          },
          {
            field: 'THREAT_LEVEL',
            order: 'DESC',
          },
        ]
        : null;
      try {
        const tasks = await targetingTaskClient.post('/targeting-tasks/pages', {
          status: tab,
          // filterParams: filtersToApply,
          filterParams: { // Testing
            taskStatuses: [],
            movementModes: [],
            selectors: 'ANY',
          },
          sortParams,
          pageParams: {
            limit: itemsPerPage,
            offset,
          },
        });
        setTargetTasks(tasks.data);
      } catch (e) {
        setError(e.message);
        setTargetTasks([]);
      } finally {
        setLoading(false);
        setRefreshTaskList(false);
      }
    }
  };

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

  return (
    <>
      {isLoading && <LoadingSpinner />}

      {!isLoading && targetTasks.length === 0 && (
        <p className="govuk-body-l">There are no {taskStatus} tasks</p>
      )}

      {!isLoading && targetTasks.length > 0 && (
      <Pagination
        totalItems={targetTaskCount}
        itemsPerPage={itemsPerPage}
        activePage={activePage}
        totalPages={totalPages}
      />
      )}

      {!isLoading
        && targetTasks.length > 0
        && targetTasks.map((targetTask) => {
          return (
            <TaskListCard key={targetTask.id} targetTask={targetTask} />
          );
        })}

      {!isLoading && targetTasks.length > 0 && (
      <Pagination
        totalItems={targetTaskCount}
        itemsPerPage={itemsPerPage}
        activePage={activePage}
        totalPages={totalPages}
      />
      )}
    </>
  );
};

const TaskListPage = () => {
  const keycloak = useKeycloak();
  const [authorisedGroup, setAuthorisedGroup] = useState();
  const [error, setError] = useState(null);

  useEffect(() => {
    const isTargeter = keycloak.tokenParsed.groups.indexOf(TARGETER_GROUP) > -1;
    if (!isTargeter) {
      setAuthorisedGroup(false);
    }
    if (isTargeter) {
      setAuthorisedGroup(true);
    }
  }, []);
  return (
    <>
      <h1 className="govuk-heading-xl">Task management</h1>
      {!authorisedGroup && <p>You are not authorised to view these tasks.</p>}

      {authorisedGroup && (
        <div className="govuk-grid-row">
          <section className="govuk-grid-column-one-quarter">
            <div className="cop-filters-container">
              <div className="cop-filters-header">
                <h2 className="govuk-heading-s">Filters</h2>
              </div>
            </div>
          </section>

          <section className="govuk-grid-column-three-quarters">
            <Tabs
              title="Title"
              id="tasks"
              items={[
                {
                  id: TASK_STATUS_NEW,
                  label: 'New',
                  panel: (
                    <>
                      <h2 className="govuk-heading-l">New tasks</h2>
                      <TasksTab
                        taskStatus={TASK_STATUS_NEW}
                        setError={setError}
                      />
                    </>
                  ),
                },
                {
                  id: TASK_STATUS_IN_PROGRESS,
                  label: 'In progress',
                  panel: (
                    <>
                      <h2 className="govuk-heading-l">In progress tasks</h2>
                      <TasksTab
                        taskStatus={TASK_STATUS_IN_PROGRESS}
                        setError={setError}
                      />
                    </>
                  ),
                },
                {
                  id: TASK_STATUS_TARGET_ISSUED,
                  label: 'Issued',
                  panel: (
                    <>
                      <h2 className="govuk-heading-l">Target issued tasks</h2>
                      <TasksTab
                        taskStatus={TASK_STATUS_TARGET_ISSUED}
                        setError={setError}
                      />
                    </>
                  ),
                },
                {
                  id: TASK_STATUS_COMPLETED,
                  label: 'Complete',
                  panel: (
                    <>
                      <h2 className="govuk-heading-l">Completed tasks</h2>
                      <TasksTab
                        taskStatus={TASK_STATUS_COMPLETED}
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
