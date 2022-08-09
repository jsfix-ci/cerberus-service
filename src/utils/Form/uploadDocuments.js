import { Utils } from '@ukhomeoffice/cop-react-form-renderer';

const uploadDocument = async (client, submissionData, document) => {
  const formData = new FormData();
  formData.append('file', document.file);
  const { data } = await client.post(submissionData.businessKey, formData);
  if (data) {
    document.url = data.url;
    Utils.Data.setDataItem(submissionData, document.field, { ...document });
  }
  return document;
};

const uploadDocuments = async (client, submissionData) => {
  if (client && submissionData) {
    const toUpload = submissionData.meta?.documents?.filter((doc) => !doc.url) || [];
    if (toUpload.length > 0) {
      return Promise.all(toUpload.map((document) => uploadDocument(client, submissionData, document)));
    }
  }
  return Promise.resolve();
};

export default uploadDocuments;
