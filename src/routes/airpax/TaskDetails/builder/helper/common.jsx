import React from 'react';

const renderBlock = (header, items) => {
  return (
    <ul>
      <li className="govuk-grid-key font__light">{header}</li>
      {items && items.map((item, index) => (
        <li key={index} className="govuk-grid-value font__bold">{item}</li>
      ))}
    </ul>
  );
};

export default renderBlock;
