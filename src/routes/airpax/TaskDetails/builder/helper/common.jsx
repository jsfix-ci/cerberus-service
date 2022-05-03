import React from 'react';
import { FONT_CLASSES } from '../../../../../constants';

const flipClassFlag = (classFlag) => {
  if (classFlag === 0) {
    return 1;
  }
  return 0;
};

const renderBlock = (header, items) => {
  /**
   * Defaulted to value 1 as this will be set to 0
   * on the very first pass. 0 will render bold text
   * where as if the flag is set to 1, will result in
   * regular text being rendered.
   */
  let classFlag = 1;
  return (
    <div className="govuk-!-margin-bottom-2">
      <p className="govuk-!-margin-bottom-0 font__light">{header}</p>
      {items && items.map((item, index) => {
        classFlag = flipClassFlag(classFlag);
        return (
          <p key={index} className={`govuk-!-margin-bottom-0 ${FONT_CLASSES[classFlag]}`}>{item}</p>
        );
      })}
    </div>
  );
};

export default renderBlock;
