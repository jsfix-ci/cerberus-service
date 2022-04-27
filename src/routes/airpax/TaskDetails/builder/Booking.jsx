import React from 'react';

const Booking = ({ booking }) => {
  return (
    <div className="task-details-container">
      <h3 className="title-heading airpax-title-heading">Booking</h3>
      <div className="govuk-task-details-grid-column">
        <div>
          <ul>
            <li className="govuk-grid-key font__light">Reference</li>
            <li className="govuk-grid-value font__bold">_Placeholder_</li>
          </ul>
        </div>
        <div>
          <ul>
            <li className="govuk-grid-key font__light">Number of travellers</li>
            <li className="govuk-grid-value font__bold">_Placeholder_</li>
          </ul>
        </div>
        <div>
          <ul>
            <li className="govuk-grid-key font__light">Booking date</li>
            <li className="govuk-grid-value font__bold">_Placeholder_</li>
          </ul>
        </div>
        <div>
          <ul>
            <li className="govuk-grid-key font__light">Booking country</li>
            <li className="govuk-grid-value font__bold">_Placeholder_</li>
          </ul>
        </div>
        <div>
          <ul>
            <li className="govuk-grid-key font__light">Booking type</li>
            <li className="govuk-grid-value font__bold">_Placeholder_</li>
          </ul>
        </div>
        <div>
          <ul>
            <li className="govuk-grid-key font__light">Ticket number</li>
            <li className="govuk-grid-value font__bold">_Placeholder_</li>
          </ul>
        </div>
        <div>
          <ul>
            <li className="govuk-grid-key font__light">Ticket type</li>
            <li className="govuk-grid-value font__bold">_Placeholder_</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Booking;
