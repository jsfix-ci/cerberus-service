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
        types: ['VIOL', 'FIRE', 'WEAP', 'CTGN', 'SEH'],
        detail: null,
      },
    };

    const output = RisksUtil.getWarning(selector);
    expect(output).toEqual('Violence, Firearms, Weapons, Contagion, Self Harm');
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
    const highestThreatLevel = {
      risks: {
        highestThreatLevel: {
          type: 'SELECTOR',
          value: 'B',
        },
      },
    };

    const expected = { 'type': 'SELECTOR', 'value': 'B' };

    const output = RisksUtil.getHighestThreat(highestThreatLevel);
    expect(output).toEqual(expected);
  });

  it('should return null if target task highestThreatLevel is null', () => {
    const highestThreatLevel = {
      risks: {
        highestThreatLevel: null,
      },
    };

    const output = RisksUtil.getHighestThreat(highestThreatLevel);
    expect(output).toEqual(null);
  });

  it('should get target task matchedSelectorGroups if present', () => {
    const selectors = {
      risks: {
        matchedSelectorGroups: {
          groups: [
            {
              groupReference: 'SR-245',
              groupVersionNumber: 1,
              requestingOfficer: 'fe',
              intelligenceSource: 'fefe',
              category: 'A',
              threatType: 'Class A Drugs',
              pointOfContactMessage: 'fdvdfb',
              pointOfContact: 'bfb',
              inboundActionCode: 'No action required',
              outboundActionCode: 'No action required',
              notes: 'notes',
              creator: 'user',
              selectors: [
                {
                  id: 279,
                  reference: '2021-279',
                  category: 'A',
                  warning: {
                    status: 'YES',
                    types: [
                      'VIOLENCE',
                      'FIREARMS',
                      'OTHER',
                    ],
                    detail: 'other warning details',
                  },
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
                  description: 'RORO Accompanied Freight qwerty',
                },
                {
                  id: 300,
                  reference: '2022-300',
                  category: 'B',
                  warning: {
                    status: 'NO',
                    types: [],
                    detail: null,
                  },
                  indicatorMatches: [
                    {
                      entity: 'Trailer',
                      descriptor: 'registrationNumber',
                      operator: 'equal',
                      value: 'GB09NFD',
                    },
                  ],
                  description: 'GB09NFD',
                },
              ],
            },
          ],
          totalNumberOfSelectors: 2,
        },
      },
    };

    const expected = { 'groups':
      [
        { 'groupReference': 'SR-245',
          'groupVersionNumber': 1,
          'requestingOfficer': 'fe',
          'intelligenceSource': 'fefe',
          'category': 'A',
          'threatType': 'Class A Drugs',
          'pointOfContactMessage': 'fdvdfb',
          'pointOfContact': 'bfb',
          'inboundActionCode': 'No action required',
          'outboundActionCode': 'No action required',
          'notes': 'notes',
          'creator': 'user',
          'selectors': [
            { 'id': 279,
              'reference': '2021-279',
              'category': 'A',
              'warning': { 'status': 'YES', 'types': ['VIOLENCE', 'FIREARMS', 'OTHER'], 'detail': 'other warning details' },
              'indicatorMatches': [{ 'entity': 'Message', 'descriptor': 'mode', 'operator': 'in', 'value': 'RORO Accompanied Freight' }, { 'entity': 'Trailer', 'descriptor': 'registrationNumber', 'operator': 'equal', 'value': 'qwerty' }],
              'description': 'RORO Accompanied Freight qwerty' },
            { 'id': 300,
              'reference': '2022-300',
              'category': 'B',
              'warning': { 'status': 'NO', 'types': [], 'detail': null },
              'indicatorMatches': [{ 'entity': 'Trailer', 'descriptor': 'registrationNumber', 'operator': 'equal', 'value': 'GB09NFD' }],
              'description': 'GB09NFD' },
          ] },
      ],
    'totalNumberOfSelectors': 2 };

    const output = RisksUtil.getMatchedSelectorGroups(selectors);
    expect(output).toEqual(expected);
  });

  it('should return null if target task matchedSelectorGroups is null', () => {
    const selectors = {
      risks: {
        matchedSelectorGroups: null,
      },
    };

    const output = RisksUtil.getMatchedSelectorGroups(selectors);
    expect(output).toEqual(null);
  });

  it('should get target task matchedRules if present', () => {
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

    const output = RisksUtil.getMatchedRules(rules);
    expect(output).toEqual(expected);
  });

  it('should return null if target task matchedRules is null', () => {
    const rules = {
      risks: {
        matchedRules: null,
      },
    };

    const output = RisksUtil.getMatchedRules(rules);
    expect(output).toEqual(null);
  });
});
