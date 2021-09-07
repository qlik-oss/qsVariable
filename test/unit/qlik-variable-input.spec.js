import '../../src/qlik-variable-input';

describe('qlik-variable-input', () => {
  let definitionFn;
  let $;
  let qlik;
  let util;
  let prop;
  let css;
  let encoder;
  let createComponent;

  beforeAll(() => {
    definitionFn = getDefinitionFn();
  });

  beforeEach(() => {
    $ = () => ({
      html: () => ({ appendTo: () => {} }),
    });
    qlik = {};
    util = {};
    prop = {};
    css = {};
    encoder = {};

    createComponent = () => definitionFn($, qlik, util, prop, css, encoder);
  });

  it('should return definition with correct exposed properties', () => {
    const definition = createComponent();
    expect(Object.keys(definition).sort()).toEqual(['definition', 'initialProperties', 'paint', 'support'].sort());
  });
});
