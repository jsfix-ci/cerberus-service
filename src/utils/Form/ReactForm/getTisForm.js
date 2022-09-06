// Utils
import { VIEW } from '../../Common/commonUtil';

// JSON
import airpaxTisCerberus from '../../../forms/airpaxTisCerberus';

const getTisForm = (view) => {
  switch (view) {
    case VIEW.AIRPAX: {
      return airpaxTisCerberus;
    }
    default: {
      return null;
    }
  }
};

export default getTisForm;
