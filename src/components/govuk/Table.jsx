import React from 'react';

const Table = ({ headings, rows }) => {
  let tableHeadings = headings
    ? (
      <tr className="govuk-table__row">
        {
          headings.map((heading, index) => (
            <th key={index} className="govuk-table__header">{heading}</th>
          ))
        }
      </tr>
    )
    : null;

  let tableRows = rows
    ? rows.map((row, index) => (
      <tr key={index} className="govuk-table__row">
        <th className="govuk-table__header">{row.shift()}</th>
        {
          row.map((rowItem, itemIndex) => (
            <td key={itemIndex} className="govuk-table__cell">{rowItem}</td>
          ))
        }
      </tr>
    ))
    : null;

  return (
    <table className="govuk-table">
      {
        tableHeadings
          ? <thead className="govuk-table__head">{tableHeadings}</thead>
          : null
      }
      {
        tableRows
          ? <tbody className="govuk-table__body">{tableRows}</tbody>
          : null
      }
    </table>
  );
};

export default Table;
