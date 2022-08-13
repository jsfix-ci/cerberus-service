// Third party imports
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';

// App imports
import { DATE_FORMATS } from '../constants';

dayjs.extend(relativeTime);
dayjs.extend(utc);

const formatTaskData = (taskData) => {
  const account = {
    label: 'Account',
    name: taskData?.organisations?.find(({ type }) => type === 'ORGACCOUNT')?.name || 'Unknown',
  };
  const arrival = {
    label: 'Arrival due',
    location: taskData?.voyage?.arriveAt || '',
    date: taskData?.arrivalTime ? dayjs.utc(taskData?.arrivalTime).format(DATE_FORMATS.LONG) : 'unknown',
    description: (taskData?.voyage?.arriveAt ? `${taskData?.voyage?.arriveAt}` : 'unknown') + (taskData?.arrivalTime ? `, ${dayjs.utc(taskData?.arrivalTime).format(DATE_FORMATS.LONG)}` : ', unknown'),
    fromNow: `${taskData?.arrivalTime ? `, ${dayjs.utc(taskData?.arrivalTime).fromNow()}` : 'unknown'}`,
  };
  const departure = {
    label: 'Departure',
    location: taskData?.voyage?.departFrom || '',
    date: taskData?.departureTime ? dayjs.utc(taskData?.departureTime).format(DATE_FORMATS.LONG) : 'unknown',
    description: (taskData?.voyage?.departFrom ? `${taskData?.voyage?.departFrom}` : 'unknown') + (taskData?.departureTime ? `, ${dayjs.utc(taskData?.departureTime).format(DATE_FORMATS.LONG)}` : ', unknown'),
  };
  const driver = {
    dataExists: !!taskData?.people?.find(({ role }) => role === 'DRIVER'),
    name: taskData?.people?.find(({ role }) => role === 'DRIVER')?.fullName || '',
    dateOfBirth: taskData?.people?.find(({ role }) => role === 'DRIVER')?.dateOfBirth && dayjs(taskData?.people?.find(({ role }) => role === 'DRIVER')?.dateOfBirth).format(DATE_FORMATS.SHORT),
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

const TaskSummaryDataUtil = {
  format: formatTaskData,
};

export default TaskSummaryDataUtil;

export { formatTaskData };
