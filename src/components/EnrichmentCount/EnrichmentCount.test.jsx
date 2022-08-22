import React from 'react';
import renderer from 'react-test-renderer';
import EnrichmentCount from './EnrichmentCount';

describe('EnrichmentCount', () => {
  it('should render the enrichment component', () => {
    const MOVEMENT_STATS = {
      seizureCount: 0,
      movementCount: 0,
      examinationCount: 0,
    };
    const tree = renderer.create(<EnrichmentCount
      movementStats={MOVEMENT_STATS}
      labelText="TEST TITLE"
    />);
    expect(tree).toMatchSnapshot();
  });

  it('should render the enrichment component with examination count', () => {
    const MOVEMENT_STATS = {
      seizureCount: 0,
      movementCount: 0,
      examinationCount: 1,
    };
    const tree = renderer.create(<EnrichmentCount
      movementStats={MOVEMENT_STATS}
      labelText="TEST TITLE"
    />);
    expect(tree).toMatchSnapshot();
  });

  it('should render the enrichment component with seizure count', () => {
    const MOVEMENT_STATS = {
      seizureCount: 1,
      movementCount: 0,
      examinationCount: 0,
    };
    const tree = renderer.create(<EnrichmentCount
      movementStats={MOVEMENT_STATS}
      labelText="TEST TITLE"
    />);
    expect(tree).toMatchSnapshot();
  });

  it('should render the enrichment component with movement count', () => {
    const MOVEMENT_STATS = {
      seizureCount: 0,
      movementCount: 1,
      examinationCount: 0,
    };
    const tree = renderer.create(<EnrichmentCount
      movementStats={MOVEMENT_STATS}
      labelText="TEST TITLE"
    />);
    expect(tree).toMatchSnapshot();
  });

  it('should render the enrichment component with movement, seizure & examination count', () => {
    const MOVEMENT_STATS = {
      seizureCount: 1,
      movementCount: 1,
      examinationCount: 1,
    };
    const tree = renderer.create(<EnrichmentCount
      movementStats={MOVEMENT_STATS}
      labelText="TEST TITLE"
    />);
    expect(tree).toMatchSnapshot();
  });
});
