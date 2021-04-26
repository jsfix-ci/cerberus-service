import moment from 'moment';
import { LONG_DATE_FORMAT, SHORT_DATE_FORMAT } from '../constants';

const formatTaskData = (taskSummaryData) => {
  const account = {
    label: 'Account',
    name: taskSummaryData?.organisations.find(({ type }) => type === 'ORGACCOUNT')?.name || 'Unknown',
  };
  const arrival = {
    label: 'Arrival due',
    location: taskSummaryData?.voyage?.arriveAt,
    date: taskSummaryData?.arrivalTime ? moment(taskSummaryData?.arrivalTime).format(LONG_DATE_FORMAT) : 'unknown',
    description: `${taskSummaryData?.voyage?.arriveAt}${taskSummaryData?.arrivalTime ? `, ${moment(taskSummaryData?.arrivalTime).format(LONG_DATE_FORMAT)}` : ', unknown'}`,
    fromNow: `${taskSummaryData?.arrivalTime ? `, ${moment(taskSummaryData?.arrivalTime).fromNow()}` : 'unknown'}`,
  };
  const departure = {
    label: 'Departure',
    location: taskSummaryData?.voyage?.departFrom,
    date: taskSummaryData?.departureTime ? moment(taskSummaryData?.departureTime).format(LONG_DATE_FORMAT) : 'unknown',
    description: `${taskSummaryData?.voyage?.departFrom}${taskSummaryData?.departureTime ? `, ${moment(taskSummaryData?.departureTime).format(LONG_DATE_FORMAT)}` : ', unknown'}`,
  };
  const driver = {
    dataExists: !!taskSummaryData?.people?.find(({ role }) => role === 'DRIVER'),
    name: taskSummaryData?.people?.find(({ role }) => role === 'DRIVER')?.name || '',
    dateOfBirth: moment(taskSummaryData?.people?.find(({ role }) => role === 'DRIVER')?.dateOfBirth).format(SHORT_DATE_FORMAT) || '',
  };
  const ferry = {
    label: 'Ferry',
    description: `${taskSummaryData?.voyage?.description}`,
  };
  const haulier = {
    label: 'Haulier',
    name: taskSummaryData?.organisations.find(({ type }) => type === 'ORGHAULIER')?.name || 'Unknown',
  };
  const trailer = {
    dataExists: !!taskSummaryData?.trailers.length > 0,
    label: taskSummaryData?.trailers.length > 0 ? 'with trailer' : '',
    registration: taskSummaryData?.trailers[0]?.registrationNumber,
    description: taskSummaryData?.vehicles[0].description ? taskSummaryData?.vehicles[0].description : 'no description',
  };
  const vehicle = {
    dataExists: taskSummaryData?.vehicles.length > 0,
    label: taskSummaryData?.vehicles.length > 0 ? 'Vehicle' : '',
    registration: taskSummaryData?.vehicles[0].registrationNumber,
    description: taskSummaryData?.vehicles[0].description ? taskSummaryData?.vehicles[0].description : 'no description',
  };

  const formattedTaskSummary = {
    account,
    arrival,
    departure,
    driver,
    ferry,
    haulier,
    trailer,
    vehicle,
  };

  return formattedTaskSummary;
};

export default formatTaskData;
