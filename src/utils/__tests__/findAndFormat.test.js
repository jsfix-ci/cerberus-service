import findAndFormat from '../findAndFormat';

describe('findAndFormat', () => {
  let input;

  beforeEach(() => {
    input = {
      prop1: {
        prop2: {
          prop3: {
            prop4: 'hello',
            prop5: 'world',
          },
        },
      },
      prop6: [
        {
          prop7: 'foo',
          prop8: 'bar',
        },
        {
          prop7: 'cheese',
          prop9: 'tea',
        },
      ],
      prop9: 'blah',
    };
  });

  it('should find the key specified and apply provided function', () => {
    findAndFormat(input, 'prop9', (prop) => prop.split('').reverse().join(''));
    expect(input.prop6[1].prop9).toBe('aet');
    expect(input.prop9).toBe('halb');
  });
  it('should handle unfound keys gracefully', () => {
    expect(() => findAndFormat(input, 'does-not-exist', () => {})).not.toThrow();
  });
});
