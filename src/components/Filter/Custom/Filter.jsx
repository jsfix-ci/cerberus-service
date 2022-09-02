import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Button, ButtonGroup, ErrorSummary } from '@ukhomeoffice/cop-react-components';

import getComponent from './getComponent';
import setupComponent from './setupComponent';
import setupFilterCounts from '../helper/setupCounts';

const Filter = ({ form: _form,
  taskStatus,
  data,
  filtersAndSelectorsCount,
  customOptions,
  onApply,
  handleFilterReset }) => {
  const [errorList, setErrorList] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [value, setValue] = useState(data);

  const { movementModeCounts, modeSelectorCounts } = filtersAndSelectorsCount;

  const form = setupFilterCounts(_form, taskStatus, movementModeCounts, modeSelectorCounts);

  const onChange = ({ target }) => {
    setValue((prev) => {
      return { ...prev, [target.name]: target.value };
    });
  };

  const validate = () => {
    const errors = [];
    form.pages.forEach((page) => page.components.forEach((component) => {
      if (component?.required && !value[component.fieldId]?.length) {
        errors.push({ id: component.id,
          error: `${component?.label || component?.fieldId} is required` });
      }
    }));
    if (errors.length) {
      setErrorList(errors);
      setHasError(true);
      return false;
    }
    setErrorList([]);
    setHasError(false);
    return true;
  };

  useEffect(() => {
    if (data !== value) {
      setValue(data);
    }
  }, [data]);

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
        {form.pages[0].components.map((component, index) => {
          const { wrapperOptions, componentOptions } = setupComponent(value, component, customOptions, onChange);
          return getComponent(index, component, wrapperOptions, componentOptions);
        })}
        <ButtonGroup>
          <Button onClick={() => {
            if (validate()) {
              onApply(value);
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
