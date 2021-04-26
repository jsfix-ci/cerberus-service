import moment from 'moment';
import { LONG_DATE_FORMAT } from '../constants';

const formatTaskData = (taskSummaryData) => {
  const accountValue = taskSummaryData?.organisations.find(({ type }) => type === 'ORGACCOUNT')?.name;
  const driver = taskSummaryData?.people?.find(({ role }) => role === 'DRIVER')?.name || '';
  const haulierValue = taskSummaryData?.organisations.find(({ type }) => type === 'ORGHAULIER')?.name;
  const trailerRegistration = taskSummaryData?.trailers[0]?.registrationNumber;
  const trailerTitle = taskSummaryData?.trailers.length > 0 ? 'with trailer' : '';
  const vehicleRegistration = taskSummaryData?.vehicles[0].registrationNumber;
  const vehicleTitle = taskSummaryData?.vehicles.length > 0 ? 'Vehicle' : '';

  // List section consts
  const ferry = {
    label: 'Ferry',
    value: `${taskSummaryData?.voyage?.description}`,
  };
  const departure = {
    label: 'Departure',
    value: `${taskSummaryData?.voyage?.departFrom}${taskSummaryData?.departureTime ? `, ${moment(taskSummaryData?.departureTime).format(LONG_DATE_FORMAT)}` : ''}`,
  };
  const arrival = {
    label: 'Arrival due',
    value: `${taskSummaryData?.voyage?.arriveAt}${taskSummaryData?.arrivalTime ? `, ${moment(taskSummaryData?.arrivalTime).format(LONG_DATE_FORMAT)}` : ''}`,
  };
  const account = {
    label: 'Account',
    value: accountValue || '',
  };
  const haulier = {
    label: 'Haulier',
    value: haulierValue || '',
  };

  const formattedTaskSummary = {
    accountValue,
    driver,
    haulierValue,
    trailerRegistration,
    trailerTitle,
    vehicleRegistration,
    vehicleTitle,
    ferry,
    departure,
    arrival,
    account,
    haulier,
  };

  return formattedTaskSummary;
};

export default formatTaskData;
