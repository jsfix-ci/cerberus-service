import React from 'react';
import { screen, render } from '@testing-library/react';

import { SelectorMatchesTaskVersion, selectorsByGroupReference } from '../TaskDetails/TaskVersionsMode/SelectorMatchesTaskVersion';
import { taskMultipleGroupSelectors, taskSelectorsWarnings, selectorMatches } from '../__fixtures__/taskVersionSelectors';

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

  it('should render \'No warnings\' text if no warnings for a selector', () => {
    render(<SelectorMatchesTaskVersion
      version={taskMultipleGroupSelectors}
    />);
    expect(screen.queryByText('No warnings')).toBeInTheDocument();
  });

  it('should render \'Warnings currently unavailable\' text if no warnings are avaialable a the selector', () => {
    render(<SelectorMatchesTaskVersion
      version={taskMultipleGroupSelectors}
    />);
    expect(screen.queryByText('Warnings currently unavailable')).toBeInTheDocument();
  });

  it('should render warnings as comma separated values', () => {
    render(<SelectorMatchesTaskVersion
      version={taskMultipleGroupSelectors}
    />);
    expect(screen.queryByText('Contagion,Violence,Weapons,Warning details would be shown here')).toBeInTheDocument();
  });

  it('should only render 500 Characters for warning details', () => {
    render(<SelectorMatchesTaskVersion
      version={taskMultipleGroupSelectors}
    />);
    expect(screen.queryByText('Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibu')).toBeInTheDocument();
  });

  it('should transform warning codes(comma separated) into their meaning and use warning detials for code O', () => {
    render(<SelectorMatchesTaskVersion
      version={taskSelectorsWarnings}
    />);
    expect(screen.queryByText('Contagion,Violence,Warning details would be shown here')).toBeInTheDocument();
  });
});
