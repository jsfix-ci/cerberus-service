import formHooks from './formHooks';
import generateBusinessKey from './generateBusinessKey';
import getRenderer, { Renderers } from './getRenderer';
import setupSubmission from './setupSubmission';
import uploadDocuments from './uploadDocuments';

const FormUtils = {
  formHooks,
  generateBusinessKey,
  getRenderer,
  Renderers,
  setupSubmission,
  uploadDocuments,
};

export {
  Renderers,
};

export default FormUtils;
