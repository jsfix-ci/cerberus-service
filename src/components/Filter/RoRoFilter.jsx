import FormRenderer from '@ukhomeoffice/cop-react-form-renderer';
import React from 'react';

import FormUtils from '../../utils/Form/ReactForm';
import setupFilterCounts from './helper/setupCounts';

import { roro } from '../../forms/filters';

const getMovementSelectorCounts = (filtersAndSelectorsCount) => {
  return {
    movementModeCounts: filtersAndSelectorsCount?.slice(0, 3),
    modeSelectorCounts: filtersAndSelectorsCount?.slice(3),
  };
};

const RoRoFilter = ({ taskStatus,
  currentUser,
  onApply,
  appliedFilters,
  filtersAndSelectorsCount,
  handleFilterReset }) => {
  const { movementModeCounts, modeSelectorCounts } = getMovementSelectorCounts(filtersAndSelectorsCount);

  const onApplyFilter = async (_, payload, onSuccess) => {
    onSuccess(payload);
    onApply(payload);
  };

  const filterJson = setupFilterCounts(
    roro(currentUser, FormUtils.showAssigneeComponent(taskStatus)), taskStatus, movementModeCounts, modeSelectorCounts,
  );

  return (
    <div className="cop-filters-container">
      <div className="cop-filters-header">
        <h2 className="govuk-heading-s">Filters</h2>
        <button
          className="govuk-link govuk-heading-s "
          data-module="govuk-button"
          type="button"
          onClick={(e) => handleFilterReset(e)}
        >
          Clear all filters
        </button>
      </div>
      <div>
        <FormRenderer
          {...filterJson}
          hooks={{
            onSubmit: onApplyFilter,
          }}
          data={appliedFilters}
        />
      </div>
    </div>
  );
};

export default RoRoFilter;
