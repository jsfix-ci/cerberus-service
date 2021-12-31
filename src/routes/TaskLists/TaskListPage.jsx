// Third party imports
import React, { useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useInterval } from 'react-use';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import * as pluralise from 'pluralise';
import qs from 'qs';
// Config
import { SHORT_DATE_FORMAT, LONG_DATE_FORMAT, TARGETER_GROUP, TASK_STATUS_COMPLETED, TASK_STATUS_IN_PROGRESS, TASK_STATUS_NEW, TASK_STATUS_TARGET_ISSUED } from '../../constants';
import config from '../../config';
// Utils
import useAxiosInstance from '../../utils/axiosInstance';
import targetDatetimeDifference from '../../utils/calculateDatetimeDifference';
import { useKeycloak } from '../../utils/keycloak';
import { calculateTaskListTotalRiskScore } from '../../utils/rickScoreCalculator';
// Components/Pages
import ClaimButton from '../../components/ClaimTaskButton';
import ErrorSummary from '../../govuk/ErrorSummary';
import LoadingSpinner from '../../forms/LoadingSpinner';
import Pagination from '../../components/Pagination';
import Tabs from '../../govuk/Tabs';
// Styling
import '../__assets__/TaskListPage.scss';

const filters = [
  {
    filterName: 'movementModes',
    filterType: 'checkbox',
    filterClassPrefix: 'checkboxes',
    filterLabel: 'Modes',
    filterOptions: [
      {
        optionName: 'RORO_UNACCOMPANIED_FREIGHT',
        optionLabel: 'RoRo unaccompanied freight',
        checked: false,
      },
      {
        optionName: 'RORO_ACCOMPANIED_FREIGHT',
        optionLabel: 'RoRo accompanied freight',
        checked: false,
      },
      {
        optionName: 'RORO_TOURIST',
        optionLabel: 'RoRo Tourist',
        checked: false,
      },
    ],
  },
  {
    filterName: 'hasSelectors',
    filterType: 'radio',
    filterClassPrefix: 'radios',
    filterLabel: 'Selectors',
    filterOptions: [
      {
        optionName: 'true',
        optionLabel: 'Present',
        checked: false,
      },
      {
        optionName: 'false',
        optionLabel: 'Not present',
        checked: false,
      },
      {
        optionName: 'any',
        optionLabel: 'Any',
        checked: false,
      },
    ],
  },
];

