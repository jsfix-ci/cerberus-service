import cleanComponent from './cleanComponent';
import getComponent from './getComponent';
import getVisibleComponents from './getVisibleComponents';
import setupComponent from './setupComponent';
import showComponent from './showComponent';

const Component = {
  clean: cleanComponent,
  get: getComponent,
  getVisible: getVisibleComponents,
  setup: setupComponent,
  show: showComponent,
};

export default Component;
