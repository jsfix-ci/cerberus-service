import React from 'react';
import { Tab, TabList, Tabs, TabPanel } from 'react-tabs';
import { v4 as uuidv4 } from 'uuid';
import '../../../../__assets__/ReactTabs.scss';
import { capitalizeFirstLetter } from '../../../../utils/stringConversion';
import { IndicatorsUtil } from '../../utils';

const renderIndicatorMatches = (indicatorMatches) => {
  return indicatorMatches.map((indicators) => {
    return Object.entries(indicators).map(([key, value], index) => {
      return (
        <div className="panel-content" key={index}>
          <p className="govuk-body govuk-!-font-size-16 govuk-!-font-weight-bold govuk-!-margin-bottom-0">{capitalizeFirstLetter(key)}</p>
          <p className="govuk-body govuk-!-font-size-16">{value}</p>
        </div>
      );
    });
  });
};

const renderOtherGroupFields = (group) => {
  const otherFields = ['requestingOfficer', 'sourceReference', 'category', 'threatType', 'pointOfContactMessage', 'pointOfContact', 'inboundActionCode', 'outboundActionCode', 'notes', 'creator'];
  return Object.keys(group).map((key) => {
    const field = otherFields.includes(key) ? key : false;
    if (field) {
      return (
        <div className="govuk-grid-row">
          <p className="govuk-heading-s govuk-!-margin-bottom-0 govuk-!-font-size-16 govuk-grid-column-one-half">{field}</p>
          <p className="govuk-body govuk-!-margin-bottom-0 govuk-!-font-size-16 govuk-grid-column-one-half govuk-!-padding-0">{group[key]}</p>
        </div>
      );
    }
  });
};

const SelectorMatches = ({ version }) => {
  const groups = IndicatorsUtil.getGroups(version).groups;
  const totalNoOfSelectors = IndicatorsUtil.getGroups(version).totalNumberOfSelectors;

  return (
    <div>
      <h2 className="govuk-heading-m">{totalNoOfSelectors} selector matches</h2>
      { groups?.map((group, index) => {
        return (
          <div key={index} className="govuk-!-margin-bottom-6">
            <h4 className="govuk-heading-s govuk-!-margin-bottom-2 govuk-!-margin-top-2">{group.groupReference}</h4>
            { renderOtherGroupFields(group) }
            <Tabs>
              <TabList key={index}>
                { group.selectors.map((selector, key) => {
                  return (
                    <Tab key={key}>
                      <p className="govuk-heading-s govuk-!-font-size-16">{selector.description}</p>
                      <p className="govuk-!-font-size-14 font-light">{selector.reference}</p>
                    </Tab>
                  );
                })}
              </TabList>

              { group.selectors.map((selector, selectorIndex) => {
                const indicatorMatches = IndicatorsUtil.getMatches(selector);
                const warning = IndicatorsUtil.getWarning(selector);
                return (
                  <TabPanel key={selectorIndex}>
                    <div className="govuk-grid-row govuk-!-margin-top-1">
                      <p className="govuk-heading-s govuk-!-font-size-16 govuk-grid-column-one-half govuk-!-margin-bottom-0">Selector {selector.reference}</p>
                      <p className="govuk-heading-s govuk-!-font-size-16 govuk-grid-column-one-half govuk-!-padding-right-1 govuk-!-margin-bottom-0 font-warning">{warning}</p>
                    </div>
                    <p className="govuk-body govuk-!-font-size-16">All of these attributes are present in this movement.</p>
                    <div className="panel">
                      { indicatorMatches && renderIndicatorMatches(indicatorMatches) }
                    </div>
                  </TabPanel>
                );
              })}
            </Tabs>
          </div>
        );
      })}
    </div>
  );
};

export default SelectorMatches;
