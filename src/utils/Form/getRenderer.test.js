import getRenderer, { Renderers, REACT_FORM_PREFIXS } from './getRenderer';

describe('components.utils.Form', () => {
  describe('getRenderer', () => {
    it(`should return "${Renderers.FORM_IO}" by default`, () => {
      expect(getRenderer(null)).toEqual(Renderers.FORM_IO);
    });

    it(`should return "${Renderers.FORM_IO}" when the form has no name`, () => {
      expect(getRenderer({})).toEqual(Renderers.FORM_IO);
    });

    it(`should return "${Renderers.FORM_IO}" when the form name does not begin with ${REACT_FORM_PREFIXS.join(',')}`, () => {
      expect(getRenderer({ name: 'alpha' })).toEqual(Renderers.FORM_IO);
    });

    it(`should return "${Renderers.REACT}" when the form name begins with ${REACT_FORM_PREFIXS.join(',')}`, () => {
      expect(getRenderer({ name: 'cop-alpha' })).toEqual(Renderers.REACT);
    });

    it(`should return "${Renderers.FORM_IO}" when the form name contains but does not begin with ${REACT_FORM_PREFIXS.join(',')}`, () => {
      expect(getRenderer({ name: 'alpha-cop-bravo' })).toEqual(Renderers.FORM_IO);
    });

    it(`should return "${Renderers.REACT}" when the form name is a string that begins with ${REACT_FORM_PREFIXS.join(',')}`, () => {
      expect(getRenderer('cop-alpha')).toEqual(Renderers.REACT);
    });

    it(`should return "${Renderers.FORM_IO}" when the form name is a string that contains but does not begin with ${REACT_FORM_PREFIXS.join(',')}`, () => {
      expect(getRenderer('alpha-cop-bravo')).toEqual(Renderers.FORM_IO);
    });
  });
});
