import React, { useContext } from 'react';

import { ViewContext } from '../../../context/ViewContext';

import { VIEW } from '../../../utils/Common/commonUtil';

import Filter from '../Custom/Filter';
import { airpax, roro } from '../../../forms/filters';
import FormUtils from '../../../utils/Form/ReactForm';
import { StorageUtil } from '../../../utils';
import { LOCAL_STORAGE_KEYS } from '../../../utils/constants';

const getFilter = (
  currentUser,
  taskStatus,
  data,
  filtersAndSelectorsCount,
  customOptions,
  onApply,
  handleFilterReset,
) => {
  const { getView } = useContext(ViewContext);

  return (
    <>
      {getView() === VIEW.AIRPAX && (
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
          rules: customOptions.rules,
        }}
        onApply={onApply}
        handleFilterReset={handleFilterReset}
      />
      )}
      {getView() === VIEW.RORO_V2 && (
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
      )}
    </>
  );
};

export default getFilter;
