import React from 'react';
import { useKeycloak } from '../../context/Keycloak';
import { useAxiosInstance } from '../../utils/Axios/axiosInstance';

// Config
import config from '../../utils/config';
import { Renderers } from '../../utils/Form/ReactForm';

// Components
import RenderForm from '../RenderForm/RenderForm';

// Utils
import { StringUtil } from '../../utils';

// JSON
import noteCerberus from '../../forms/noteCerberus';
import AxiosRequests from '../../api/axiosRequests';

const TaskNotes = ({ displayForm, businessKey, setRefreshNotesForm, setError }) => {
  const keycloak = useKeycloak();
  const apiClient = useAxiosInstance(keycloak, config.taskApiUrl);
  return (
    <>
      {displayForm && (
        <RenderForm
          preFillData={{ businessKey }}
          onSubmit={
            async ({ data }) => {
              await AxiosRequests.saveNote(apiClient, businessKey, [{
                content: StringUtil.escape(data.note),
                userId: data.form.submittedBy,
              }]);
              setRefreshNotesForm();
            }
          }
          form={noteCerberus}
          renderer={Renderers.REACT}
          setError={setError}
        />
      )}
    </>
  );
};

export default TaskNotes;
