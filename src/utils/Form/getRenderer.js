export const COP_REACT_RENDERER = 'cop-react';
export const FORM_IO_RENDERER = 'form.io';

export const REACT_FORM_PREFIX = 'cop-';

const getRendererByName = (formName) => {
  if (formName && formName.startsWith(REACT_FORM_PREFIX)) {
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