const TasksTab = ({ taskStatus, filtersToApply, setError, targetTaskCount = 0 }) => {
  dayjs.extend(relativeTime);
  dayjs.extend(utc);
  const keycloak = useKeycloak();
  const location = useLocation();
  const camundaClientV1 = useAxiosInstance(keycloak, config.camundaApiUrlV1);
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
    if (camundaClientV1) {
      const tab = taskStatus === 'inProgress' ? 'IN_PROGRESS' : taskStatus.toUpperCase();
      const sortParams = (taskStatus === 'new' || taskStatus === 'inProgress')
        ? [
          {
            field: 'arrival-date',
            order: 'asc',
          },
        ]
        : null;
      try {
        const tasks = await camundaClientV1.post('/targeting-tasks/pages', {
          status: tab,
          filterParams: filtersToApply,
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

  const formatTargetRisk = (target) => {
    if (target.risks.length >= 1) {
      const topRisk = target.risks[0].contents
        ? `SELECTOR: ${target.risks[0].contents.groupReference}, ${target.risks[0].contents.category}, ${target.risks[0].contents.threatType}`
        : `${target.risks[0].name}, ${target.risks[0].rulePriority}, ${target.risks[0].abuseType}`;
      const count = target.risks.length - 1;
      return `${topRisk} and ${pluralise.withCount(count, '% other rule', '% other rules')}`;
    }
    return null;
  };

  const formatTargetIndicators = (target) => {
    if (target.threatIndicators?.length > 0) {
      const threatIndicatorList = target.threatIndicators.map((threatIndicator) => {
        return threatIndicator.userfacingtext;
      });
      return (
        <ul className="govuk-list item-list--bulleted">
          <li>{`${pluralise.withCount(threatIndicatorList.length, '% indicator', '% indicators')}`}</li>{threatIndicatorList.map((threat) => {
            return (
              <li key={threat}>{threat}</li>
            );
          })}
        </ul>
      );
    }
  };

  const hasUpdatedStatus = (target) => {
    if (target.numberOfVersions > 1) {
      return (
        <p className="govuk-body govuk-tag govuk-tag--updatedTarget">Updated</p>
      );
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

  useInterval(() => {
    getTaskList();
    return () => {
      source.cancel('Cancelling request');
    };
  }, 60000);

  const getVehicleIcon = (movementMode, vehicle) => {
    if (movementMode === 'RORO_TOURIST') return 'c-icon-car';
    if (vehicle && !vehicle.trailer) return 'c-icon-van';
    if (vehicle && vehicle.trailer) return 'c-icon-hgv';
    return 'c-icon-car';
  };

  return (
    <>
      {isLoading && <LoadingSpinner><br /><br /><br /></LoadingSpinner>}
      {!isLoading && targetTasks.length === 0 && (
        <p className="govuk-body-l">No more tasks available</p>
      )}

      {!isLoading && targetTasks.length > 0 && targetTasks.map((target) => {
        const roroData = target.summary.roro.details;
        const passengers = roroData.passengers;
        const vehicleIcon = getVehicleIcon(target.movementMode, roroData.vehicle);
        return (
          <div className="govuk-task-list-card" key={target.summary.parentBusinessKey.businessKey}>
            <div className="card-container">
              <section className="task-list--item-1">
                <div className="govuk-grid-row">
                  <div className="govuk-grid-item">
                    <div className="title-container">
                      <div className="heading-container">
                        <h4 className="govuk-heading-m task-heading">
                          {target.summary.parentBusinessKey.businessKey}
                        </h4>
                        <h3 className="govuk-heading-m govuk-!-font-weight-regular task-heading">
                          {roroData.movementStatus}
                        </h3>
                      </div>
                    </div>
                    <div className="govuk-grid-column">
                      <p className="govuk-body task-risk-statement">{formatTargetRisk(target.summary)}</p>
                    </div>
                    <div className="govuk-grid-column">
                      {hasUpdatedStatus(target.summary)}
                    </div>
                  </div>
                  <div className="govuk-grid-item">
                    <div className="govuk-!-font-size-19">
                      <div className="claim-button-container">
                        <div>
                          {(activeTab === TASK_STATUS_NEW || activeTab === TASK_STATUS_IN_PROGRESS || currentUser === target.assignee)
                          && (
                            <ClaimButton
                              className="govuk-!-font-weight-bold govuk-button"
                              assignee={target.assignee}
                              taskId={target.id}
                              setError={setError}
                              businessKey={target.summary.parentBusinessKey.businessKey}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section className="task-list--item-2">
                <div>
                  <div className="govuk-grid-row grid-background--greyed">
                    <div className="govuk-grid-column-one-quarter govuk-!-padding-left-8">
                      <i className={`icon-position--left ${vehicleIcon}`} />
                      <p className="govuk-body-s content-line-one govuk-!-margin-bottom-0">{!roroData.vehicle.make ? '\xa0' : roroData.vehicle.make} {roroData.vehicle.model}</p>
                      <p className="govuk-body-s govuk-!-margin-bottom-0 govuk-!-font-weight-bold">{!roroData.vehicle.registrationNumber ? '\xa0' : roroData.vehicle.registrationNumber.toUpperCase()}</p>
                    </div>

                    <div className="govuk-grid-column-three-quarters govuk-!-padding-right-7 align-right">
                      <i className="c-icon-ship" />
                      <p className="content-line-one">{roroData.vessel.company && `${roroData.vessel.company} voyage of `}{roroData.vessel.name}{', '}arrival {!roroData.eta ? 'unknown' : dayjs.utc(roroData.eta).fromNow()}</p>
                      <p className="govuk-body-s content-line-two">
                        {!roroData.departureTime ? 'unknown' : dayjs.utc(roroData.departureTime).format(LONG_DATE_FORMAT)}{' '}
                        <span className="govuk-!-font-weight-bold">{roroData.departureLocation || 'unknown'}</span>{' '}-{' '}
                        <span className="govuk-!-font-weight-bold">{roroData.arrivalLocation || 'unknown'}</span> {!roroData.eta ? 'unknown'
                          : dayjs.utc(roroData.eta).format(LONG_DATE_FORMAT)}
                      </p>
                    </div>

                  </div>
                </div>
              </section>
              <section className="task-list--item-3">
                <div className="govuk-grid-row">
                  <div className="govuk-grid-item">
                    <div>
                      <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
                        Driver details
                      </h3>
                      <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-2">
                        {roroData.driver ? (
                          <>
                            {roroData.driver.firstName && <li className="govuk-!-font-weight-bold">{roroData.driver.firstName}</li>}
                            {roroData.driver.middleName && <li className="govuk-!-font-weight-bold">{roroData.driver.middleName}</li>}
                            {roroData.driver.lastName && <li className="govuk-!-font-weight-bold">{roroData.driver.lastName}</li>}
                            {roroData.driver.dob && <li>DOB: {roroData.driver.dob}</li>}
                            <li>{pluralise.withCount(target.aggregateDriverTrips || '?', '% trip', '% trips')}</li>
                          </>
                        ) : (<li className="govuk-!-font-weight-bold">Unknown</li>)}
                      </ul>
                      <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
                        Passenger details
                      </h3>
                      <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-2">
                        {roroData.passengers && roroData.passengers.length > 0 ? (
                          <>
                            <li className="govuk-!-font-weight-bold">{pluralise.withCount(passengers.length, '% passenger', '% passengers')}</li>
                          </>
                        ) : (<li className="govuk-!-font-weight-bold">None</li>)}
                      </ul>
                    </div>
                  </div>

                  <div className="govuk-grid-item verticel-dotted-line">
                    <div>
                      <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
                        Vehicle details
                      </h3>
                      <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-2">
                        {roroData.vehicle ? (
                          <>
                            {roroData.vehicle.registrationNumber && <li className="govuk-!-font-weight-bold">{roroData.vehicle.registrationNumber}</li>}
                            {roroData.vehicle.colour && <li>{roroData.vehicle.colour}</li>}
                            {roroData.vehicle.make && <li>{roroData.vehicle.make}</li>}
                            {roroData.vehicle.model && <li>{roroData.vehicle.model}</li>}
                            <li>{pluralise.withCount(target.aggregateVehicleTrips || 0, '% trip', '% trips')}</li>
                          </>
                        ) : (<li className="govuk-!-font-weight-bold">No vehicle</li>)}
                      </ul>
                      <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
                        Trailer details
                      </h3>
                      <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-2">
                        {roroData.vehicle.trailer ? (
                          <>
                            {roroData.vehicle.trailer.regNumber && <li className="govuk-!-font-weight-bold">{roroData.vehicle.trailer.regNumber}</li>}
                            {roroData.vehicle.trailerType && <li>{roroData.vehicle.trailerType}</li>}
                            <li>{pluralise.withCount(target.aggregateTrailerTrips || 0, '% trip', '% trips')}</li>
                          </>
                        ) : (<li className="govuk-!-font-weight-bold">No trailer</li>)}
                      </ul>
                    </div>
                  </div>

                  <div className="govuk-grid-item verticel-dotted-line">
                    <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
                      Haulier details
                    </h3>
                    <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-2">
                      {roroData.haulier?.name ? (
                        <>
                          {roroData.haulier.name && <li className="govuk-!-font-weight-bold">{roroData.haulier.name}</li>}
                        </>
                      ) : (<li className="govuk-!-font-weight-bold">Unknown</li>)}
                    </ul>
                    <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
                      Account details
                    </h3>
                    <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-2">
                      {roroData.account ? (
                        <>
                          {roroData.account.name && <li className="govuk-!-font-weight-bold">{roroData.account.name}</li>}
                          {roroData.bookingDateTime && <li>Booked on {dayjs.utc(roroData.bookingDateTime.split(',')[0]).format(SHORT_DATE_FORMAT)}</li>}
                          {roroData.bookingDateTime && <br />}
                          {roroData.bookingDateTime && <li>{targetDatetimeDifference(roroData.bookingDateTime)}</li>}
                        </>
                      ) : (<li className="govuk-!-font-weight-bold">Unknown</li>)}
                    </ul>
                  </div>

                  <div className="govuk-grid-item verticel-dotted-line">
                    <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
                      Goods description
                    </h3>
                    <ul className="govuk-body-s govuk-list govuk-!-margin-bottom-2">
                      {roroData.load.manifestedLoad ? (
                        <>
                          {roroData.load.manifestedLoad && <li className="govuk-!-font-weight-bold">{roroData.load.manifestedLoad}</li>}
                        </>
                      ) : (<li className="govuk-!-font-weight-bold">Unknown</li>)}
                    </ul>
                  </div>
                </div>
              </section>
              <section className="task-list--item-4">
                <div className="govuk-grid-row">
                  <div className="govuk-grid-item">
                    <div className="govuk-grid-column">
                      <ul className="govuk-list task-labels govuk-!-margin-top-2">
                        <li className="task-labels-item">
                          <strong className="govuk-!-font-weight-bold">
                            {calculateTaskListTotalRiskScore(target.summary)}
                          </strong>
                        </li>
                      </ul>
                    </div>
                    <div className="govuk-grid-column">
                      <ul className="govuk-list task-labels govuk-!-margin-top-0">
                        <li className="task-labels-item">
                          {formatTargetIndicators(target.summary)}
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="govuk-grid-item task-link-container">
                    <div>
                      <Link
                        className="govuk-link govuk-link--no-visited-state govuk-!-font-weight-bold"
                        to={`/tasks/${target.summary.parentBusinessKey.businessKey}`}
                      >
                        View details
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
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
  const history = useHistory();
  const keycloak = useKeycloak();
  const camundaClientV1 = useAxiosInstance(keycloak, config.camundaApiUrlV1);
  const [authorisedGroup, setAuthorisedGroup] = useState();
  const [error, setError] = useState(null);
  const [filtersToApply, setFiltersToApply] = useState('');
  const [storedFilters, setStoredFilters] = useState();
  const [taskCountsByStatus, setTaskCountsByStatus] = useState();
  const [filtersAndSelectorsCount, setFiltersAndSelectorsCount] = useState({});

  const [hasSelectors, setHasSelectors] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [movementModesSelected, setMovementModesSelected] = useState([]);

  const getTaskCount = async (activeFilters) => {
    setTaskCountsByStatus();
    if (camundaClientV1) {
      try {
        const count = await camundaClientV1.post('/targeting-tasks/status-counts', [activeFilters || {}]);
        setTaskCountsByStatus(count.data[0].statusCounts);
      } catch (e) {
        setError(e.message);
        setTaskCountsByStatus();
      }
    }
  };

  const getFiltersAndSelectorsCount = async () => {
    setFiltersAndSelectorsCount();
    if (camundaClientV1) {
      try {
        const filtersSelectorsCount = await camundaClientV1.post('/targeting-tasks/status-counts', [
          {
            movementModes: ['RORO_UNACCOMPANIED_FREIGHT'],
            hasSelectors: null,
          },
          {
            movementModes: ['RORO_ACCOMPANIED_FREIGHT'],
            hasSelectors: null,
          },
          {
            movementModes: ['RORO_TOURIST'],
            hasSelectors: null,
          },
          {
            movementModes: [],
            hasSelectors: true,
          },
          {
            movementModes: [],
            hasSelectors: false,
          },
          {
            movementModes: [],
            hasSelectors: null,
          },
        ]);
        setFiltersAndSelectorsCount(filtersSelectorsCount.data);
      } catch (e) {
        setError(e.message);
        setFiltersAndSelectorsCount();
      }
    }
  };

  const handleFilterChange = (e, option, filterSet) => {
    if (filterSet.filterName === 'hasSelectors') {
      if (option.optionName !== 'any') {
        setHasSelectors(option.optionName);
      } else {
        setHasSelectors(null);
      }
    }
    if (filterSet.filterName === 'movementModes') {
      if (e.target.checked) {
        setMovementModesSelected([...movementModesSelected, option.optionName]);
      } else {
        const adjustedMovementModeSelected = [...movementModesSelected];
        adjustedMovementModeSelected.splice(movementModesSelected.indexOf(option.optionName), 1);
        setMovementModesSelected(adjustedMovementModeSelected);
      }
    }
  };

  const handleFilterApply = (e, resetToDefault) => {
    setLoading(true);
    if (e) { e.preventDefault(); }
    let apiParams = [];
    if (!resetToDefault) {
      localStorage.setItem('filterMovementMode', movementModesSelected);
      localStorage.setItem('hasSelector', hasSelectors);
      apiParams = {
        movementModes: movementModesSelected || [],
        hasSelectors,
      };
    } else {
      apiParams = {
        movementModes: [],
        hasSelectors: null,
      };
    }
    getTaskCount(apiParams);
    setFiltersToApply(apiParams);
    getFiltersAndSelectorsCount();
    setLoading(false);
  };

  const handleFilterReset = (e) => {
    e.preventDefault();
    // Clear localStorage
    localStorage.removeItem('filterMovementMode');
    localStorage.removeItem('hasSelector');
    // Clear checked options
    if (hasSelectors) {
      document.getElementById(hasSelectors).checked = false;
      setHasSelectors(null);
    }
    if (movementModesSelected) {
      movementModesSelected.map((mode) => {
        document.getElementById(mode).checked = false;
      });
      setMovementModesSelected([]);
    }
    setStoredFilters([]);
    handleFilterApply(e, 'resetToDefault'); // run with default params
  };

  const applySavedFiltersOnLoad = () => {
    const selectors = localStorage.getItem('hasSelector');
    const movementModes = localStorage.getItem('filterMovementMode') ? localStorage.getItem('filterMovementMode').split(',') : [];
    setHasSelectors(selectors);
    setMovementModesSelected(movementModes);

    const selectedArray = [];
    if (selectors) { selectedArray.push(selectors); }
    if (movementModes?.length > 0) { selectedArray.push(...movementModes); }
    setStoredFilters(selectedArray);

    const apiParams = {
      movementModes,
      hasSelectors: selectors,
    };

    getTaskCount(apiParams);
    setFiltersToApply(apiParams);
    getFiltersAndSelectorsCount();
    setLoading(false);
  };

  useEffect(() => {
    const selectedArray = [];
    if (hasSelectors) { selectedArray.push(hasSelectors); }
    if (movementModesSelected?.length > 0) { selectedArray.push(...movementModesSelected); }
    setStoredFilters(selectedArray);
  }, [hasSelectors, movementModesSelected]);

  useEffect(() => {
    const isTargeter = (keycloak.tokenParsed.groups).indexOf(TARGETER_GROUP) > -1;
    if (!isTargeter) {
      setAuthorisedGroup(false);
    }
    if (isTargeter) {
      setAuthorisedGroup(true);
      applySavedFiltersOnLoad();
    }
  }, []);

  return (
    <>
      <h1 className="govuk-heading-xl">Task management</h1>
      {!authorisedGroup && (<p>You are not authorised to view these tasks.</p>)}
      {isLoading && <LoadingSpinner><br /><br /><br /></LoadingSpinner>}
      {error && (
        <ErrorSummary
          title="There is a problem"
          errorList={[
            { children: error },
          ]}
        />
      )}

      {!isLoading && authorisedGroup && (
        <div className="govuk-grid-row">
          <section className="govuk-grid-column-one-quarter">
            <div className="cop-filters-container">
              <div className="cop-filters-header">
                <h2 className="govuk-heading-s">Filters</h2>
                <button
                  className="govuk-link govuk-heading-s "
                  data-module="govuk-button"
                  type="button"
                  onClick={(e) => {
                    handleFilterReset(e);
                  }}
                >
                  Clear all filters
                </button>
              </div>

              {filters.length > 0 && filters.map((filterSet, parentIndex) => {
                return (
                  <div className="govuk-form-group" key={filterSet.filterLabel}>
                    <fieldset className="govuk-fieldset">
                      <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
                        <h4 className="govuk-fieldset__heading">{filterSet.filterLabel}</h4>
                      </legend>
                      <ul className={`govuk-${filterSet.filterClassPrefix} govuk-${filterSet.filterClassPrefix}--small`}>
                        {filterSet.filterOptions.map((option, index) => {
                          let checked = !!((storedFilters && !!storedFilters.find((filter) => filter === option.optionName)));
                          return (
                            <li
                              className={`govuk-${filterSet.filterClassPrefix}__item`}
                              key={option.optionName}
                            >
                              <input
                                className={`govuk-${filterSet.filterClassPrefix}__input`}
                                id={option.optionName}
                                name={filterSet.filterName}
                                type={filterSet.filterType}
                                value={option.optionName}
                                defaultChecked={checked}
                                onChange={(e) => {
                                  checked = !checked;
                                  handleFilterChange(e, option, filterSet);
                                }}
                                data-testid={`${filterSet.filterLabel}-${option.optionName}`}
                              />
                              <label
                                className={`govuk-label govuk-${filterSet.filterClassPrefix}__label`}
                                htmlFor={option.optionName}
                              >
                                {option.optionLabel}
                              </label>
                              <span className="govuk-!-margin-top-2 inline-block">({(filtersAndSelectorsCount && filtersAndSelectorsCount[parentIndex === 0 ? index : index + 3].statusCounts.total)})
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </fieldset>
                  </div>
                );
              })}
            </div>
            <button
              className="govuk-button"
              data-module="govuk-button"
              type="button"
              onClick={(e) => {
                handleFilterApply(e);
              }}
            >
              Apply filters
            </button>
          </section>

          <section className="govuk-grid-column-three-quarters">
            <Tabs
              title="Title"
              id="tasks"
              onTabClick={() => { history.push(); }}
              items={[
                {
                  id: TASK_STATUS_NEW,
                  label: `New (${taskCountsByStatus?.new || '0'})`,
                  panel: (
                    <>
                      <h2 className="govuk-heading-l">New tasks</h2>
                      <TasksTab
                        taskStatus={TASK_STATUS_NEW}
                        filtersToApply={filtersToApply}
                        targetTaskCount={taskCountsByStatus?.new}
                        setError={setError}
                      />
                    </>
                  ),
                },
                {
                  id: TASK_STATUS_IN_PROGRESS,
                  label: `In progress (${taskCountsByStatus?.inProgress || '0'})`,
                  panel: (
                    <>
                      <h2 className="govuk-heading-l">In progress tasks</h2>
                      <TasksTab
                        taskStatus={TASK_STATUS_IN_PROGRESS}
                        filtersToApply={filtersToApply}
                        targetTaskCount={taskCountsByStatus?.inProgress}
                        setError={setError}
                      />
                    </>
                  ),
                },
                {
                  id: TASK_STATUS_TARGET_ISSUED,
                  label: `Issued (${taskCountsByStatus?.issued || '0'})`,
                  panel: (
                    <>
                      <h2 className="govuk-heading-l">Target issued tasks</h2>
                      <TasksTab
                        taskStatus={TASK_STATUS_TARGET_ISSUED}
                        filtersToApply={filtersToApply}
                        targetTaskCount={taskCountsByStatus?.issued}
                        setError={setError}
                      />
                    </>
                  ),
                },
                {
                  id: TASK_STATUS_COMPLETED,
                  label: `Complete (${taskCountsByStatus?.complete || '0'})`,
                  panel: (
                    <>
                      <h2 className="govuk-heading-l">Completed tasks</h2>
                      <TasksTab
                        taskStatus={TASK_STATUS_COMPLETED}
                        filtersToApply={filtersToApply}
                        targetTaskCount={taskCountsByStatus?.complete}
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
