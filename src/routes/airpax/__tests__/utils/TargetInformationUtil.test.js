import { TargetInformationUtil } from '../../utils';

import targetData from '../../__fixtures__/taskData_AirPax_AssigneeCurrentUser.fixture.json';
import targetPrefillData from '../../__fixtures__/targetData_AirPax_PrefillData.json';
import tisSubmissionData from '../../__fixtures__/targetData_AirPax_SubmissionData.json';

describe('Target Information Sheet', () => {
  let PREFILL_DATA = {};

  beforeEach(() => {
    PREFILL_DATA = {
      ...targetPrefillData,
    };
  });

  it('should generate prefill data', () => {
    const EXPECTED_NODE_KEYS = ['id', 'category', 'movement', 'otherPersons', 'person', 'warnings'];

    const prefillFormData = TargetInformationUtil.prefillPayload(PREFILL_DATA);

    expect(Object.keys(prefillFormData)).toEqual(expect.arrayContaining(EXPECTED_NODE_KEYS));
  });

  it('should generate prefill data when movement node is null', () => {
    PREFILL_DATA.movement = null;
    const EXPECTED_NODE_KEYS = ['id', 'category', 'movement', 'warnings'];

    const prefillFormData = TargetInformationUtil.prefillPayload(PREFILL_DATA);

    expect(Object.keys(prefillFormData)).toEqual(expect.arrayContaining(EXPECTED_NODE_KEYS));
  });

  it('should generate submission payload', () => {
    const keycloak = {
      tokenParsed: {
        given_name: 'Joe',
        family_name: 'Bloggs',
      },
    };

    const airPaxRefDataMode = {
      'id': 2,
      'mode': 'Scheduled Air Passenger',
      'modecode': 'airpass',
      'crossingtype': [
        'air',
      ],
      'ien': true,
      'ca': true,
      'ct': true,
      'validfrom': '2021-05-28T00:01:01.000Z',
      'validto': null,
      'updatedby': 'Mohammed Abdul Odud',
    };

    const submissionPayload = TargetInformationUtil
      .submissionPayload(targetData, tisSubmissionData, keycloak, airPaxRefDataMode);
    expect(submissionPayload).toBeDefined();
  });
});
