import React from 'react';
import { FONT_CLASSES } from '../../../utils/constants';

const renderBlock = (header, items) => {
  return (
    <div className="govuk-!-margin-bottom-2">
      <p className="govuk-!-margin-bottom-0 font__light">{header}</p>
      {items && items.map((item, index) => {
        // eslint-disable-next-line no-prototype-builtins
        if (typeof item === 'object' && !item.hasOwnProperty('_owner')) {
          const { content, entitySearchURL } = item;
          return (
            <p key={index} className={`govuk-!-margin-bottom-0 ${FONT_CLASSES[index % 2]}`}>
              {entitySearchURL ? <a href={entitySearchURL} target="_blank" rel="noreferrer noopener">{content}</a> : content}
            </p>
          );
        }
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
