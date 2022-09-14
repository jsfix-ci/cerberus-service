import formHooks from './formHooks';
import generateBusinessKey from './generateBusinessKey';
import getRenderer, { Renderers } from './getRenderer';
import getTisForm from './getTisForm';
import setupSubmission from './setupSubmission';
import { showAssigneeComponent } from './componentUtil';
import uploadDocuments from './uploadDocuments';

const FormUtils = {
  formHooks,
  generateBusinessKey,
  getRenderer,
  getTisForm,
  Renderers,
  setupSubmission,
  showAssigneeComponent,
  uploadDocuments,
};

export {
  Renderers,
};

export default FormUtils;
