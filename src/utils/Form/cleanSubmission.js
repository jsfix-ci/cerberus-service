import getProcessInstance from './getProcessInstance';

const CONTEXT_PROPERTIES = [
  'environmentContext',
  'staffDetailsDataContext',
  'extendedStaffDetailsContext',
  'shiftDetailsContext',
  'processContext',
  'taskContext',
  'keycloakContext',
];

/**
 * Gets information about the form for the submission payload.
 * @param {object} formInfo Information about the form.
 * @param {string} submittedBy The email address of who is submitting the form.
 * @returns An object containing information about the form.
 */
export const getFormPayload = (formInfo, submittedBy) => {
  const { id, version, title, name } = formInfo;
  return {
    formId: id,
    formVersionId: version,
    title,
    name,
    submissionDate: new Date(),
    submittedBy,
    draftForm: true,
  };
};

/**
 * Accepts a raw submission payload and cleans it up.
 * @param {object} formInfo Information about the form.
 * @param {object} payload The raw payload for submission.
 * @param {string} submittedBy The email address of who is submitting the form.
 * @returns A clean submission payload.
 */
const cleanSubmission = (formInfo, payload, submittedBy) => {
  const { businessKey, id } = getProcessInstance(payload.processContext);
  const submissionPayload = {
    id,
    businessKey,
    ...payload,
    form: getFormPayload(formInfo, submittedBy),
  };
  // None of the contexts should be in the payload.
  CONTEXT_PROPERTIES.forEach((context) => {
    delete submissionPayload[context];
  });
  return submissionPayload;
};

export default cleanSubmission;
