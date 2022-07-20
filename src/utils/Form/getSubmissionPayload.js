import cleanSubmission from './cleanSubmission';
import generateBusinessKey from './generateBusinessKey';

/**
 * Prepares up a payload for submission by cleaning it up and getting a business key if it
 * doesn't have one already.
 * @param {object} formInfo Information about the form.
 * @param {object} payload The raw payload for submission.
 * @param {string} submittedBy The email address of who is submitting the form.
 * @param {object} axiosInstance The axios instance to use.
 * @returns A payload that is ready for submission.
 */
const getSubmissionPayload = async (formInfo, payload, submittedBy, axiosInstance) => {
  const cleanPayload = cleanSubmission(formInfo, payload, submittedBy);
  if (!cleanPayload.businessKey) {
    cleanPayload.businessKey = await generateBusinessKey(axiosInstance);
  }
  return cleanPayload;
};

export default getSubmissionPayload;
