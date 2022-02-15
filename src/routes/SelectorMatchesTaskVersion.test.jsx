import React from 'react';
import { screen, render } from '@testing-library/react';

import { SelectorMatchesTaskVersion, selectorsByGroupReference } from './TaskDetails/TaskVersionsMode/SelectorMatchesTaskVersion';
import { taskMultipleGroupSelectors, selectorMatches } from './__fixtures__/taskVersionSelectors';

describe('SelectorMatchesTaskVersion', () => {
  it('should combine selectors by group reference', () => {
    const selectorsByGroup = selectorsByGroupReference(selectorMatches);
    const localReferenceSelectors = selectorsByGroup['Local Reference'];
    const selectorAutoTesting = selectorsByGroup['selector auto testing'];
    expect(localReferenceSelectors?.length).toBe(3);
    expect(selectorAutoTesting?.length).toBe(1);
  });
  it('should render total selectors in a version', () => {
    render(<SelectorMatchesTaskVersion
      version={taskMultipleGroupSelectors}
    />);
    expect(screen.queryByText('5 selector matches')).toBeInTheDocument();
  });

  it('should render selector group names', () => {
    render(<SelectorMatchesTaskVersion
      version={taskMultipleGroupSelectors}
    />);
    expect(screen.queryByText('Local Reference')).toBeInTheDocument();
  });
});
