// Utils
import { VIEW } from '../../Common/commonUtil';

// JSON
import airpaxTisCerberus from '../../../forms/airpaxTisCerberus';
import roroTisCerberus from '../../../forms/roroTisCerberus';

const getTisForm = (view) => {
  switch (view) {
    case VIEW.AIRPAX: {
      return airpaxTisCerberus;
    }
    case VIEW.RORO_V2: {
      return roroTisCerberus;
    }
    default: {
      return null;
    }
  }
};

export default getTisForm;
