import renderer from 'react-test-renderer';
import { IndicatorsUtil } from '../../../../TaskListPage/airpax/utils/index';

describe('IndicatorsUtil', () => {
  it('should get risk if present', () => {
    const targetListDataMin = {
      id: 'DEV-20220415-001',
      risks: {
        targetingIndicators: {
          indicators: [
            {
              description: 'Quick turnaround freight (under 24 hours)',
            },
            {
              description: 'Quick turnaround tourist (under 24 hours)',
            },
          ],
          count: 2,
          score: 60,
        },
      },
    };

    const expected = {
      targetingIndicators: {
        indicators: [
          {
            description: 'Quick turnaround freight (under 24 hours)',
          },
          {
            description: 'Quick turnaround tourist (under 24 hours)',
          },
        ],
        count: 2,
        score: 60,
      },
    };

    const output = IndicatorsUtil.get(targetListDataMin);
    expect(output).toEqual(expected);
  });

  it('should validate presence of risks', () => {
    const targetListDataMin = {
      id: 'DEV-20220415-001',
      risks: {
        targetingIndicators: {
          indicators: [
            {
              description: 'Quick turnaround freight (under 24 hours)',
            },
            {
              description: 'Quick turnaround tourist (under 24 hours)',
            },
          ],
          count: 2,
          score: 60,
        },
      },
    };

    const output = IndicatorsUtil.has(targetListDataMin);
    expect(output).toBeTruthy();
  });

  it('should validate absence of risks', () => {
    const targetListDataMin = {
      id: 'DEV-20220415-001',
    };

    const output = IndicatorsUtil.has(targetListDataMin);
    expect(output).toBeFalsy();
  });

  it('should validate presence of targeting indicators within risks', () => {
    const risks = {
      targetingIndicators: {
        indicators: [
          {
            description: 'Quick turnaround freight (under 24 hours)',
          },
          {
            description: 'Quick turnaround tourist (under 24 hours)',
          },
        ],
        count: 2,
        score: 60,
      },
    };

    const output = IndicatorsUtil.hasIndicatiors(risks);
    expect(output).toBeTruthy();
  });

  it('should validate absence of targeting indicators within risks', () => {
    const risks = {
      matchedRules: [],
      matchedSelectorGroups: {},
      highestThreatLevel: null,
    };

    const output = IndicatorsUtil.hasIndicatiors(risks);
    expect(output).toBeFalsy();
  });

  it('should get targeting indicators if present', () => {
    const risks = {
      targetingIndicators: {
        indicators: [
          {
            description: 'Quick turnaround freight (under 24 hours)',
          },
          {
            description: 'Quick turnaround tourist (under 24 hours)',
          },
        ],
        count: 2,
        score: 60,
      },
    };

    const expected = {
      indicators: [
        {
          description: 'Quick turnaround freight (under 24 hours)',
        },
        {
          description: 'Quick turnaround tourist (under 24 hours)',
        },
      ],
      count: 2,
      score: 60,
    };

    const output = IndicatorsUtil.getIndicators(risks);
    expect(output).toEqual(expected);
  });

  it('should return a formatted targeting indicators if present', () => {
    const targetingIndicators = {
      indicators: [
        {
          description: 'Quick turnaround freight (under 24 hours)',
        },
        {
          description: 'Quick turnaround tourist (under 24 hours)',
        },
      ],
      count: 2,
      score: 60,
    };

    const tree = renderer.create(IndicatorsUtil.format(targetingIndicators)).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
