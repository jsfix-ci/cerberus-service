import React, { useEffect, useState } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { useInterval } from 'react-use';
import qs from 'qs';
import moment from 'moment';
import * as pluralise from 'pluralise';
import axios from 'axios';
import _ from 'lodash';

import config from '../config';
import { SHORT_DATE_FORMAT } from '../constants';
import Tabs from '../govuk/Tabs';
import Pagination from '../components/Pagination';
import useAxiosInstance from '../utils/axiosInstance';
import formatTaskData from '../utils/formatTaskData';
import LoadingSpinner from '../forms/LoadingSpinner';
import ErrorSummary from '../govuk/ErrorSummary';

import './__assets__/TaskListPage.scss';
import ClaimButton from '../components/ClaimTaskButton';
import { useKeycloak } from '../utils/keycloak';

const TASK_STATUS_NEW = 'new';
const TASK_STATUS_IN_PROGRESS = 'in_progress';
const TASK_STATUS_COMPLETED = 'completed';

const TasksTab = ({ taskStatus, setError }) => {
  const [activePage, setActivePage] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [taskCount, setTaskCount] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const location = useLocation();

  const itemsPerPage = 10;
  const index = activePage - 1;
  const offset = index * itemsPerPage;
  const totalPages = Math.ceil(taskCount / itemsPerPage);
  const keycloak = useKeycloak();
  const camundaClient = useAxiosInstance(keycloak, config.camundaApiUrl);
  const source = axios.CancelToken.source();

  const loadTasks = async () => {
    if (camundaClient) {
      try {
        setLoading(true);

        const commonQueryParams = {};

        if (taskStatus === TASK_STATUS_NEW) {
          commonQueryParams.processVariables = 'processState_neq_Complete';
          commonQueryParams.unassigned = true;
        } else if (taskStatus === TASK_STATUS_IN_PROGRESS) {
          commonQueryParams.processVariables = 'processState_neq_Complete';
          commonQueryParams.assigned = true;
        } else if (taskStatus === TASK_STATUS_COMPLETED) {
          commonQueryParams.processVariables = 'processState_eq_Complete';
          commonQueryParams.processDefinitionKey = 'assignTarget';
        }

        const [tasksResponse, taskCountResponse] = await Promise.all([
          camundaClient.get('/task', {
            params: {
              firstResult: offset,
              maxResults: itemsPerPage,
              ...commonQueryParams,
            },
          }),
          camundaClient.get('/task/count', {
            params: commonQueryParams,
          }),
        ]);

        const processInstanceIds = _.uniq(tasksResponse.data.map(({ processInstanceId }) => processInstanceId));
        const variableInstances = await camundaClient.post('/variable-instance', {
          processInstanceIdIn: processInstanceIds,
          variableName: 'taskSummary',
        }, {
          params: {
            deserializeValues: false,
          },
        });

        const parsedTasks = tasksResponse.data.map((task) => {
          const taskSummaryVar = variableInstances.data.find((v) => task.processInstanceId === v.processInstanceId);
          return {
            ...(taskSummaryVar ? JSON.parse(taskSummaryVar.value) : {}),
            ...task,
          };
        });

        setTaskCount(taskCountResponse.data.count);
        setTasks(parsedTasks);
      } catch (e) {
        setError(e.message);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const { page } = qs.parse(location.search, { ignoreQueryPrefix: true });
    const newActivePage = parseInt(page || 1, 10);
    setActivePage(newActivePage);
  }, [location.search]);

  useEffect(() => {
    if (activePage > 0) {
      loadTasks();
      return () => {
        source.cancel('Cancelling request');
      };
    }
  }, [activePage]);

  useInterval(() => {
    setLoading(true);
    loadTasks();
    return () => {
      source.cancel('Cancelling request');
    };
  }, 60000);

  return (
    <>
      {isLoading && <LoadingSpinner><br /><br /><br /></LoadingSpinner>}

      {!isLoading && tasks.length === 0 && (
        <p className="govuk-body-l">No tasks available</p>
      )}

      {!isLoading && tasks.length > 0 && tasks.map((task) => {
        const formattedData = formatTaskData(task);
        const passengers = task.people?.filter(({ role }) => role === 'PASSENGER') || [];

        return (
          <section className="task-list--item" key={task.processInstanceId}>
            <div className="govuk-grid-row">
              <div className="govuk-grid-column-three-quarters">
                <h3 className="govuk-heading-m task-heading">
                  <Link
                    className="govuk-link govuk-link--no-visited-state govuk-!-font-weight-bold"
                    to={`/tasks/${task.id}`}
                  >{task.businessKey || task.id}
                  </Link>
                </h3>
                <h4 className="govuk-heading-m task-sub-heading govuk-!-font-weight-regular">
                  {task.movementStatus}
                </h4>
              </div>
              <div className="govuk-grid-column-one-quarter govuk-!-font-size-19">
                <ClaimButton
                  className="govuk-!-font-weight-bold"
                  assignee={task.assignee}
                  taskId={task.id}
                  setError={setError}
                />
              </div>
            </div>
            <div className="govuk-grid-row">
              <div className="govuk-grid-column-full">
                <p className="govuk-body-s arrival-title">
                  {`${formattedData.ferry.description}, arrival ${formattedData.arrival.fromNow}`}
                </p>
                <ul className="govuk-list arrival-dates govuk-!-margin-bottom-4">
                  <li className="govuk-!-font-weight-bold">{formattedData.departure.location}</li>
                  <li>{formattedData.departure.date}</li>
                  <li className="govuk-!-font-weight-bold">{formattedData.arrival.location}</li>
                  <li>{formattedData.arrival.date}</li>
                </ul>
              </div>
            </div>
            <div className="govuk-grid-row">
              <div className="govuk-grid-column-one-quarter">
                <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
                  Driver details
                </h3>
                <p className="govuk-body-s govuk-!-margin-bottom-1">
                  {formattedData.driver.dataExists ? (
                    <>
                      <span className="govuk-!-font-weight-bold">
                        {formattedData.driver.name}
                      </span>, DOB: {formattedData.driver.dateOfBirth},
                      {' '}
                      {pluralise.withCount(task.aggregateDriverTrips || '?', '% trip', '% trips')}
                    </>
                  ) : (<span className="govuk-!-font-weight-bold">Unknown</span>)}
                </p>
                <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
                  Passenger details
                </h3>
                <p className="govuk-body-s govuk-!-margin-bottom-1 govuk-!-font-weight-bold">
                  {pluralise.withCount(passengers.length, '% passenger', '% passengers')}
                </p>
              </div>
              <div className="govuk-grid-column-one-quarter">
                <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
                  Vehicle details
                </h3>
                <p className="govuk-body-s govuk-!-margin-bottom-1">
                  {formattedData.vehicle.dataExists ? (
                    <>
                      <span className="govuk-!-font-weight-bold">
                        {formattedData.vehicle.registration}
                      </span>, {formattedData.vehicle.description},
                      {' '}
                      {pluralise.withCount(task.aggregateVehicleTrips || 0, '% trip', '% trips')}
                    </>
                  ) : (<span className="govuk-!-font-weight-bold">No vehicle</span>)}
                </p>
                <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
                  Trailer details
                </h3>
                <p className="govuk-body-s govuk-!-margin-bottom-1">
                  {formattedData.trailer.dataExists ? (
                    <>
                      <span className="govuk-!-font-weight-bold">
                        {formattedData.trailerRegistration}
                      </span>, {formattedData.trailer.description},
                      {' '}
                      {pluralise.withCount(task.aggregateTrailerTrips || 0, '% trip', '% trips')}
                    </>
                  ) : (<span className="govuk-!-font-weight-bold">No trailer</span>)}
                </p>
              </div>
              <div className="govuk-grid-column-one-quarter">
                <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
                  Haulier details
                </h3>
                <p className="govuk-body-s govuk-!-font-weight-bold govuk-!-margin-bottom-1">
                  {formattedData.haulier.name}
                </p>
                <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
                  Account details
                </h3>
                <p className="govuk-body-s govuk-!-margin-bottom-1">
                  <span className="govuk-!-font-weight-bold">
                    {formattedData.account.name}
                  </span>
                  {task.bookingDateTime && (
                    <>, Booked on {moment(task.bookingDateTime).format(SHORT_DATE_FORMAT)}</>
                  )}
                </p>
              </div>
              <div className="govuk-grid-column-one-quarter">
                <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
                  Goods details
                </h3>
                <p className="govuk-body-s govuk-!-font-weight-bold">
                  {task.freight?.descriptionOfCargo || 'Unknown'}
                </p>
              </div>
            </div>
            <div className="govuk-grid-row">
              <div className="govuk-grid-column-full">
                <ul className="govuk-list task-labels govuk-!-margin-top-2 govuk-!-margin-bottom-0">
                  <li className="task-labels-item">
                    <strong className="govuk-tag govuk-tag--positiveTarget">
                      {task.matchedSelectors?.[0]?.priority || 'Unknown'}
                    </strong>
                  </li>
                  <li className="task-labels-item">
                    {task.matchedSelectors?.[0]?.threatType || 'Unknown'}
                  </li>
                </ul>
              </div>
            </div>
          </section>
        );
      })}

      <Pagination
        totalItems={taskCount}
        itemsPerPage={itemsPerPage}
        activePage={activePage}
        totalPages={totalPages}
      />
    </>
  );
};

const TaskListPage = () => {
  const [error, setError] = useState(null);
  const history = useHistory();

  return (
    <>
      <h1 className="govuk-heading-xl">Task management</h1>

      {error && (
        <ErrorSummary
          title="There is a problem"
          errorList={[
            { children: error },
          ]}
        />
      )}

      <Tabs
        title="Title"
        id="tasks"
        onTabClick={() => { history.push(); }}
        items={[
          {
            id: 'new',
            label: 'New',
            panel: (
              <>
                <h1 className="govuk-heading-l">New tasks</h1>
                <TasksTab taskStatus={TASK_STATUS_NEW} setError={setError} />
              </>
            ),
          },
          {
            id: 'in-progress',
            label: 'In progress',
            panel: (
              <>
                <h1 className="govuk-heading-l">In progress tasks</h1>
                <TasksTab taskStatus={TASK_STATUS_IN_PROGRESS} setError={setError} />
              </>
            ),
          },
          {
            id: 'complete',
            label: 'Complete',
            panel: (
              <>
                <h1 className="govuk-heading-l">Completed tasks</h1>
                <TasksTab taskStatus={TASK_STATUS_COMPLETED} setError={setError} />
              </>
            ),
          },
        ]}
      />
    </>
  );
};

export default TaskListPage;
