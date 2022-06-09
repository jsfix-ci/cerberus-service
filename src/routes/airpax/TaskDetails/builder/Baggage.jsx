import React from 'react';

import {
  BaggageUtil,
  PersonUtil,
} from '../../utils';
import renderBlock, { renderRow } from './helper/common';

const Baggage = ({ version }) => {
  const baggage = BaggageUtil.get(version);
  const otherPersons = PersonUtil.getOthers(version);
  return (
    <div className="task-details-container">
      <h3 className="govuk-heading-m govuk-!-margin-top-0">Baggage</h3>
      { otherPersons && (
        <p className="font__light">This booking is for multiple travellers. Check the travellers list for baggage allocations.</p>
      )}
      <div className="govuk-task-details-grid-column">
        {renderBlock('Checked bags', [BaggageUtil.checkedCount(baggage)])}
        {renderBlock('Total weight', [BaggageUtil.weight(baggage)])}
      </div>
      <div>
        {renderRow('Tag number', [BaggageUtil.tags(baggage)])}
      </div>
    </div>
  );
};

export default Baggage;
