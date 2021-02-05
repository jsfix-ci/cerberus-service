import React from 'react';
import classNames from 'classnames';
import FormGroup from './FormGroup';
import Input from './Input';

/**
 * React implementation of GOV.UK Design System Date Input
 * Demo: https://design-system.service.gov.uk/components/date-input/
 * Code: https://github.com/alphagov/govuk-frontend/blob/master/package/govuk/components/date-input/README.md
 */

const DateInput = ({
  id, namePrefix, className, dayInput = {}, monthInput = {}, yearInput = {}, legend,
  fieldset = {}, formGroup = {}, errorMessage, hint, describedBy, ...attributes
}) => {
  const inputsToRender = [];
  if (dayInput) {
    inputsToRender.push({
      label: 'Day',
      name: 'day',
      className: classNames('govuk-input--width-2', { 'govuk-input--error': errorMessage }),
      type: 'text',
      ...dayInput,
    });
  }
  if (monthInput) {
    inputsToRender.push({
      label: 'Month',
      name: 'month',
      className: classNames('govuk-input--width-2', { 'govuk-input--error': errorMessage }),
      type: 'text',
      ...monthInput,
    });
  }
  if (yearInput) {
    inputsToRender.push({
      label: 'Year',
      name: 'year',
      className: classNames('govuk-input--width-4', { 'govuk-input--error': errorMessage }),
      type: 'text',
      ...yearInput,
    });
  }

  return (
    <FormGroup
      inputId={id}
      hint={hint}
      fieldset={{ legend, ...fieldset }}
      errorMessage={errorMessage}
      describedBy={describedBy}
      {...formGroup}
    >
      <div className={classNames('govuk-date-input', className)} {...attributes}>
        {inputsToRender.map(({
          reactListKey: itemKey,
          label: itemLabel,
          id: itemId,
          name: itemName,
          pattern: itemPattern = '[0-9]*',
          value: itemValue,
          className: itemClassName,
          ...item
        }, index) => (
          <div key={itemKey || index} className="govuk-date-input__item">
            <Input
              label={{
                children: itemLabel,
                className: 'govuk-date-input__label',
              }}
              id={itemId || (`${id}-${itemName}`)}
              className={classNames('govuk-date-input__input', itemClassName)}
              name={namePrefix ? namePrefix + itemName : itemName}
              value={itemValue}
              type="number"
              pattern={itemPattern}
              {...item}
            />
          </div>
        ))}
      </div>
    </FormGroup>
  );
};

export default DateInput;
