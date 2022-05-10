import React from 'react';
import { IndicatorsUtil } from '../../utils';

const renderRule = (rule) => {
  // console.log("Rule ", rule);
  const fieldNameMapper = { name: 'Rule name',
    priority: 'Threat',
    version: 'Rule Version',
    abuseTypes: 'Abuse Type' };

  return Object.entries(rule).map(([key, value], index) => {
    console.log("value", value);
    const field = Object.keys(fieldNameMapper).includes(key) ? key : false;
    if (field) {
      return (
        <div key={index} className="govuk-grid-column-one-quarter">
          <h4 className="govuk-heading-s">{fieldNameMapper[key]}</h4>
          <p>{rule[field]}</p>
        </div>
      );
    }
  });
};

const RuleMatches = ({ version }) => {
  const rules = IndicatorsUtil.getRules(version);
  const firstRule = rules.length && rules.slice(0, 1);
  const otherRules = rules.length > 0 && rules.slice(1, rules.length);
  console.log("firstRule ", firstRule);
  console.log("Other rules ", otherRules);

  return (
    <div>
      <h2 className="govuk-heading-m">Rules matched</h2>
      <div className="govuk-grid-row">{ renderRule(firstRule) }</div>
      { otherRules.length && (
        <div>
          <h2 className="govuk-heading-m">Other rules matches {otherRules.length}</h2>
          <div className="govuk-grid-row">{ renderRule(otherRules) }</div>
        </div>
      ) }
    </div>
  );
};

export default RuleMatches;
