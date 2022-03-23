import React from 'react';
import { formatKey, formatField, formatLinkField } from '../formatField';

describe('formatKey', () => {
  const toKeyOutput = (output) => {
    return <><span className="govuk-grid-key font__light">{output}</span></>;
  };

  describe('ANY type', () => {
    it.each([
      ['Key1'],
      ['Key2'],
    ])(
      'should format any type keys correctly', (content) => {
        expect(formatKey('ANY', content)).toEqual(toKeyOutput(content));
      },
    );
  });

  const toChangedKeyOutput = (output) => {
    return <><span className="govuk-grid-key font__light task-versions--highlight">{output}</span></>;
  };

  describe('ANY-CHANGED type', () => {
    it.each([
      ['Key3'],
      ['Key4'],
    ])(
      'should format any changed type keys correctly', (content) => {
        expect(formatKey('ANY-CHANGED', content)).toEqual(toChangedKeyOutput(content));
      },
    );
  });
});

const toChangedFieldOutput = (output) => {
  return <span className="task-versions--highlight">{output}</span>;
};

describe('formatField', () => {
  describe('BOOKING_DATETIME type', () => {
    it.each([
      ['2020-10-24T01:15:00,2020-11-08T14:00:00', '24 Oct 2020 at 01:15, 16 days before travel'],
      ['2020-10-24T01:15:00,2020-10-25T01:15:00', '24 Oct 2020 at 01:15, a day before travel'],
      ['2019-10-24T01:15:00,2020-11-08T14:00:00', '24 Oct 2019 at 01:15, a year before travel'],
      ['2017-10-24T01:15:00,2020-11-08T14:00:00', '24 Oct 2017 at 01:15, 3 years before travel'],
      ['2020-10-24T01:15:00,2020-11-24T14:00:00', '24 Oct 2020 at 01:15, a month before travel'],
      ['2020-09-24T01:15:00,2020-11-24T14:00:00', '24 Sep 2020 at 01:15, 2 months before travel'],
      ['2020-09-24T01:15:00,2020-09-24T02:15:00', '24 Sep 2020 at 01:15, an hour before travel'],
      ['2020-09-24T01:15:00,2020-09-24T03:15:00', '24 Sep 2020 at 01:15, 2 hours before travel'],
      ['2020-09-24T01:15:00', '24 Sep 2020 at 01:15'],
    ])(
      'should format booking datetime type fields correctly', (content, expectedOutput) => {
        expect(formatField('BOOKING_DATETIME', content)).toEqual(expectedOutput);
      },
    );
  });

  describe('BOOKING_DATETIME-CHANGED type', () => {
    it.each([
      ['2020-09-24T01:15:00,2020-09-24T03:15:00', '24 Sep 2020 at 01:15, 2 hours before travel'],
      ['2020-09-24T01:15:00', '24 Sep 2020 at 01:15'],
    ])(
      'should format changed booking datetime type fields correctly', (content, expectedOutput) => {
        expect(formatField('BOOKING_DATETIME-CHANGED', content)).toEqual(toChangedFieldOutput(expectedOutput));
      },
    );
  });

  describe('DISTANCE type', () => {
    it.each([
      ['100', '100m'],
      ['200', '200m'],
    ])(
      'should format distance type fields correctly', (content, expectedOutput) => {
        expect(formatField('DISTANCE', content)).toEqual(expectedOutput);
      },
    );
  });

  describe('DISTANCE-CHANGED type', () => {
    it.each([
      ['300', '300m'],
      ['400', '400m'],
    ])(
      'should format changed distance type fields correctly', (content, expectedOutput) => {
        expect(formatField('DISTANCE-CHANGED', content)).toEqual(toChangedFieldOutput(expectedOutput));
      },
    );
  });

  describe('WEIGHT type', () => {
    it.each([
      ['100', '100kg'],
      ['200', '200kg'],
    ])(
      'should format weight type fields correctly', (content, expectedOutput) => {
        expect(formatField('WEIGHT', content)).toEqual(expectedOutput);
      },
    );
  });

  describe('WEIGHT-CHANGED type', () => {
    it.each([
      ['300', '300kg'],
      ['400', '400kg'],
    ])(
      'should format changed weight type fields correctly', (content, expectedOutput) => {
        expect(formatField('WEIGHT-CHANGED', content)).toEqual(toChangedFieldOutput(expectedOutput));
      },
    );
  });

  describe('CURRENCY type', () => {
    it.each([
      ['100', '£100'],
      ['200.50', '£200.50'],
    ])(
      'should format currency type fields correctly', (content, expectedOutput) => {
        expect(formatField('CURRENCY', content)).toEqual(expectedOutput);
      },
    );
  });

  describe('CURRENCY-CHANGED type', () => {
    it.each([
      ['300', '£300'],
      ['400.99', '£400.99'],
    ])(
      'should format changed currency type fields correctly', (content, expectedOutput) => {
        expect(formatField('CURRENCY-CHANGED', content)).toEqual(toChangedFieldOutput(expectedOutput));
      },
    );
  });

  describe('SHORT_DATETIME type', () => {
    it.each([
      ['19035', '12/02/2022'],
      ['5644', '15/06/1985'],
    ])(
      'should format short date type fields correctly', (content, expectedOutput) => {
        expect(formatField('SHORT_DATETIME', content)).toEqual(expectedOutput);
      },
    );
  });

  describe('SHORT_DATETIME-CHANGED type', () => {
    it.each([
      ['6734', '09/06/1988'],
      ['0', '01/01/1970'],
    ])(
      'should format changed short date type fields correctly', (content, expectedOutput) => {
        expect(formatField('SHORT_DATETIME-CHANGED', content)).toEqual(toChangedFieldOutput(expectedOutput));
      },
    );
  });

  describe('DATETIME type', () => {
    it.each([
      ['2022-02-12T08:08:08', '12 Feb 2022 at 08:08'],
      ['1985-06-15T09:09:09', '15 Jun 1985 at 09:09'],
    ])(
      'should format date type fields correctly', (content, expectedOutput) => {
        expect(formatField('DATETIME', content)).toEqual(expectedOutput);
      },
    );
  });

  describe('DATETIME-CHANGED type', () => {
    it.each([
      ['1988-06-09T11:11:11', '9 Jun 1988 at 11:11'],
      ['1970-01-01T10:10:10', '1 Jan 1970 at 10:10'],
    ])(
      'should format changed date type fields correctly', (content, expectedOutput) => {
        expect(formatField('DATETIME-CHANGED', content)).toEqual(toChangedFieldOutput(expectedOutput));
      },
    );
  });

  describe('STRING type', () => {
    it.each([
      ['DON REVIE', 'DON REVIE'],
    ])(
      'should format string type fields correctly', (content, expectedOutput) => {
        expect(formatField('STRING', content)).toEqual(expectedOutput);
      },
    );
  });

  describe('STRING-CHANGED type', () => {
    it.each([
      ['MARCELO BIELSA', 'MARCELO BIELSA'],
    ])(
      'should format changed string type fields correctly', (content, expectedOutput) => {
        expect(formatField('STRING-CHANGED', content)).toEqual(toChangedFieldOutput(expectedOutput));
      },
    );
  });

  describe('Content not provided or null', () => {
    it('Should return Unknown if content is not provided for a fieldType', () => {
      const restult = formatField('STRING', null);
      expect(restult).toBe('Unknown');
    });
  });
});

describe('formatLinkField', () => {
  const link = 'https://host/endpoint';

  const toNewTabHref = (output) => {
    return <a href={link} rel="noreferrer noopener" target="_blank">{output}</a>;
  };

  describe('STRING type', () => {
    it.each([
      ['LUKE AYLING', toNewTabHref('LUKE AYLING')],
      ['PABLO HERNANDEZ', toNewTabHref('PABLO HERNANDEZ')],
    ])(
      'should format string type fields correctly', (content, expectedOutput) => {
        expect(formatLinkField('STRING', content, link)).toEqual(expectedOutput);
      },
    );
  });

  describe('STRING-CHANGED type', () => {
    it.each([
      ['TONY YEBOAH', toNewTabHref(toChangedFieldOutput('TONY YEBOAH'))],
      ['BILLY BREMNER', toNewTabHref(toChangedFieldOutput('BILLY BREMNER'))],
    ])(
      'should format changed string type fields correctly', (content, expectedOutput) => {
        expect(formatLinkField('STRING-CHANGED', content, link)).toEqual(expectedOutput);
      },
    );
  });
});
