import renderer from 'react-test-renderer';
import { RisksUtil } from '../../utils';

describe('RisksUtil', () => {
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

    const output = RisksUtil.getRisks(targetListDataMin);
    expect(output).toEqual(expected);
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

    const output = RisksUtil.getIndicators(risks);
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

    const tree = renderer.create(RisksUtil.format(targetingIndicators)).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render No warnings text if warning status is NO', () => {
    const selector = {
      id: 279,
      reference: '2021-279 A',
      category: 'A',
      warning: {
        status: 'NO',
        types: [

        ],
        detail: null,
      },
    };

    const output = RisksUtil.getWarning(selector);
    expect(output).toEqual('No warnings');
  });

  it('should render Warnings currently unavailable text if warning status is Currently unavailable', () => {
    const selector = {
      id: 279,
      reference: '2021-279 A',
      category: 'A',
      warning: {
        status: 'Currently unavailable',
        types: [

        ],
        detail: null,
      },
    };

    const output = RisksUtil.getWarning(selector);
    expect(output).toEqual('Warnings currently unavailable');
  });

  it('should render comma seperated warnings if warning status is YES', () => {
    const selector = {
      id: 279,
      reference: '2021-279 A',
      category: 'A',
      warning: {
        status: 'YES',
        types: ['VIOLENCE', 'FIREARMS', 'WEAPONS', 'CONTAGION', 'SELF_HARM'],
        detail: null,
      },
    };

    const output = RisksUtil.getWarning(selector);
    expect(output).toEqual('Violence, Firearms, Weapons, Contagion, Self harm');
  });

  it('should render nothing if warning status is null', () => {
    const selector = {
      id: 279,
      reference: '2021-279 A',
      category: 'A',
      warning: {
        status: null,
        types: [],
        detail: null,
      },
    };

    const output = RisksUtil.getWarning(selector);
    expect(output).toEqual(undefined);
  });

  it('should get indicator matches if present', () => {
    const selector = {
      indicatorMatches: [
        {
          entity: 'Message',
          descriptor: 'mode',
          operator: 'in',
          value: 'RORO Accompanied Freight',
        },
        {
          entity: 'Trailer',
          descriptor: 'registrationNumber',
          operator: 'equal',
          value: 'qwerty',
        },
      ],
    };

    const expected = [
      {
        descriptor: 'mode',
        entity: 'Message',
        operator: 'in',
        value: 'RORO Accompanied Freight',
      },
      {
        descriptor: 'registrationNumber',
        entity: 'Trailer',
        operator: 'equal',
        value: 'qwerty',
      },
    ];
    const output = RisksUtil.getMatches(selector);
    expect(output).toEqual(expected);
  });

  it('should return empty array if indicator matches does not contain any indicators', () => {
    const selector = {
      indicatorMatches: [],
    };

    const output = RisksUtil.getMatches(selector);
    expect(output).toEqual([]);
  });

  it('should return null if indicator matches is null', () => {
    const selector = {
      indicatorMatches: null,
    };

    const output = RisksUtil.getMatches(selector);
    expect(output).toEqual(null);
  });

  it('should get rules matches if present', () => {
    const rules = {
      risks: {
        matchedRules: [
          {
            id: 535,
            name: 'Selector Matched Rule',
            type: 'Both',
            priority: 'Tier 1',
            agency: '',
            description: 'Test Description',
            version: 1,
            abuseTypes: [
              'National Security at the Border',
            ],
            indicatorMatches: [
              {
                entity: 'Message',
                descriptor: 'mode',
                operator: 'in',
                value: '[RORO Accompanied Freight, RORO Tourist, RORO Unaccompanied Freight]',
              },
              {
                entity: 'Message',
                descriptor: 'selectorsMatched',
                operator: 'equal',
                value: 'true',
              },
            ],
          },
        ],
      },
    };

    const expected = [
      { 'abuseTypes': ['National Security at the Border'],
        'agency': '',
        'description': 'Test Description',
        'id': 535,
        'indicatorMatches': [{ 'descriptor': 'mode', 'entity': 'Message', 'operator': 'in', 'value': '[RORO Accompanied Freight, RORO Tourist, RORO Unaccompanied Freight]' }, { 'descriptor': 'selectorsMatched', 'entity': 'Message', 'operator': 'equal', 'value': 'true' }],
        'name': 'Selector Matched Rule',
        'priority': 'Tier 1',
        'type': 'Both',
        'version': 1 }];

    const output = RisksUtil.getRules(rules);
    expect(output).toEqual(expected);
  });

  it('should return null if rules matches is null', () => {
    const rules = {
      risks: {
        matchedRules: null,
      },
    };

    const output = RisksUtil.getRules(rules);
    expect(output).toEqual(null);
  });

  it('should get target task highestThreatLevel if present', () => {
    const risks = {
      highestThreatLevel: {
        type: 'SELECTOR',
        value: 'B',
      },
    };

    const output = RisksUtil.getHighestThreat(risks);
    expect(output).toEqual(risks.highestThreatLevel);
  });

  it('should return null if target task highestThreatLevel is null', () => {
    const risks = {
      highestThreatLevel: null,
    };

    const output = RisksUtil.getHighestThreat(risks);
    expect(output).toEqual(risks.highestThreatLevel);
  });

  it('should get target task matchedSelectorGroups if present', () => {
    const risks = {
      matchedSelectorGroups: {
        groups: [
          {
            groupReference: 'SR-245',
            groupVersionNumber: 1,
            category: 'A',
            threatType: 'Class A Drugs',
            selectors: [
              {
                id: 279,
                reference: '2021-279',
                category: 'A',
                warning: {
                  status: 'YES',
                  types: [
                    'VIOLENCE',
                  ],
                  detail: 'other warning details',
                },
                indicatorMatches: [],
                description: 'RORO Accompanied Freight qwerty',
              },
            ],
          },
        ],
        totalNumberOfSelectors: 1,
      },
    };

    const output = RisksUtil.getMatchedSelectorGroups(risks);
    expect(output).toEqual(risks.matchedSelectorGroups);
  });

  it('should return null if target task matchedSelectorGroups is null', () => {
    const risks = {
      matchedSelectorGroups: null,
    };

    const output = RisksUtil.getMatchedSelectorGroups(risks);
    expect(output).toEqual(risks.matchedSelectorGroups);
  });

  it('should get target task matchedRules if present', () => {
    const risks = {
      matchedRules: [
        {
          id: 535,
          name: 'Selector Matched Rule',
          type: 'Both',
          priority: 'Tier 1',
          version: 1,
          abuseTypes: [
            'National Security at the Border',
          ],
          indicatorMatches: [],
        },
      ],
    };

    const output = RisksUtil.getMatchedRules(risks);
    expect(output).toEqual(risks.matchedRules);
  });

  it('should return null if target task matchedRules is null', () => {
    const risks = {
      matchedRules: null,
    };

    const output = RisksUtil.getMatchedRules(risks);
    expect(output).toEqual(risks.matchedRules);
  });
});
