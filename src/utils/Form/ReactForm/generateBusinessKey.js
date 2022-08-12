import { BUSINESS_KEY_PATH } from '../../constants';

/**
 * Generates a new business key on the Form API Server for use in
 * the submission of a form.
 * @param {object} axiosInstance The axios instance to use.
 * @returns The newly-generated business key.
 */
const generateBusinessKey = async (axiosInstance) => {
  const { data } = await axiosInstance.post(BUSINESS_KEY_PATH, {});
  return data.businessKey;
};

export default generateBusinessKey;
