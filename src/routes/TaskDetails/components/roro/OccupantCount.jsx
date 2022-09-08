import React from 'react';
import classNames from 'classnames';

import { MOVEMENT_MODES } from '../../../../utils/constants';

import { NumberUtil } from '../../../../utils';

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

const toCountsBlock = (occupantCounts, keys) => {
  return keys.map((k, index) => {
    const classnames = NumberUtil.greaterThanZero(occupantCounts[k]) ? ['font__bold'] : ['font__grey'];
    return (
      <div className={classNames('govuk-task-details-grid-row bottom-border', classnames)} key={index}>
        <span className="govuk-grid-key">
          {TABLE_ROW_LABELS[k]}
        </span>
        <span className="govuk-grid-value">
          {occupantCounts[k]}
        </span>
      </div>
    );
  });
};

const containsOneNonZeroCount = (occupantCounts) => {
  if (!occupantCounts) {
    return false;
  }
  return COUNT_KEYS.some((k) => occupantCounts[k] > 0);
};

const OccupantCount = ({ mode, primaryTraveller, coTravellers, occupantCounts, classModifiers }) => {
  if ([MOVEMENT_MODES.ACCOMPANIED_FREIGHT, MOVEMENT_MODES.TOURIST].includes(mode)) {
    let jsxBlock = null;
    if (!primaryTraveller && !coTravellers?.length && containsOneNonZeroCount(occupantCounts)) {
      jsxBlock = toCountsBlock(occupantCounts, COUNT_KEYS.filter((k) => k !== 'numberOfUnknowns'));
    }

    if (primaryTraveller && !coTravellers?.length && containsOneNonZeroCount(occupantCounts)) {
      jsxBlock = toCountsBlock(occupantCounts, COUNT_KEYS.filter((k) => k !== 'numberOfUnknowns'));
    }

    if (!primaryTraveller && !coTravellers?.length && !containsOneNonZeroCount(occupantCounts)) {
      jsxBlock = toCountsBlock(occupantCounts, COUNT_KEYS.filter((k) => k === 'numberOfUnknowns'));
    }
    if (jsxBlock) {
      return (
        <>
          <h3 className="govuk-heading-m govuk-!-margin-top-0">Occupants</h3>
          <div className={classNames('govuk-task-details-counts-container', classModifiers)}>
            <div className="govuk-task-details-grid-row bottom-border">
              <span className="govuk-grid-key font__light">Category</span>
              <span className="govuk-grid-value font__light">Number</span>
            </div>
            <div className="task-details-container">
              {jsxBlock}
            </div>
          </div>
        </>
      );
    }
  }
  return null;
};

export default OccupantCount;
