import React from 'react';

import { VIEW } from '../../../utils/Common/commonUtil';

import Filter from './Filter';

import FormUtils from '../../../utils/Form/ReactForm';
import { StorageUtil } from '../../../utils';
import { LOCAL_STORAGE_KEYS } from '../../../utils/constants';

import { airpax, roro } from '../../../forms/filters';

const getFilter = (
  view,
  currentUser,
  taskStatus,
  data,
  filtersAndSelectorsCount,
  customOptions,
  onApply,
  handleFilterReset,
) => {
  switch (view) {
    case VIEW.AIRPAX: {
      return (
        <Filter
          form={airpax(currentUser,
            FormUtils.showAssigneeComponent(StorageUtil.getTaskStatus(LOCAL_STORAGE_KEYS.TASK_STATUS)))}
          taskStatus={taskStatus}
          data={data}
          filtersAndSelectorsCount={{
            movementModeCounts: filtersAndSelectorsCount?.slice(0, 1),
            modeSelectorCounts: filtersAndSelectorsCount?.slice(1),
          }}
          customOptions={{
            rules: customOptions?.rules,
          }}
          onApply={onApply}
          handleFilterReset={handleFilterReset}
        />
      );
    }
    case VIEW.RORO_V2: {
      return (
        <Filter
          form={roro(currentUser,
            FormUtils.showAssigneeComponent(StorageUtil.getTaskStatus(LOCAL_STORAGE_KEYS.TASK_STATUS)))}
          taskStatus={taskStatus}
          data={data}
          filtersAndSelectorsCount={{
            movementModeCounts: filtersAndSelectorsCount?.slice(0, 3),
            modeSelectorCounts: filtersAndSelectorsCount?.slice(3),
          }}
          onApply={onApply}
          handleFilterReset={handleFilterReset}
        />
      );
    }
    default: {
      return null;
    }
  }
};

export default getFilter;
