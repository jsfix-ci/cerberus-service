import { get } from 'lodash';

export const poleIdsAvailable = (id, idFlag) => {
  return id
    .split(':')
    .slice(1)
    .join('')
    .split(',')
    .filter((v) => v.includes(`${idFlag}=`));
};
export const findMatchingPoleIds = (id1, id2, flag) => {
  if (!id1 || !id2) {
    return null;
  }
  const tmp = poleIdsAvailable(id2, flag);
  return poleIdsAvailable(id1, flag).some((ele) => tmp.includes(ele));
};
/*
 * If 'path' specified is found, the 'get' returns the 'type' from the 'obj'
 * This is used to compare against the value of 'type'
 * e.g. 'LOCTEL' === 'TEST-TYPE'
 * If not found the 'get' returns the default value
 * This is used when no comparison is required in the first part of the conditon
 * and the comparison will always return true
 * e.g. 'default-value' === 'default-value'
*/
export const objectLookup = (arr, compId, flag, path = null, type = 'default-value') => (
  arr.find((obj) => (
    get(obj, path, 'default-value') === type
    && findMatchingPoleIds(
      obj.party.poleId.v2.id,
      compId,
      flag,
    )
  ))
);

export default (task, version) => {
  const versionIndex = version - 1;
  const orgAccount = task?.orgHistory[versionIndex].find(({ organisation: { type } }) => type === 'ORGACCOUNT') || {};
  const orgHaulier = task?.orgHistory[versionIndex].find(({ organisation: { type } }) => type === 'ORGHAULIER') || {};
  const personDriver = task?.personHistory[versionIndex].find(({ attributes: { attrs: { role } } }) => role === 'DRIVER') || {};
  const personPassengers = task?.personHistory[versionIndex].filter(({ attributes: { attrs: { role } } }) => role === 'PASSENGER') || [];
  return {
    account: {
      fullName: orgAccount?.organisation?.name,
      shortName: orgAccount?.attributes?.attrs?.shortName,
      referenceNumber: orgAccount?.organisation?.registrationNumber,
      fullAddress: objectLookup(
        task?.addressHistory[versionIndex],
        orgAccount?.metadata?.identityRecord?.poleId?.v2?.id,
        'P',
      )?.address?.fullAddress,
      telephone: objectLookup(
        task?.contactHistory[versionIndex],
        orgAccount?.metadata?.identityRecord?.poleId?.v2?.id,
        'P',
        'contact.type',
        'LOCTEL',
      )?.contact?.value,
      mobile: objectLookup(
        task?.contactHistory[versionIndex],
        orgAccount?.metadata?.identityRecord?.poleId?.v2?.id,
        'P',
        'contact.type',
        'LOCTELMOB',
      )?.contact?.value,
    },
    haulier: {
      name: orgHaulier?.organisation?.name,
      fullAddress: objectLookup(
        task?.addressHistory[versionIndex],
        orgHaulier?.metadata?.identityRecord?.poleId?.v2?.id,
        'P',
      )?.address?.fullAddress,
      telephone: objectLookup(
        task?.contactHistory[versionIndex],
        orgHaulier?.metadata?.identityRecord?.poleId?.v2?.id,
        'P',
        'contact.type',
        'LOCTEL',
      )?.contact?.value,
      mobile: objectLookup(
        task?.contactHistory[versionIndex],
        orgHaulier?.metadata?.identityRecord?.poleId?.v2?.id,
        'P',
        'contact.type',
        'LOCTELMOB',
      )?.contact?.value,
    },
    driver: {
      ...personDriver,
      driverDocument: {
        ...objectLookup(
          task?.documentHistory[versionIndex],
          personDriver?.metadata?.identityRecord?.poleId?.v2?.id,
          'P',
        ),
      },
    },
    passengers: personPassengers.map((passenger) => {
      passenger.passengerDocument = {
        ...objectLookup(
          task?.documentHistory[versionIndex],
          passenger?.metadata?.identityRecord?.poleId?.v2?.id,
          'P',
        ) || {},
      };
    }),
    vehicle: task?.vehicleHistory[versionIndex].find((v) => v.vehicle.type === 'OBJVEHC') || {},
    trailer: task?.vehicleHistory[versionIndex].find((v) => v.vehicle.type === 'OBJVEHCTRL') || {},
    goods: task?.serviceMovementHistory[versionIndex],
    booking: task?.orgHistory[versionIndex].find(({ organisation: { type } }) => type === 'ORGBOOKER') || {},
    matchedRules: task?.ruleHistory[versionIndex] || [],
    riskIndicators: task?.selectorHistory[versionIndex] || [],
  };
};
