import React from 'react';
import { FONT_CLASSES } from '../../../../../constants';

const renderBlock = (header, items, hasChanged) => {
  return (
    <div className="govuk-!-margin-bottom-2">
      <p className={`govuk-!-margin-bottom-0 font__light ${hasChanged && 'task-versions--highlight'}`}>{header}</p>
      {items && items.map((item, index) => {
        return (
          <p key={index} className={`govuk-!-margin-bottom-0 ${FONT_CLASSES[index % 2]} ${hasChanged && 'task-versions--highlight'}`}>{item}</p>
        );
      })}
    </div>
  );
};

export default renderBlock;

export const renderRow = (header, items) => {
  return (
    <div className="govuk-!-margin-bottom-2">
      <p className="govuk-!-margin-bottom-0 font__light">{header}</p>
      {items && items.map((item, index) => {
        return (
          <p key={index} className="govuk-!-margin-bottom-0 font__bold word-break">{item}</p>
        );
      })}
    </div>
  );
};
