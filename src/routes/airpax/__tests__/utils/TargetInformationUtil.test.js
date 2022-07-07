import '../../../../__mocks__/keycloakMock';

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
    const EXPECTED_NODE_KEYS = ['businessKey', 'category', 'movement', 'person', 'warnings'];

    const prefillFormData = TargetInformationUtil.transform(PREFILL_DATA);

    expect(Object.keys(prefillFormData)).toEqual(expect.arrayContaining(EXPECTED_NODE_KEYS));
  });

  it('should generate prefill data when movement node is null', () => {
    PREFILL_DATA.movement = null;
    const EXPECTED_NODE_KEYS = ['businessKey', 'category', 'movement', 'warnings'];

    const prefillFormData = TargetInformationUtil.transform(PREFILL_DATA);

    expect(Object.keys(prefillFormData)).toEqual(expect.arrayContaining(EXPECTED_NODE_KEYS));
  });

  it('should generate submission payload', () => {
    const keycloak = {
      tokenParsed: {
        given_name: 'Joe',
        family_name: 'Bloggs',
      },
    };
    const submissionPayload = TargetInformationUtil.submissionPayload(targetData.versions[0], tisSubmissionData, keycloak);
    expect(submissionPayload).toBeDefined();
  });
});
