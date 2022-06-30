export const COP_REACT_RENDERER = 'cop-react';
export const FORM_IO_RENDERER = 'form.io';

export const REACT_FORM_PREFIXS = ['cop-', 'cerberus-'];

function checkStringStartsWith(str, prefixes) {
  return prefixes.some((prefix) => str.startsWith(prefix));
}

const getRendererByName = (formName) => {
  if (formName && checkStringStartsWith(formName, REACT_FORM_PREFIXS)) {
    return COP_REACT_RENDERER;
  }
  return FORM_IO_RENDERER;
};

const getRenderer = (form) => {
  let formName = form;
  if (form && typeof form === 'object') {
    formName = form.name;
  }
  return getRendererByName(formName);
};

export const Renderers = {
  REACT: COP_REACT_RENDERER,
  FORM_IO: FORM_IO_RENDERER,
};

export default getRenderer;
