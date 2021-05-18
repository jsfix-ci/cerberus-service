import dayjs from 'dayjs';
import { LONG_DATE_FORMAT, SHORT_DATE_FORMAT } from '../constants';

const formatTaskData = (taskData) => {
  const account = {
    label: 'Account',
    name: taskData?.organisations?.find(({ type }) => type === 'ORGACCOUNT')?.name || 'Unknown',
  };
  const arrival = {
    label: 'Arrival due',
    location: taskData?.voyage?.arriveAt || '',
    date: taskData?.arrivalTime ? dayjs(taskData?.arrivalTime).utc().format(LONG_DATE_FORMAT) : 'unknown',
    description: (taskData?.voyage?.arriveAt ? `${taskData?.voyage?.arriveAt}` : 'unknown') + (taskData?.arrivalTime ? `, ${dayjs(taskData?.arrivalTime).utc().format(LONG_DATE_FORMAT)}` : ', unknown'),
    fromNow: `${taskData?.arrivalTime ? `, ${dayjs(taskData?.arrivalTime).fromNow()}` : 'unknown'}`,
  };
  const departure = {
    label: 'Departure',
    location: taskData?.voyage?.departFrom || '',
    date: taskData?.departureTime ? dayjs(taskData?.departureTime).utc().format(LONG_DATE_FORMAT) : 'unknown',
    description: (taskData?.voyage?.departFrom ? `${taskData?.voyage?.departFrom}` : 'unknown') + (taskData?.departureTime ? `, ${dayjs(taskData?.departureTime).utc().format(LONG_DATE_FORMAT)}` : ', unknown'),
  };
  const driver = {
    dataExists: !!taskData?.people?.find(({ role }) => role === 'DRIVER'),
    name: taskData?.people?.find(({ role }) => role === 'DRIVER')?.fullName || '',
    dateOfBirth: taskData?.people?.find(({ role }) => role === 'DRIVER')?.dateOfBirth && dayjs(taskData?.people?.find(({ role }) => role === 'DRIVER')?.dateOfBirth).format(SHORT_DATE_FORMAT),
  };
  const ferry = {
    label: 'Ferry',
    description: taskData?.voyage?.description || '',
  };
  const haulier = {
    label: 'Haulier',
    name: taskData?.organisations?.find(({ type }) => type === 'ORGHAULIER')?.name || 'Unknown',
  };
  const trailer = {
    dataExists: taskData?.trailers?.length > 0,
    label: taskData?.trailers?.length > 0 ? 'Trailer' : '',
    registration: taskData?.trailers?.length > 0 && taskData?.trailers[0]?.registrationNumber ? taskData?.trailers[0]?.registrationNumber : '',
    description: taskData?.trailers?.length > 0 && taskData?.trailers[0]?.description ? taskData?.trailers[0].description : 'no description',
  };
  const vehicle = {
    dataExists: taskData?.vehicles?.length > 0,
    label: taskData?.vehicles?.length > 0 ? 'Vehicle' : '',
    registration: taskData?.vehicles?.length > 0 && taskData?.vehicles[0]?.registrationNumber ? taskData?.vehicles[0].registrationNumber : '',
    description: taskData?.vehicles?.length > 0 && taskData?.vehicles[0]?.description ? taskData?.vehicles[0].description : 'no description',
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
