import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Button, ButtonGroup, ErrorSummary } from '@ukhomeoffice/cop-react-components';

import cleanPayload from './Data/cleanPayload';
import getComponent from './Component/getComponent';
import getVisibleComponent from './Component/getVisibleComponent';
import setupComponent from './Component/setupComponent';
import setupFilterCounts from '../helper/setupCounts';

const Filter = ({ form: _form,
  taskStatus,
  data: _data,
  filtersAndSelectorsCount,
  customOptions,
  onApply: _onApply,
  handleFilterReset }) => {
  const [errorList, setErrorList] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [data, setData] = useState(_data);
  const { movementModeCounts, modeSelectorCounts } = filtersAndSelectorsCount;

  const form = setupFilterCounts(_form, taskStatus, movementModeCounts, modeSelectorCounts);

  const visibleComponents = form.pages[0].components
    .map((component) => getVisibleComponent(component, data)).filter((c) => c);

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
    const cleanedPayload = cleanPayload(visibleComponents, form.pages[0].components, data);
    _onApply(cleanedPayload);
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
          const { wrapperOptions, componentOptions } = setupComponent(data, component, customOptions, onChange);
          return getComponent(index, data, component, wrapperOptions, componentOptions);
        })}
        <ButtonGroup>
          <Button onClick={() => {
            if (validate()) {
              onApply(data);
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
