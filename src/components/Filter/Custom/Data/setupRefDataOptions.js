import config from '../../../../utils/config';
import refDataToOptions from '../Util/refDataToOptions';
import useGetRequest from '../Util/useGetRequest';

const INTERPOLATE_REGEX = /\${[^}]+}/g;

const setupRefDataOptions = (components) => {
  components.forEach((component) => {
    if (component && component?.data?.url) {
      const url = component.data.url.replace(INTERPOLATE_REGEX, config.refdataApiUrl);
      const { data } = useGetRequest(url);
      component.data.options = refDataToOptions(component, data);
    }
  });
};

export default setupRefDataOptions;
