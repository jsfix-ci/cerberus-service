import getSubmissionPayload from './getSubmissionPayload';

/**
 * Sets up the submission payload, the correct axios method to use, and the appropriate URL.
 * @param {object} formInfo Information about the form.
 * @param {object} payload The raw payload for submission.
 * @param {string} submittedBy The email address of who is submitting the form.
 * @param {object} axiosInstance The axios instance to use.
 * @returns Everything needed for submission to Camunda.
 */
const setupSubmission = async (formInfo, payload, submittedBy, axiosInstance) => {
  const submissionPayload = await getSubmissionPayload(
    formInfo,
    payload,
    submittedBy,
    axiosInstance,
  );
  return {
    businessKey: submissionPayload.businessKey,
    submissionPayload,
  };
};

export default setupSubmission;
