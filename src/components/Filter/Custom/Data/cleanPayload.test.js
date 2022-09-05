import cleanPayload from './cleanPayload';

describe('Custom.Data.cleanPayload', () => {
  const ALPHA = 'alpha';
  const BRAVO = 'bravo';
  const CHARLIE = 'charlie';
  const DELTA = 'delta';

  const COMPONENTS = [
    { fieldId: ALPHA },
    { fieldId: BRAVO },
    { fieldId: CHARLIE },
    { fieldId: DELTA },
  ];

  it('should clean the filter payload', () => {
    const VISIBLE_COMPONENTS = COMPONENTS.filter((component) => component.fieldId !== DELTA);

    const DATA = {
      [ALPHA]: ALPHA,
      [BRAVO]: BRAVO,
      [CHARLIE]: CHARLIE,
      [DELTA]: DELTA,
    };

    const cleanedPayload = cleanPayload(VISIBLE_COMPONENTS, COMPONENTS, DATA);
    expect(Object.keys(cleanedPayload)).toHaveLength(3);
    expect(cleanedPayload).toMatchObject({
      [ALPHA]: ALPHA,
      [BRAVO]: BRAVO,
      [CHARLIE]: CHARLIE,
    });
  });
});
