import { findAndUpdateTaskVersionDifferences } from './taskVersionUtil';

describe('findAndUpdateTaskVersionDifferences', () => {
  let taskVersions;

  beforeEach(() => {
    taskVersions = [
      [
        {
          fieldSetName: 'Test',
          propName: 'test',
          contents: [
            {
              fieldName: 'Name',
              content: 'Foo Bar',
              type: 'STRING',
            },
            {
              fieldName: 'Age',
              content: 50,
              type: 'INTEGER',
            },
          ],
          childSets: [
            {
              fieldSetName: '',
              contents: [
                {
                  fieldName: 'Name',
                  content: 'passenger1',
                  type: 'STRING',
                },
              ],
              type: 'null',
            },
            {
              fieldSetName: '',
              contents: [
                {
                  fieldName: 'Name',
                  content: 'passenger2',
                  type: 'STRING',
                },
              ],
              type: 'null',
            },
          ],
        },
      ],
      [
        {
          fieldSetName: 'Test',
          propName: 'test',
          contents: [
            {
              fieldName: 'Name',
              content: 'Bar Foo',
              type: 'STRING',
            },
            {
              fieldName: 'Age',
              content: 20,
              type: 'INTEGER',
            },
          ],
          childSets: [
            {
              fieldSetName: '',
              contents: [
                {
                  fieldName: 'Name',
                  content: 'passenger1',
                  type: 'STRING',
                },
              ],
              type: 'null',
            },
          ],
        },
      ],
    ];
  });

  it('should add "-CHANGED" suffix to field type when a difference is present', () => {
    findAndUpdateTaskVersionDifferences(taskVersions);
    expect(taskVersions[0][0].contents[0].type).toBe('STRING-CHANGED');
    expect(taskVersions[0][0].contents[1].type).toBe('INTEGER-CHANGED');
    expect(taskVersions[0][0].childSets[0].contents[0].type).toBe('STRING');
    expect(taskVersions[0][0].childSets[1].contents[0].type).toBe('STRING-CHANGED');
    expect(taskVersions[1][0].contents[0].type).toBe('STRING');
    expect(taskVersions[1][0].contents[1].type).toBe('INTEGER');
  });

  it('should handle mismatched lengthed "contents" arrays without error', () => {
    taskVersions[1][0].contents = [];

    findAndUpdateTaskVersionDifferences(taskVersions);

    expect(taskVersions[0][0].contents[0].type).toBe('STRING-CHANGED');
    expect(taskVersions[0][0].contents[1].type).toBe('INTEGER-CHANGED');
    expect(taskVersions[0][0].childSets[0].contents[0].type).toBe('STRING');
    expect(taskVersions[0][0].childSets[1].contents[0].type).toBe('STRING-CHANGED');
  });

  it('should return an object with correct "wasUpdated" and "differencesCounts" values', () => {
    const { wasUpdated, differencesCounts } = findAndUpdateTaskVersionDifferences(taskVersions);

    expect(wasUpdated).toBe(true);
    expect(differencesCounts).toEqual([3, 0]);
  });

  it('should handle when there are no childSets', () => {
    delete taskVersions[0][0].childSets;
    delete taskVersions[1][0].childSets;
    const { wasUpdated, differencesCounts } = findAndUpdateTaskVersionDifferences(taskVersions);

    expect(wasUpdated).toBe(true);
    expect(differencesCounts).toEqual([2, 0]);
  });
});
