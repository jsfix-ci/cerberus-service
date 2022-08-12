import React from 'react';
import { FONT_CLASSES } from '../../../../../utils/constants';

const renderBlock = (header, items) => {
  return (
    <div className="govuk-!-margin-bottom-2">
      <p className="govuk-!-margin-bottom-0 font__light">{header}</p>
      {items && items.map((item, index) => {
        return (
          <p key={index} className={`govuk-!-margin-bottom-0 ${FONT_CLASSES[index % 2]}`}>{item}</p>
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
