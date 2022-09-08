import React from 'react';

// Ordered in how it is to be rendered.
const COUNT_KEYS = [
  'numberOfInfants',
  'numberOfChildren',
  'numberOfAdults',
  'numberOfOaps',
  'numberOfUnknowns',
];

const TABLE_ROW_LABELS = {
  numberOfInfants: 'Infants',
  numberOfChildren: 'Children',
  numberOfAdults: 'Adults',
  numberOfOaps: 'OAPs',
};

const toKnownCounts = (occupantCounts, keys) => {
  return null;
};

const containsOneNonZeroCount = (occupantCounts) => {
  if (!occupantCounts) {
    return false;
  }
  return COUNT_KEYS.some((k) => occupantCounts[k] > 0);
};

const OccupantCount = ({ mode, primaryTraveller, coTravellers, occupantCounts }) => {
  // If there is no driver and no co-travellers and has one non-zero count.
  if (primaryTraveller && coTravellers?.length && containsOneNonZeroCount(occupantCounts)) { // TODO: FOR TESTING LOCALLY
  // if (!primaryTraveller && !coTravellers?.length && containsOneNonZeroCount(occupantCounts)) {
    // Show all counts using COUNT_KEYS
    return toKnownCounts(occupantCounts, COUNT_KEYS.filter((k) => k !== 'numberOfUnknowns'));
  }

  // If there is a driver and no co-travellers and has one non-zero count.
  if (primaryTraveller && !coTravellers?.length && containsOneNonZeroCount(occupantCounts)) {
    return toKnownCounts(occupantCounts, COUNT_KEYS.filter((k) => k !== 'numberOfUnknowns'));
  }

  // If there is no driver and no co-travellers and does not contain a single non-zero count.
  if (!primaryTraveller && !coTravellers?.length && !containsOneNonZeroCount(occupantCounts)) {
    // Show unknown counts
    return null;
  }
  return null;
};

export default OccupantCount;
