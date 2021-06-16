import dayjs from 'dayjs';
import findAndFormat from '../findAndFormat';
import { SHORT_DATE_FORMAT } from '../../constants';

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
      prop10: 13933,
      prop11: [
        'string1',
        'string2',
        'string3',
      ],
    };
  });

  it('should find the key specified and apply provided function', () => {
    findAndFormat(input, 'prop9', (prop) => prop.split('').reverse().join(''));
    expect(input.prop6[1].prop9).toBe('aet');
    expect(input.prop9).toBe('halb');
  });
  it('should handle unfound keys gracefully', () => {
    expect(() => findAndFormat(input, 'does-not-exist', () => { })).not.toThrow();
  });
  it('should format fields with provided callback', () => {
    findAndFormat(
      input,
      'prop10',
      (prop) => dayjs(0).add(prop, 'days').format(SHORT_DATE_FORMAT),
    );
    findAndFormat(
      input,
      'prop11',
      (prop) => prop.map((string) => ({ customProp: string })),
    );
    expect(input.prop10).toBe('24/02/2008');
    expect(input.prop11).toEqual([
      {
        customProp: 'string1',
      },
      {
        customProp: 'string2',
      },
      {
        customProp: 'string3',
      },
    ]);
  });
});
