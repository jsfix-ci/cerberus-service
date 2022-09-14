import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Button, ButtonGroup, ErrorSummary } from '@ukhomeoffice/cop-react-components';

import cleanPayload from './Data/cleanPayload';
import getComponent from './Component/getComponent';
import getVisibleComponents from './Component/getVisibleComponents';
import setupComponent from './Component/setupComponent';
import setupFilterCounts from '../helper/setupCounts';
import setupRefDataOptions from './Data/setupRefDataOptions';

const Filter = ({ form: _form,
  taskStatus,
  data: _data,
  filtersAndSelectorsCount,
  customOptions: _customOptions,
  onApply: _onApply,
  handleFilterReset }) => {
  const [errorList, setErrorList] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [data, setData] = useState(_data);

  const { movementModeCounts, modeSelectorCounts, directionCounts, flightStatusCounts } = filtersAndSelectorsCount;

  const form = setupFilterCounts(_form, taskStatus, movementModeCounts, modeSelectorCounts, directionCounts, flightStatusCounts);
  setupRefDataOptions(form.pages[0].components);
  const visibleComponents = getVisibleComponents(form.pages[0].components, data);

  const onChange = ({ target }) => {
    setData((prev) => {
      return { ...prev, [target.name]: target.value };
    });
  };

  const validate = () => {
    const errors = [];
    visibleComponents.forEach((component) => {
      if (component?.required && !data[component.fieldId]?.length) {
        errors.push({ id: component.id,
          error: `${component?.label || component?.fieldId} is required` });
      }
    });
    if (errors.length) {
      setErrorList(errors);
      setHasError(true);
      return false;
    }
    setErrorList([]);
    setHasError(false);
    return true;
  };

  const onApply = () => {
    const payload = cleanPayload(visibleComponents, visibleComponents, data);
    _onApply(payload);
  };

  useEffect(() => {
    if (_data !== data) {
      setData(_data);
    }
  }, [_data]);

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
        {hasError && <ErrorSummary errors={errorList} />}
        {visibleComponents.map((component, index) => {
          const { wrapperOptions, componentOptions } = setupComponent(data, component, _customOptions, onChange);
          return getComponent(index, component, wrapperOptions, componentOptions);
        })}
        <ButtonGroup>
          <Button onClick={() => {
            if (validate()) {
              onApply();
            }
          }}
          >Apply
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
};

Filter.propTypes = {
  form: PropTypes.shape({}).isRequired,
  taskStatus: PropTypes.string.isRequired,
  data: PropTypes.shape({}),
  filtersAndSelectorsCount: PropTypes.shape({
    movementModeCounts: PropTypes.arrayOf(PropTypes.object),
    modeSelectorCounts: PropTypes.arrayOf(PropTypes.object),
    flightStatusCounts: PropTypes.arrayOf(PropTypes.object),
  }),
  customOptions: PropTypes.shape({}),
  onApply: PropTypes.func.isRequired,
  handleFilterReset: PropTypes.func.isRequired,
};

Filter.defaultProps = {
  data: PropTypes.shape({}),
  filtersAndSelectorsCount: PropTypes.shape({}),
  customOptions: PropTypes.shape({}),
};

export default Filter;
