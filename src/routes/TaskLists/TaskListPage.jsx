import React, { useEffect, useState } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { useInterval } from 'react-use';
import qs from 'qs';
import moment from 'moment';
import * as pluralise from 'pluralise';
import axios from 'axios';
import _ from 'lodash';

import config from '../../config';
import { SHORT_DATE_FORMAT } from '../../constants';
import Tabs from '../../govuk/Tabs';
import Pagination from '../../components/Pagination';
import useAxiosInstance from '../../utils/axiosInstance';
import formatTaskData from '../../utils/formatTaskSummaryData';
import LoadingSpinner from '../../forms/LoadingSpinner';
import ErrorSummary from '../../govuk/ErrorSummary';

import '../__assets__/TaskListPage.scss';
import ClaimButton from '../../components/ClaimTaskButton';
import { useKeycloak } from '../../utils/keycloak';

const TASK_STATUS_NEW = 'new';
const TASK_STATUS_TARGET_ISSUED = 'issued';

const TasksTab = ({ taskStatus, setError }) => {
  const [activePage, setActivePage] = useState(0);
  const [targetTasks, setTargetTasks] = useState([]);
  const [targetTaskCount, setTargetTaskCount] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const location = useLocation();
  const keycloak = useKeycloak();
  const camundaClient = useAxiosInstance(keycloak, config.camundaApiUrl);
  const source = axios.CancelToken.source();
  // PAGINATION SETTINGS
  const itemsPerPage = 10;
  const index = activePage - 1;
  const offset = index * itemsPerPage;
  const totalPages = Math.ceil(targetTaskCount / itemsPerPage);
  // STATUS SETTINGS
  const activeTab = taskStatus;
  const targetStatus = {
    new: {
      url: '/task',
      statusRules: {
        processVariables: 'processState_neq_Complete',
        unassigned: true,
      },
    },
    issued: {
      url: '/process-instance',
      statusRules: {
        variables: 'processState_eq_Issued',
      },
    },
  };

  const loadTasks = async () => {
    if (camundaClient) {
      try {
        setLoading(true);
        /*
        * For pagination rules we need to get a count of total tasks that match the criteria for that status
        * the same criteria is then used to create the target summary below
        */
        const getTargetTaskCount = await camundaClient.get(
          `${targetStatus[activeTab].url}/count`,
          { params: targetStatus[activeTab].statusRules },
        );
        setTargetTaskCount(getTargetTaskCount.data.count);

        /*
        * To provide a user with a summary and the ability to claim/unclaim (when correct conditions are met)
        * We need to get the targets that match the criteria for that status
        * then use the processInstanceIds (when the url is /tasks) or the ids (when the url is /process-instance) from the targetTaskList data to get the targetTaskSummary data
        */
        const targetTaskList = await camundaClient.get(
          targetStatus[activeTab].url,
          { params: { ...targetStatus[activeTab].statusRules, firstResult: offset, maxResults: itemsPerPage } },
        );
        const processInstanceIds = _.uniq(targetTaskList.data.map(({ processInstanceId, id }) => processInstanceId || id)).join(',');
        const targetTaskSummaries = await camundaClient.get(
          '/variable-instance',
          { params: { variableName: 'taskSummary', processInstanceIdIn: processInstanceIds, deserializeValues: false } },
        );
        const targetTaskSummaryValues = targetTaskSummaries.data.map((task) => {
          return {
            processInstanceId: task.processInstanceId,
            ...JSON.parse(task.value),
          };
        });

        /*
        * If the targetStatus is 'new' or 'in progress' we must include the task id and assignee
        * so we can show/hide claim details AND allow tasks to be claimed/unclaimed
        */
        let parsedTargetTaskSummariesValues;
        if (activeTab === TASK_STATUS_NEW) {
          const mergedTargetSummary = targetTaskSummaryValues.map((task) => {
            const matchedTargetTask = targetTaskList.data.find((v) => task.processInstanceId === v.processInstanceId);
            return {
              ...task,
              ...matchedTargetTask,
            };
          });
          parsedTargetTaskSummariesValues = mergedTargetSummary;
        } else {
          parsedTargetTaskSummariesValues = targetTaskSummaryValues;
        }
        setTargetTasks(parsedTargetTaskSummariesValues);
      } catch (e) {
        setError(e.message);
        setTargetTasks([]);
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

      {!isLoading && targetTasks.length === 0 && (
        <p className="govuk-body-l">No tasks available</p>
      )}

      {!isLoading && targetTasks.length > 0 && targetTasks.map((target) => {
        const formattedData = formatTaskData(target);
        const passengers = target.people?.filter(({ role }) => role === 'PASSENGER') || [];

        return (
          <section className="task-list--item" key={target.processInstanceId}>
            <div className="govuk-grid-row">
              <div className="govuk-grid-column-three-quarters">
                <h3 className="govuk-heading-m task-heading">
                  <Link
                    className="govuk-link govuk-link--no-visited-state govuk-!-font-weight-bold"
                    to={`/tasks/${target.processInstanceId || target.id}`}
                  >{target.businessKey || target.id}
                  </Link>
                </h3>
                <h4 className="govuk-heading-m task-sub-heading govuk-!-font-weight-regular">
                  {target.movementStatus}
                </h4>
              </div>
              <div className="govuk-grid-column-one-quarter govuk-!-font-size-19">
                { activeTab === TASK_STATUS_NEW
                  && (
                  <ClaimButton
                    className="govuk-!-font-weight-bold"
                    assignee={target.assignee}
                    taskId={target.id}
                    setError={setError}
                    processInstanceId={target.processInstanceId}
                  />
                  )}
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
                      {pluralise.withCount(target.aggregateDriverTrips || '?', '% trip', '% trips')}
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
                      {pluralise.withCount(target.aggregateVehicleTrips || 0, '% trip', '% trips')}
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
                      {pluralise.withCount(target.aggregateTrailerTrips || 0, '% trip', '% trips')}
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
                  {target.bookingDateTime && (
                    <>, Booked on {moment(target.bookingDateTime).format(SHORT_DATE_FORMAT)}</>
                  )}
                </p>
              </div>
              <div className="govuk-grid-column-one-quarter">
                <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
                  Goods details
                </h3>
                <p className="govuk-body-s govuk-!-font-weight-bold">
                  {target.freight?.descriptionOfCargo || 'Unknown'}
                </p>
              </div>
            </div>
            <div className="govuk-grid-row">
              <div className="govuk-grid-column-full">
                <ul className="govuk-list task-labels govuk-!-margin-top-2 govuk-!-margin-bottom-0">
                  <li className="task-labels-item">
                    <strong className="govuk-tag govuk-tag--positiveTarget">
                      {target.matchedSelectors?.[0]?.priority || 'Unknown'}
                    </strong>
                  </li>
                  <li className="task-labels-item">
                    {target.matchedSelectors?.[0]?.threatType || 'Unknown'}
                  </li>
                </ul>
              </div>
            </div>
          </section>
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
                <h2 className="govuk-heading-l">New tasks</h2>
                <TasksTab taskStatus={TASK_STATUS_NEW} setError={setError} />
              </>
            ),
          },
          // {
          //   id: 'in-progress',
          //   label: 'In progress',
          //   panel: (
          //     <>
          //       <h2 className="govuk-heading-l">In progress tasks</h2>
          //       <TasksTab taskStatus={TASK_STATUS_IN_PROGRESS} setError={setError} />
          //     </>
          //   ),
          // },
          {
            id: 'target-issued',
            label: 'Target issued',
            panel: (
              <>
                <h2 className="govuk-heading-l">Target issued tasks</h2>
                <TasksTab taskStatus={TASK_STATUS_TARGET_ISSUED} setError={setError} />
              </>
            ),
          },
          // {
          //   id: 'complete',
          //   label: 'Complete',
          //   panel: (
          //     <>
          //       <h2 className="govuk-heading-l">Completed tasks</h2>
          //       <TasksTab taskStatus={TASK_STATUS_COMPLETED} setError={setError} />
          //     </>
          //   ),
          // },
        ]}
      />
    </>
  );
};

export default TaskListPage;
