/* eslint-disable jest/expect-expect */
import { TargetInformationUtil } from '../../utils';

import targetData from '../../__fixtures__/taskData_AirPax_AssigneeCurrentUser.fixture.json';
import targetPrefillData from '../../__fixtures__/targetData_AirPax_PrefillData.json';
import tisSubmissionData from '../../__fixtures__/targetData_AirPax_SubmissionData.json';

describe('Target Information Sheet', () => {
  let PREFILL_DATA = {};

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

  beforeEach(() => {
    PREFILL_DATA = {
      ...targetPrefillData,
    };
  });

  const checkObjects = (result, expected) => {
    expect(expected.every((v) => result.includes(v)));
  };

  it('should generate prefill data', () => {
    const EXPECTED_NODE_KEYS = [
      'id',
      'category',
      'movement',
      'otherPersons',
      'person',
      'warnings',
    ];

    const prefillFormData = TargetInformationUtil.prefillPayload(PREFILL_DATA);

    checkObjects(Object.keys(prefillFormData), EXPECTED_NODE_KEYS);
  });

  it('should verify that targeting indicators auto population data contains value & label', () => {
    const EXPECTED_NODE_KEYS = [
      'value',
      'label',
    ];

    const prefillFormData = TargetInformationUtil.prefillPayload(PREFILL_DATA);

    checkObjects(Object.keys(prefillFormData.targetingIndicators[0]), EXPECTED_NODE_KEYS);
  });

  it('should generate prefill data when movement node is null', () => {
    PREFILL_DATA.movement = null;
    const EXPECTED_NODE_KEYS = [
      'id',
      'category',
      'movement',
      'warnings',
    ];

    const prefillFormData = TargetInformationUtil.prefillPayload(PREFILL_DATA);

    checkObjects(Object.keys(prefillFormData), EXPECTED_NODE_KEYS);
  });

  it('should generate submission payload', () => {
    const EXPECTED_NODE_KEYS = [
      'id',
      'category',
      'eventPort',
      'movement',
      'operation',
      'issuingHub',
      'norminalChecks',
      'submittingUser'];

    const submissionPayload = TargetInformationUtil
      .submissionPayload(targetData, tisSubmissionData, keycloak, airPaxRefDataMode);

    checkObjects(Object.keys(submissionPayload), EXPECTED_NODE_KEYS);
  });

  it('should convert the form submission data back to a form prefill data', () => {
    const EXPECTED_NODE_KEYS = [
      'id',
      'category',
      'eventPort',
      'movement',
      'operation',
      'issuingHub',
      'norminalChecks',
      'submittingUser',
      'meta'];

    const prefillFormData = TargetInformationUtil.convertToPrefill(targetPrefillData);

    checkObjects(Object.keys(prefillFormData), EXPECTED_NODE_KEYS);
  });

  it('should generate the submission payload and the jouney node within it', () => {
    const EXPECTED = {
      id: 'BA103',
      direction: undefined,
      route: 'CDG - YYZ - YYC - LHR',
      arrival: {
        date: '2022-06-23T10:27:00Z',
        time: '2022-06-23T10:27:00Z',
        country: null,
        location: 'LHR',
      },
      departure: {
        country: null,
        location: 'FRA',
        date: 'Invalid Date',
        time: 'Invalid Date',
      },
    };

    const submissionPayload = TargetInformationUtil
      .submissionPayload(targetData, tisSubmissionData, keycloak, airPaxRefDataMode);
    expect(submissionPayload.movement.journey).toMatchObject(EXPECTED);
  });
});
