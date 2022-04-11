import React from 'react';
import { render } from '@testing-library/react';

import EnrichmentCount from '../../TaskDetails/TaskVersionsMode/EnrichmentCount';

const enrichmentCountHaulier = {
  fieldSetName: 'Haulier details',
  hasChildSet: false,
  contents: [
    {
      fieldName: 'Enrichment count',
      type: 'HIDDEN',
      content: '3/-/5',
      versionLastUpdated: null,
      propName: 'enrichmentCount',
    },
  ],
  type: 'null',
  propName: 'haulier',
};

const enrichmentCountAccount = {
  fieldSetName: 'Account details',
  hasChildSet: false,
  contents: [
    {
      fieldName: 'Enrichment count',
      type: 'HIDDEN',
      content: '5/3/5',
      versionLastUpdated: null,
      propName: 'enrichmentCount',
    },
  ],
  type: 'null',
  propName: 'account',

};

describe('EnrichmentCount', () => {
  it('should render enrichmentCount for Haulier', () => {
    const enrichmentCount = enrichmentCountHaulier.contents?.find(({ propName }) => propName === 'enrichmentCount')?.content;
    render(<EnrichmentCount
      version={enrichmentCount}
    />);
    expect(enrichmentCount).toBe('3/-/5');
  });

  it('should render enrichmentCount for Account', () => {
    const enrichmentCount = enrichmentCountAccount.contents?.find(({ propName }) => propName === 'enrichmentCount')?.content;
    render(<EnrichmentCount
      version={enrichmentCount}
    />);
    expect(enrichmentCount).toBe('5/3/5');
  });
});
