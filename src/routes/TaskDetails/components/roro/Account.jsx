import React from 'react';

// Utils
import { AccountUtil, StringUtil } from '../../../../utils';

import renderBlock from '../../helper/common';

const Account = ({ version }) => {
  const account = AccountUtil.get(version);
  return (
    <div className="task-details-container bottom-border-thin govuk-!-margin-bottom-2">
      <h3 className="govuk-heading-m govuk-!-margin-top-0">Account details</h3>
      <div className="govuk-task-details-grid-column">
        {renderBlock('Full name', [AccountUtil.name(account)])}
        {renderBlock('Short name', [AccountUtil.shortName(account)])}
        {renderBlock('Reference number', [AccountUtil.reference(account)])}
        {renderBlock('Address', [StringUtil.format.address(AccountUtil.address(account))])}
        {renderBlock('Telephone', [AccountUtil.telephone(account)])}
        {renderBlock('Mobile', [AccountUtil.mobile(account)])}
        {renderBlock('Email', [AccountUtil.email(account)])}
      </div>
    </div>
  );
};

export default Account;
