/* eslint-disable jest/expect-expect */
import _ from 'lodash';
import { TargetInformationUtil } from '..';

import targetData from '../../__fixtures__/taskData_AirPax_AssigneeCurrentUser.fixture.json';
import targetPrefillData from '../../__fixtures__/airpax-information-sheet-auto-population.json';
import tisSubmissionData from '../../__fixtures__/airpax-information-sheet-submission.json';

describe('Target Information Sheet', () => {
  let PREFILL_DATA = {};

  const keycloak = {
    tokenParsed: {
      given_name: 'Joe',
      family_name: 'Bloggs',
    },
  };

  beforeEach(() => {
    PREFILL_DATA = {
      ...targetPrefillData,
    };
  });

  const checkObjects = (result, expected) => {
    expect(expected.every((v) => result.includes(v))).toBeTruthy();
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
      'movement',
      'operation',
      'issuingHub',
      'nominalChecks',
      'submittingUser'];

    const submissionPayload = TargetInformationUtil
      .submissionPayload(targetData, tisSubmissionData, keycloak);

    checkObjects(Object.keys(submissionPayload), EXPECTED_NODE_KEYS);
  });

  it('should convert the form submission data back to a form prefill data', () => {
    const EXPECTED_NODE_KEYS = [
      'id',
      'movement',
    ];

    const prefillFormData = TargetInformationUtil.convertToPrefill(targetPrefillData);

    checkObjects(Object.keys(prefillFormData), EXPECTED_NODE_KEYS);
  });

  it('should generate the submission payload and the journey node within it', () => {
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
      .submissionPayload(targetData, tisSubmissionData, keycloak);
    expect(submissionPayload.movement.journey).toMatchObject(EXPECTED);
  });

  it.each([
    [
      'INBOUND',
      {
        'id': 1897,
        'name': 'Arrival Port',
      },
      {
        'id': 1698,
        'name': 'Departure Port',
      },
      ['eventPort'],
      'arrivalPort',
    ],
    [
      'OUTBOUND',
      {
        'id': 1897,
        'name': 'Arrival Port',
      },
      {
        'id': 1698,
        'name': 'Departure Port',
      },
      ['eventPort'],
      'departurePort',
    ],
  ])('should populate the submission payload with the appropriate port',
    (direction, arrivalPort, departurePort, expectedPortNodeKey, portNodeKey) => {
      const FORM_DATA = _.cloneDeep(tisSubmissionData);
      FORM_DATA.movement.direction = direction;
      FORM_DATA.movement.arrivalPort = arrivalPort;
      FORM_DATA.movement.departurePort = departurePort;

      const submissionPayload = TargetInformationUtil
        .submissionPayload(targetData, FORM_DATA, keycloak);

      checkObjects(Object.keys(submissionPayload), expectedPortNodeKey);
      expect(submissionPayload.eventPort).toMatchObject(FORM_DATA.movement[portNodeKey]);
    });
});
