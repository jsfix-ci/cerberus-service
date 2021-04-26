import moment from 'moment';
import { LONG_DATE_FORMAT, SHORT_DATE_FORMAT } from '../constants';

const formatTaskData = (taskSummaryData) => {
  const account = {
    label: 'Account',
    name: taskSummaryData?.organisations.find(({ type }) => type === 'ORGACCOUNT')?.name || 'Unknown',
  };
  const arrival = {
    label: 'Arrival due',
    location: taskSummaryData?.voyage?.arriveAt || '',
    date: taskSummaryData?.arrivalTime ? moment(taskSummaryData?.arrivalTime).format(LONG_DATE_FORMAT) : 'unknown',
    description: (taskSummaryData?.voyage?.arriveAt ? `${taskSummaryData?.voyage?.arriveAt}` : 'unknown') + (taskSummaryData?.arrivalTime ? `, ${moment(taskSummaryData?.arrivalTime).format(LONG_DATE_FORMAT)}` : ', unknown'),
    fromNow: `${taskSummaryData?.arrivalTime ? `, ${moment(taskSummaryData?.arrivalTime).fromNow()}` : 'unknown'}`,
  };
  const departure = {
    label: 'Departure',
    location: taskSummaryData?.voyage?.departFrom || '',
    date: taskSummaryData?.departureTime ? moment(taskSummaryData?.departureTime).format(LONG_DATE_FORMAT) : 'unknown',
    description: (taskSummaryData?.voyage?.departFrom ? `${taskSummaryData?.voyage?.departFrom}` : 'unknown') + (taskSummaryData?.departureTime ? `, ${moment(taskSummaryData?.departureTime).format(LONG_DATE_FORMAT)}` : ', unknown'),
  };
  const driver = {
    dataExists: !!taskSummaryData?.people?.find(({ role }) => role === 'DRIVER'),
    name: taskSummaryData?.people?.find(({ role }) => role === 'DRIVER')?.fullName || '',
    dateOfBirth: taskSummaryData?.people?.find(({ role }) => role === 'DRIVER')?.dateOfBirth && moment(taskSummaryData?.people?.find(({ role }) => role === 'DRIVER')?.dateOfBirth).format(SHORT_DATE_FORMAT),
  };
  const ferry = {
    label: 'Ferry',
    description: taskSummaryData?.voyage?.description || '',
  };
  const haulier = {
    label: 'Haulier',
    name: taskSummaryData?.organisations.find(({ type }) => type === 'ORGHAULIER')?.name || 'Unknown',
  };
  const trailer = {
    dataExists: taskSummaryData?.trailers?.length > 0,
    label: taskSummaryData?.trailers?.length > 0 ? 'Trailer' : '',
    registration: taskSummaryData?.trailers?.length > 0 && taskSummaryData?.trailers[0]?.registrationNumber ? taskSummaryData?.trailers[0]?.registrationNumber : '',
    description: taskSummaryData?.trailers?.length > 0 && taskSummaryData?.trailers[0]?.description ? taskSummaryData?.trailers[0].description : 'no description',
  };
  const vehicle = {
    dataExists: taskSummaryData?.vehicles?.length > 0,
    label: taskSummaryData?.vehicles?.length > 0 ? 'Vehicle' : '',
    registration: taskSummaryData?.vehicles?.length > 0 && taskSummaryData?.vehicles[0]?.registrationNumber ? taskSummaryData?.vehicles[0].registrationNumber : '',
    description: taskSummaryData?.vehicles?.length > 0 && taskSummaryData?.vehicles[0]?.description ? taskSummaryData?.vehicles[0].description : 'no description',
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
