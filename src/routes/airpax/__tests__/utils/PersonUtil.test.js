import renderer from 'react-test-renderer';

import { UNKNOWN_TEXT } from '../../../../constants';
import { PersonUtil } from '../../utils';

describe('PersonUtil', () => {
  const person = {
    name: {
      first: 'Isaiah',
      last: 'Ford',
      full: 'Isaiah Ford',
    },
    role: 'PASSENGER',
    dateOfBirth: '1966-05-13T00:00:00Z',
    gender: 'M',
    nationality: 'GBR',
    document: null,
    ssrCodes: ['ABC'],
    frequentFlyerNumber: 123456,
  };

  const coTravellers = [
    {
      entitySearchUrl: null,
      name: {
        first: null,
        last: 'MAUSSER',
        full: 'MAUSSER',
      },
      role: 'CREW',
      dateOfBirth: '1970-04-14T00:00:00Z',
      gender: 'F',
      nationality: 'GB',
      document: {
        type: 'Passport',
        number: '1234567',
        countryOfIssue: 'FR',
        nationality: 'GB',
        validFrom: '1970-04-14T00:00:00Z',
        validTo: '1970-04-14T00:00:00Z',
        name: 'Miss MAUSSER MAUSSER',
        dateOfBirth: '1970-04-14T00:00:00Z',
      },
      movementStats: null,
      frequentFlyerNumber: null,
      ssrCodes: [
        'DOCS',
        'AUTH',
      ],
    },
    {
      entitySearchUrl: null,
      name: {
        first: 'SHARON',
        last: 'MAUSSER',
        full: 'SHARON MAUSSER',
      },
      role: 'CREW',
      dateOfBirth: null,
      gender: null,
      nationality: 'FR',
      document: null,
      movementStats: null,
      frequentFlyerNumber: '763381878A',
      ssrCodes: [
        'DOCS',
        'AUTH',
      ],
    },
    {
      entitySearchUrl: null,
      name: {
        first: null,
        last: null,
        full: null,
      },
      role: 'CREW',
      dateOfBirth: '1967-06-10T00:00:00Z',
      gender: 'M',
      nationality: 'GB',
      document: null,
      movementStats: null,
      frequentFlyerNumber: null,
      ssrCodes: [
        'DOCS',
        'AUTH',
      ],
    },
  ];

  it('should get a person object if present', () => {
    const targetTaskMin = {
      movement: {
        person: {
          name: {
            first: 'Isaiah',
            last: 'Ford',
            full: 'Isaiah Ford',
          },
          role: 'PASSENGER',
          dateOfBirth: '1966-05-13T00:00:00Z',
          gender: 'M',
          nationality: 'GBR',
          document: null,
          ssrCodes: ['ABC'],
          frequentFlyerNumber: 123456,
        },
      },
    };

    const output = PersonUtil.get(targetTaskMin);
    expect(output).toEqual(person);
  });

  it('should get other persons if present', () => {
    const targetTaskMin = {
      movement: {
        otherPersons: [
          {
            name: {
              first: 'Isaiah',
              last: 'Ford',
              full: 'Isaiah Ford',
            },
            role: 'PASSENGER',
            dateOfBirth: '1966-05-13T00:00:00Z',
            gender: 'M',
            nationality: 'GBR',
            document: null,
            ssrCodes: ['ABC'],
            frequentFlyerNumber: 123456,
          },
        ],
      },
    };

    const output = PersonUtil.getOthers(targetTaskMin);
    expect(output).toEqual([person]);
  });

  it('should return total number of people within a movement with 1 person', () => {
    const targetTaskMin = {
      movement: {
        person: {
          name: {
            first: 'Isaiah',
            last: 'Ford',
            full: 'Isaiah Ford',
          },
          role: 'PASSENGER',
          dateOfBirth: '1966-05-13T00:00:00Z',
          gender: 'M',
          nationality: 'GBR',
          document: null,
          ssrCodes: 'ABC',
          frequentFlyerNumber: 123456,
        },
        otherPersons: [],
      },
    };

    const output = PersonUtil.totalPersons(targetTaskMin);
    expect(output).toEqual(1);
  });

  it('should return total number of people within a movement with multiple persons', () => {
    const targetTaskMin = {
      movement: {
        person: {
          name: {
            first: 'Isaiah',
            last: 'Ford',
            full: 'Isaiah Ford',
          },
          role: 'PASSENGER',
          dateOfBirth: '1966-05-13T00:00:00Z',
          gender: 'M',
          nationality: 'GBR',
          document: null,
        },
        otherPersons: [
          {
            name: {
              first: 'John',
              last: 'Cheese',
              full: 'John Cheese',
            },
            role: 'PASSENGER',
            dateOfBirth: '1967-05-13T00:00:00Z',
            gender: 'M',
            nationality: 'GBR',
            document: null,
          },
        ],
      },
    };

    const output = PersonUtil.totalPersons(targetTaskMin);
    expect(output).toEqual(2);
  });

  it('should return nationality if present', () => {
    const output = PersonUtil.nationality(person);
    expect(output).toEqual(person.nationality);
  });

  it('should return dob if present', () => {
    const output = PersonUtil.dob(person);
    expect(output).toEqual('13 May 1966');
  });

  it('should show gender text when person is of gender male', () => {
    const output = PersonUtil.gender(person);
    expect(output).toEqual('Male');
  });

  it('should show gender text when person is of gender female', () => {
    person.gender = 'F';
    const output = PersonUtil.gender(person);
    expect(output).toEqual('Female');
  });

  it('should show unknown when person is of no specified gender', () => {
    person.gender = '';
    const output = PersonUtil.gender(person);
    expect(output).toEqual(UNKNOWN_TEXT);
  });

  it('should show unknown when gender is null', () => {
    person.gender = null;
    const output = PersonUtil.gender(person);
    expect(output).toEqual(UNKNOWN_TEXT);
  });

  it('should show unknown when gender is undefined', () => {
    person.gender = undefined;
    const output = PersonUtil.gender(person);
    expect(output).toEqual(UNKNOWN_TEXT);
  });

  it('should return first name if present', () => {
    const output = PersonUtil.firstname(person);
    expect(output).toEqual(person.name.first);
  });

  it('should return last name if present', () => {
    const output = PersonUtil.lastname(person);
    expect(output).toEqual(person.name.last.toUpperCase());
  });

  it('should return country name if nationality present', () => {
    const output = PersonUtil.countryName(person);
    expect(output).toEqual('United Kingdom');
  });

  it('should return frequent flyer number if present', () => {
    const output = PersonUtil.frequentFlyerNumber(person);
    expect(output).toEqual(person.frequentFlyerNumber);
  });

  it('should return SSR codes if present', () => {
    const output = PersonUtil.ssrCodes(person);
    expect(output).toEqual(person.ssrCodes.join(', '));
  });

  it('should calculate and return age if dob present', () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 10);
    person.dateOfBirth = date.toISOString();

    const output = PersonUtil.age(person);
    expect(output).toEqual(10);
  });

  it('should return a formatted co-travellers block', () => {
    const otherPersons = [
      {
        name: {
          first: 'Isaiah',
          last: 'Ford',
          full: 'Isaiah Ford',
        },
        role: 'PASSENGER',
        dateOfBirth: '1966-05-13T00:00:00Z',
        gender: 'M',
        nationality: 'GBR',
        document: null,
      },
      {
        name: {
          first: 'Joe',
          last: 'Bloggs',
          full: 'Joe Bloggs',
        },
        role: 'PASSENGER',
        dateOfBirth: '1978-05-13T00:00:00Z',
        gender: 'M',
        nationality: 'FRA',
        document: null,
      },
    ];
    const tree = renderer.create(PersonUtil.toOthers(otherPersons)).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should return a list of all persons within the movement', () => {
    const output = PersonUtil.allPersons(person, coTravellers);
    expect(output.length).toEqual(4);
  });
});
