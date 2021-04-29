import React from 'react';
import * as pluralise from 'pluralise';
import moment from 'moment';

import Accordion from '../../govuk/Accordion';
import { LONG_DATE_FORMAT, SHORT_DATE_FORMAT } from '../../constants';
import formatTaskVersion from '../../utils/formatTaskVersion';

const TaskVersions = ({ taskVersions }) => (
  <Accordion
    className="task-versions"
    id="task-versions"
    items={taskVersions.slice(0).reverse().map((task, index) => {
      const versionNumber = taskVersions.length - index;
      const {
        account,
        haulier,
        driver,
        passengers,
        vehicle,
        trailer,
        goods,
        booking,
        matchedRules,
        riskIndicators,
      } = formatTaskVersion(task, versionNumber);
      const priority = 'TODO';

      const isCargoHazardous = (boolAsString = null) => {
        if (!boolAsString) {
          return '';
        }
        if (boolAsString === 'false') {
          return 'No';
        }
        return 'Yes';
      };

      return (
        {
          heading: `Version ${versionNumber}`,
          summary: (
            <>
              <div className="task-versions--left">
                <div className="govuk-caption-m">{moment(task?.bookingDateTime || null).format(LONG_DATE_FORMAT)}</div>
              </div>
              <div className="task-versions--right">
                <ul className="govuk-list">
                  <li>{pluralise.withCount(0, '% change', '% changes', 'No changes')} in this version</li>
                  <li>Highest threat level is <strong className="govuk-tag govuk-tag--red">{priority}</strong> from version {versionNumber}</li>
                </ul>
              </div>
            </>
          ),
          children: (
            <>
              <h2 className="govuk-heading-m">Vehicle details</h2>

              <dl className="govuk-summary-list govuk-!-margin-bottom-9">
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Registration number</dt>
                  <dd className="govuk-summary-list__value">{vehicle?.vehicle?.registrationNumber}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Type</dt>
                  <dd className="govuk-summary-list__value">{vehicle?.attributes?.attrs?.type}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Make</dt>
                  <dd className="govuk-summary-list__value">{vehicle?.vehicle?.make}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Model</dt>
                  <dd className="govuk-summary-list__value">{vehicle?.vehicle?.model}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Country of registration</dt>
                  <dd className="govuk-summary-list__value">{vehicle?.vehicle?.registrationCountry}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Trailer registration number</dt>
                  <dd className="govuk-summary-list__value">{trailer?.vehicle?.registrationNumber}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Trailer type</dt>
                  <dd className="govuk-summary-list__value">{trailer?.attributes?.attrs?.type}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Trailer country of registration</dt>
                  <dd className="govuk-summary-list__value">{trailer?.vehicle?.registrationCountry}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Empty or loaded</dt>
                  <dd className="govuk-summary-list__value">{trailer?.attributes?.attrs?.statusOfLoading}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Trailer length</dt>
                  <dd className="govuk-summary-list__value">{trailer?.attributes?.attrs?.length}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Trailer height</dt>
                  <dd className="govuk-summary-list__value">{trailer?.attributes?.attrs?.height}</dd>
                </div>
              </dl>

              <h2 className="govuk-heading-m">Account details</h2>

              <dl className="govuk-summary-list govuk-!-margin-bottom-9">
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Full name</dt>
                  <dd className="govuk-summary-list__value">{account.fullName}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Short name</dt>
                  <dd className="govuk-summary-list__value">{account.shortName}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Reference number</dt>
                  <dd className="govuk-summary-list__value">{account.referenceNumber}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Address</dt>
                  <dd className="govuk-summary-list__value">{account.fullAddress}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Telephone</dt>
                  <dd className="govuk-summary-list__value">{account.telephone}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Mobile</dt>
                  <dd className="govuk-summary-list__value">{account.mobile}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Email</dt>
                  <dd className="govuk-summary-list__value">TODO</dd>
                </div>
              </dl>

              <h2 className="govuk-heading-m">Haulier details</h2>

              <dl className="govuk-summary-list govuk-!-margin-bottom-9">
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Name</dt>
                  <dd className="govuk-summary-list__value">{haulier.name}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Address</dt>
                  <dd className="govuk-summary-list__value">{haulier.fullAddress}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Telephone</dt>
                  <dd className="govuk-summary-list__value">{haulier.telephone}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Mobile</dt>
                  <dd className="govuk-summary-list__value">{haulier.mobile}</dd>
                </div>
              </dl>

              <h2 className="govuk-heading-m">Driver</h2>

              <dl className="govuk-summary-list govuk-!-margin-bottom-9">
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Name</dt>
                  <dd className="govuk-summary-list__value">{driver?.person?.fullName}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Date of birth</dt>
                  <dd className="govuk-summary-list__value">{moment(driver?.person?.dateOfBirth || null).format(SHORT_DATE_FORMAT)}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Gender</dt>
                  <dd className="govuk-summary-list__value">{driver?.person?.gender}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Nationality</dt>
                  <dd className="govuk-summary-list__value">{driver?.person?.nationality}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Travel document type</dt>
                  <dd className="govuk-summary-list__value">{driver?.driverDocument?.attributes?.attrs?.documentType}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Travel document number</dt>
                  <dd className="govuk-summary-list__value">{driver?.driverDocument?.document?.value}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Travel document expiry</dt>
                  <dd className="govuk-summary-list__value">{moment(driver?.driverDocument?.document?.expiryDate || null).format(SHORT_DATE_FORMAT)}</dd>
                </div>
              </dl>

              {passengers.length > 0 && <h2 className="govuk-heading-m">Passengers</h2>}

              {passengers.map((passenger) => (
                <dl key={passenger?.person.fullName} className="govuk-summary-list govuk-!-margin-bottom-9">
                  <div className="govuk-summary-list__row">
                    <dt className="govuk-summary-list__key">Name</dt>
                    <dd className="govuk-summary-list__value">{passenger?.person?.fullName}</dd>
                  </div>
                  <div className="govuk-summary-list__row">
                    <dt className="govuk-summary-list__key">Date of birth</dt>
                    <dd className="govuk-summary-list__value">{moment(passenger?.person?.dateOfBirth || null).format(SHORT_DATE_FORMAT)}</dd>
                  </div>
                  <div className="govuk-summary-list__row">
                    <dt className="govuk-summary-list__key">Gender</dt>
                    <dd className="govuk-summary-list__value">{passenger?.person?.gender}</dd>
                  </div>
                  <div className="govuk-summary-list__row">
                    <dt className="govuk-summary-list__key">Nationality</dt>
                    <dd className="govuk-summary-list__value">{passenger?.person?.nationality}</dd>
                  </div>
                  <div className="govuk-summary-list__row">
                    <dt className="govuk-summary-list__key">Travel document type</dt>
                    <dd className="govuk-summary-list__value">{passenger?.passengerDocument?.attributes?.attrs?.documentType}</dd>
                  </div>
                  <div className="govuk-summary-list__row">
                    <dt className="govuk-summary-list__key">Travel document number</dt>
                    <dd className="govuk-summary-list__value">{passenger?.passengerDocument?.document?.value}</dd>
                  </div>
                  <div className="govuk-summary-list__row">
                    <dt className="govuk-summary-list__key">Travel document expiry</dt>
                    <dd className="govuk-summary-list__value">{moment(passenger?.passengerDocument?.document?.expiryDate || null).format(SHORT_DATE_FORMAT)}</dd>
                  </div>
                </dl>
              ))}

              <h2 className="govuk-heading-m">Goods</h2>

              <dl className="govuk-summary-list govuk-!-margin-bottom-9">
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Description of goods</dt>
                  <dd className="govuk-summary-list__value">{goods?.attributes?.attrs?.descriptionOfCargo}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Is cargo hazardous?</dt>
                  <dd className="govuk-summary-list__value">{isCargoHazardous(goods?.attributes?.attrs?.hazardousCargo)}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Weight of goods</dt>
                  <dd className="govuk-summary-list__value">TODO</dd>
                </div>
              </dl>

              <h2 className="govuk-heading-m">Booking</h2>

              <dl className="govuk-summary-list govuk-!-margin-bottom-9">
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Reference</dt>
                  <dd className="govuk-summary-list__value">{booking?.attributes?.attrs?.reference}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Ticket number</dt>
                  <dd className="govuk-summary-list__value">TODO</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Type</dt>
                  <dd className="govuk-summary-list__value">TODO</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Name</dt>
                  <dd className="govuk-summary-list__value">TODO</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Address</dt>
                  <dd className="govuk-summary-list__value">TODO</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Date and time</dt>
                  <dd className="govuk-summary-list__value">TODO</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Country</dt>
                  <dd className="govuk-summary-list__value">{booking?.attributes?.attrs?.countryOfBooking}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Payment method</dt>
                  <dd className="govuk-summary-list__value">{booking?.attributes?.attrs?.paymentMethod}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Ticket price</dt>
                  <dd className="govuk-summary-list__value">TODO</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Ticket type</dt>
                  <dd className="govuk-summary-list__value">{booking?.attributes?.attrs?.ticketType}</dd>
                </div>
              </dl>

              <h2 className="govuk-heading-m">Consignee details</h2>

              <dl className="govuk-summary-list govuk-!-margin-bottom-9">
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Name</dt>
                  <dd className="govuk-summary-list__value">TODO</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Address</dt>
                  <dd className="govuk-summary-list__value">TODO</dd>
                </div>
              </dl>

              <h2 className="govuk-heading-m">Consignor details</h2>

              <dl className="govuk-summary-list govuk-!-margin-bottom-9">
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Name</dt>
                  <dd className="govuk-summary-list__value">TODO</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Address</dt>
                  <dd className="govuk-summary-list__value">TODO</dd>
                </div>
              </dl>

              {matchedRules.length > 0 && <h2 className="govuk-heading-m">Rules matched</h2>}

              {matchedRules.map((rule) => (
                <dl key={rule.ruleName} className="govuk-summary-list govuk-!-margin-bottom-9">
                  <div className="govuk-summary-list__row">
                    <dt className="govuk-summary-list__key">Name</dt>
                    <dd className="govuk-summary-list__value">{rule?.ruleName}</dd>
                  </div>
                  <div className="govuk-summary-list__row">
                    <dt className="govuk-summary-list__key">Category</dt>
                    <dd className="govuk-summary-list__value">TODO</dd>
                  </div>
                  <div className="govuk-summary-list__row">
                    <dt className="govuk-summary-list__key">Version</dt>
                    <dd className="govuk-summary-list__value">{rule?.ruleVersion}</dd>
                  </div>
                  <div className="govuk-summary-list__row">
                    <dt className="govuk-summary-list__key">Abuse type</dt>
                    <dd className="govuk-summary-list__value">{rule?.abuseType}</dd>
                  </div>
                  <div className="govuk-summary-list__row">
                    <dt className="govuk-summary-list__key">Agency</dt>
                    <dd className="govuk-summary-list__value">TODO</dd>
                  </div>
                  <div className="govuk-summary-list__row">
                    <dt className="govuk-summary-list__key">Description</dt>
                    <dd className="govuk-summary-list__value">{rule?.ruleDescription}</dd>
                  </div>
                </dl>
              ))}

              {riskIndicators.length
                && (
                  <table className="govuk-table">
                    <caption className="govuk-table__caption govuk-table__caption--m">Risk indicators ({riskIndicators.length})</caption>
                    <thead className="govuk-table__head">
                      <tr className="govuk-table__row">
                        <th scope="col" className="govuk-table__header">Type</th>
                        <th scope="col" className="govuk-table__header">Condition 1</th>
                        <th scope="col" className="govuk-table__header">Expression</th>
                        <th scope="col" className="govuk-table__header">Condition 2</th>
                      </tr>
                    </thead>
                    <tbody className="govuk-table__body">
                      {riskIndicators.map((risk) => (
                        <tr key={risk.selectorReference} className="govuk-table__row">
                          <td className="govuk-table__cell">TODO</td>
                          <td className="govuk-table__cell">TODO</td>
                          <td className="govuk-table__cell">TODO</td>
                          <td className="govuk-table__cell">TODO</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
            </>
          ),
        }
      );
    })}
  />
);

export default TaskVersions;
