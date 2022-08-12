import { screen, render } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { RORO_ACCOMPANIED_FREIGHT } from '../../../../utils/constants';
import {
  renderBookingSection,
  renderVehicleSection,
  renderTrailerSection,
  renderOccupantsSection,
  renderPrimaryTraveller,
  renderPrimaryTravellerDocument,
  renderOccupantCarrierCountsSection,
  renderDocumentExpiry,
} from '../../TaskDetails/TaskVersionsMode/SectionRenderer';

import {
  hasDriverNoPaxHasCategoryCounts,
  noDriverNoPaxHasCategoryCounts,
  noDriverNoPaxNoCategoryCounts,
  hasDriverHasPaxHasCategoryCounts,
  noDriverHasPaxHasCategoryCounts,
  noDriverNoPaxNoCategoryAndNoUnknownCounts,
} from '../../__fixtures__/section-renderer/sectionRendererTaskDetails';

describe('SectionRenderer', () => {
  describe('renderBookingSection', () => {
    it('should return undefined if contents is undefined', () => {
      const input = {
        fieldSetName: 'field-set-name',
      };

      const section = renderBookingSection(input);

      expect(section).toBeUndefined();
    });

    it('should return undefined if contents is null', () => {
      const input = {
        fieldSetName: 'field-set-name',
        contents: null,
      };

      const section = renderBookingSection(input);

      expect(section).toBeUndefined();
    });

    it('should return undefined if contents is empty', () => {
      const input = {
        fieldSetName: 'field-set-name',
        contents: [],
      };

      const section = renderBookingSection(input);

      expect(section).toBeUndefined();
    });

    it('should return fields if not hidden', () => {
      const input = {
        fieldSetName: 'field-set-name',
        contents: [
          {
            fieldName: 'Field 1',
            type: 'STRING',
            content: 'value 1',
            versionLastUpdated: null,
            propName: 'field1',
          },
          {
            fieldName: 'Field 2',
            type: 'STRING',
            content: 'value 2',
            versionLastUpdated: null,
            propName: 'field2',
          },
        ],
      };

      const tree = renderer.create(renderBookingSection(input)).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should not render hidden fields', () => {
      const input = {
        fieldSetName: 'field-set-name',
        contents: [
          {
            fieldName: 'Field 1',
            type: 'HIDDEN',
            content: 'value 1',
            versionLastUpdated: null,
            propName: 'field1',
          },
        ],
      };

      const tree = renderer.create(renderBookingSection(input)).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should render replaced field name for date and time and check-in', () => {
      const input = {
        fieldSetName: 'field-set-name',
        contents: [
          {
            fieldName: 'Date and time',
            type: 'STRING',
            content: 'value 1',
            versionLastUpdated: null,
            propName: 'field1',
          },
          {
            fieldName: 'Check-in',
            type: 'STRING',
            content: 'value 2',
            versionLastUpdated: null,
            propName: 'field2',
          },
        ],
      };

      const tree = renderer.create(renderBookingSection(input)).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should leave field name for date and time and check-in untouched if not a match', () => {
      const input = {
        fieldSetName: 'field-set-name',
        contents: [
          {
            fieldName: 'Date and timee',
            type: 'STRING',
            content: 'value 1',
            versionLastUpdated: null,
            propName: 'field1',
          },
          {
            fieldName: 'Check-inn',
            type: 'STRING',
            content: 'value 2',
            versionLastUpdated: null,
            propName: 'field2',
          },
        ],
      };

      const tree = renderer.create(renderBookingSection(input)).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('renderVehicleSection', () => {
    it('should return undefined if movement mode is RORO_UNACCOMPANIED_FREIGHT', () => {
      const input = {
        contents: [
          {
            fieldName: 'Vehicle registration',
            type: 'STRING',
            content: 'KP07YXG',
            versionLastUpdated: null,
            propName: 'registrationNumber',
          },
        ],
      };

      const body = renderVehicleSection(input, 'RORO_UNACCOMPANIED_FREIGHT');

      expect(body).toBeUndefined();
    });

    it('should return undefined if contents is empty', () => {
      const input = {
        contents: [],
      };

      const section = renderVehicleSection(input, 'RORO_TOURIST');

      expect(section).toBeUndefined();
    });

    it('should return fields if not hidden and should only show vehicle specific fields', () => {
      const input = {
        contents: [
          {
            fieldName: 'Vehicle registration',
            type: 'STRING',
            content: 'GB09KLT',
            versionLastUpdated: null,
            propName: 'registrationNumber',
          },
          {
            fieldName: 'Make',
            type: 'STRING',
            content: 'FORD',
            versionLastUpdated: null,
            propName: 'make',
          },
          {
            fieldName: 'Model',
            type: 'STRING',
            content: 'TRANSIT',
            versionLastUpdated: null,
            propName: 'model',
          },
          {
            fieldName: 'Type',
            type: 'STRING',
            content: 'VAN',
            versionLastUpdated: null,
            propName: 'type',
          },
          {
            fieldName: 'Country of registration',
            type: 'STRING',
            content: 'GB',
            versionLastUpdated: null,
            propName: 'registrationNationality',
          },
          {
            fieldName: 'Colour',
            type: 'STRING',
            content: 'RED',
            versionLastUpdated: null,
            propName: 'colour',
          },
          {
            fieldName: 'Net weight',
            type: 'WEIGHT',
            content: '3455kg',
            versionLastUpdated: null,
            propName: 'netWeight',
          },
        ],
      };

      const tree = renderer.create(renderVehicleSection(input, 'RORO_TOURIST')).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should not render hidden fields', () => {
      const input = {
        contents: [
          {
            fieldName: 'Vehicle registration',
            type: 'HIDDEN',
            content: 'KP07YXG',
            versionLastUpdated: null,
            propName: 'registrationNumber',
          },
        ],
      };

      const tree = renderer.create(renderVehicleSection(input, 'RORO_TOURIST')).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should render entity search link if registration number and link field are present', () => {
      const input = {
        contents: [
          {
            fieldName: 'Vehicle registration',
            type: 'STRING',
            content: 'KP07YXG',
            versionLastUpdated: null,
            propName: 'registrationNumber',
          },
          {
            fieldName: 'Entity Search URL',
            type: 'HIDDEN',
            content: 'http://localhost:4020/search?term=1234567890&type=VEHICLE&fields=["id"]',
            versionLastUpdated: null,
            propName: 'vehicleEntitySearchUrl',
          },
        ],
      };

      const tree = renderer.create(renderVehicleSection(input, 'RORO_TOURIST')).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('renderTrailerSection', () => {
    it('should return undefined if content of first trailer field is null', () => {
      const input = {
        contents: [
          {
            fieldName: 'Trailer registration number',
            type: 'STRING',
            content: null,
            versionLastUpdated: null,
            propName: 'trailerRegistrationNumber',
          },
        ],
      };

      const section = renderTrailerSection(input, 'RORO_ACCOMPANIED_FREIGHT');
      expect(section).toBeUndefined();
    });

    it('should return fields if not hidden and should only show trailer specific fields', () => {
      const input = {
        contents: [
          {
            fieldName: 'Trailer registration number',
            type: 'STRING',
            content: 'LQ18ZAB',
            versionLastUpdated: null,
            propName: 'trailerRegistrationNumber',
          },
          {
            fieldName: 'Trailer Type',
            type: 'STRING',
            content: 'TR',
            versionLastUpdated: null,
            propName: 'trailerType',
          },
          {
            fieldName: 'Trailer country of registration',
            type: 'STRING',
            content: 'GB',
            versionLastUpdated: null,
            propName: 'trailerRegistrationNationality',
          },
          {
            fieldName: 'Trailer length',
            type: 'DISTANCE',
            content: '75',
            versionLastUpdated: null,
            propName: 'trailerLength',
          },
          {
            fieldName: 'Trailer height',
            type: 'DISTANCE',
            content: '5',
            versionLastUpdated: null,
            propName: 'trailerHeight',
          },
          {
            fieldName: 'Empty or loaded',
            type: 'STRING',
            content: 'Loaded',
            versionLastUpdated: null,
            propName: 'trailerEmptyOrLoaded',
          },
          {
            fieldName: 'Make',
            type: 'STRING',
            content: 'FORD',
            versionLastUpdated: null,
            propName: 'make',
          },
        ],
      };

      const tree = renderer.create(renderTrailerSection(input, 'RORO_ACCOMPANIED_FREIGHT')).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should not render hidden fields', () => {
      const input = {
        contents: [
          {
            fieldName: 'Trailer registration number',
            type: 'HIDDEN',
            content: 'LQ18ZAB',
            versionLastUpdated: null,
            propName: 'trailerRegistrationNumber',
          },
        ],
      };

      const tree = renderer.create(renderTrailerSection(input, 'RORO_ACCOMPANIED_FREIGHT')).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should render entity search link if trailer registration number and link field are present', () => {
      const input = {
        contents: [
          {
            fieldName: 'Trailer registration number',
            type: 'STRING',
            content: 'LQ18ZYH',
            versionLastUpdated: null,
            propName: 'trailerRegistrationNumber',
          },
          {
            fieldName: 'Entity Search URL',
            type: 'HIDDEN',
            content: 'http://localhost:4020/search?term=1212121212&type=VEHICLE&fields=["id"]',
            versionLastUpdated: null,
            propName: 'trailerEntitySearchUrl',
          },
        ],
      };

      const tree = renderer.create(renderTrailerSection(input, 'RORO_ACCOMPANIED_FREIGHT')).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('renderOccupantsSection', () => {
    it('should return undefined if second passenger is null or undefined', () => {
      const input = {
        fieldSetName: 'Passengers',
        childSets: [
          {
            contents: [
              {
                fieldName: 'Name',
                type: 'STRING',
                content: 'MR FIRST PASSENGER',
                versionLastUpdated: null,
                propName: 'name',
              },
            ],
          },
        ],
      };

      const section = renderOccupantsSection(input, 'any-icon');
      expect(section).toBeUndefined();
    });

    it('should return second passenger fields if present', () => {
      const input = {
        fieldSetName: 'Passengers',
        childSets: [
          {
            contents: [
              {
                fieldName: 'Name',
                type: 'STRING',
                content: 'MR FIRST PASSENGER',
                versionLastUpdated: null,
                propName: 'name',
              },
            ],
          },
          {
            contents: [
              {
                fieldName: 'Name',
                type: 'STRING',
                content: 'MRS SECOND PASSENGER',
                versionLastUpdated: null,
                propName: 'name',
              },
            ],
          },
        ],
      };
      const tree = renderer.create(renderOccupantsSection(input, 'any-icon')).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should return second passenger entity search link if fields if present', () => {
      const input = {
        fieldSetName: 'Passengers',
        childSets: [
          {
            contents: [
              {
                fieldName: 'Name',
                type: 'STRING',
                content: 'MR FIRST PASSENGER',
                versionLastUpdated: null,
                propName: 'name',
              },
            ],
          },
          {
            contents: [
              {
                fieldName: 'Name',
                type: 'STRING',
                content: 'MRS SECOND PASSENGER',
                versionLastUpdated: null,
                propName: 'name',
              },
              {
                fieldName: 'Entity Search URL',
                type: 'HIDDEN',
                content: 'http://localhost:4020/search?term=98989898&type=PERSON&fields=["id"]',
                versionLastUpdated: null,
                propName: 'entitySearchUrl',
              },
            ],
          },
        ],
      };

      const tree = renderer.create(renderOccupantsSection(input, 'any-icon')).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should not show passenger heading if movement mode icon is the tourist group icon', () => {
      const input = {
        fieldSetName: 'Passengers',
        childSets: [
          {
            contents: [
              {
                fieldName: 'Name',
                type: 'STRING',
                content: 'MR FIRST PASSENGER',
                versionLastUpdated: null,
                propName: 'name',
              },
            ],
          },
          {
            contents: [
              {
                fieldName: 'Name',
                type: 'STRING',
                content: 'MRS SECOND PASSENGER',
                versionLastUpdated: null,
                propName: 'name',
              },
            ],
          },
        ],
      };

      const tree = renderer.create(renderOccupantsSection(input, 'c-icon-group')).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should return other passenger fields if present', () => {
      const input = {
        fieldSetName: 'Passengers',
        childSets: [
          {
            contents: [
              {
                fieldName: 'Name',
                type: 'STRING',
                content: 'MR FIRST PASSENGER',
                versionLastUpdated: null,
                propName: 'name',
              },
            ],
          },
          {
            contents: [
              {
                fieldName: 'Name',
                type: 'STRING',
                content: 'MRS SECOND PASSENGER',
                versionLastUpdated: null,
                propName: 'name',
              },
            ],
          },
          {
            contents: [
              {
                fieldName: 'Name',
                type: 'STRING',
                content: 'MR OTHER PASSENGER',
                versionLastUpdated: null,
                propName: 'name',
              },
            ],
          },
        ],
      };

      const tree = renderer.create(renderOccupantsSection(input, 'any-icon')).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should return other passenger entity search link if fields if present', () => {
      const input = {
        fieldSetName: 'Passengers',
        childSets: [
          {
            contents: [
              {
                fieldName: 'Name',
                type: 'STRING',
                content: 'MR FIRST PASSENGER',
                versionLastUpdated: null,
                propName: 'name',
              },
            ],
          },
          {
            contents: [
              {
                fieldName: 'Name',
                type: 'STRING',
                content: 'MRS SECOND PASSENGER',
                versionLastUpdated: null,
                propName: 'name',
              },
            ],
          },
          {
            contents: [
              {
                fieldName: 'Name',
                type: 'STRING',
                content: 'MR OTHER PASSENGER',
                versionLastUpdated: null,
                propName: 'name',
              },
              {
                fieldName: 'Entity Search URL',
                type: 'HIDDEN',
                content: 'http://localhost:4020/search?term=56565656&type=PERSON&fields=["id"]',
                versionLastUpdated: null,
                propName: 'entitySearchUrl',
              },
            ],
          },
        ],
      };

      const tree = renderer.create(renderOccupantsSection(input, 'any-icon')).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should return mulitple other passenger fields if present', () => {
      const input = {
        fieldSetName: 'Passengers',
        childSets: [
          {
            contents: [
              {
                fieldName: 'Name',
                type: 'STRING',
                content: 'MR FIRST PASSENGER',
                versionLastUpdated: null,
                propName: 'name',
              },
            ],
          },
          {
            contents: [
              {
                fieldName: 'Name',
                type: 'STRING',
                content: 'MRS SECOND PASSENGER',
                versionLastUpdated: null,
                propName: 'name',
              },
            ],
          },
          {
            contents: [
              {
                fieldName: 'Name',
                type: 'STRING',
                content: 'MR OTHER PASSENGER 1',
                versionLastUpdated: null,
                propName: 'name',
              },
            ],
          },
          {
            contents: [
              {
                fieldName: 'Name',
                type: 'STRING',
                content: 'MRS OTHER PASSENGER 2',
                versionLastUpdated: null,
                propName: 'name',
              },
            ],
          },
        ],
      };

      const tree = renderer.create(renderOccupantsSection(input, 'any-icon')).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should not render hidden fields', () => {
      const input = {
        fieldSetName: 'Passengers',
        childSets: [
          {
            contents: [
              {
                fieldName: 'Name',
                type: 'STRING',
                content: 'MR FIRST PASSENGER',
                versionLastUpdated: null,
                propName: 'name',
              },
            ],
          },
          {
            contents: [
              {
                fieldName: 'Name',
                type: 'HIDDEN',
                content: 'MRS SECOND PASSENGER',
                versionLastUpdated: null,
                propName: 'name',
              },
            ],
          },
          {
            contents: [
              {
                fieldName: 'Name',
                type: 'HIDDEN',
                content: 'MR OTHER PASSENGER 1',
                versionLastUpdated: null,
                propName: 'name',
              },
            ],
          },
          {
            contents: [
              {
                fieldName: 'Name',
                type: 'HIDDEN',
                content: 'MRS OTHER PASSENGER 2',
                versionLastUpdated: null,
                propName: 'name',
              },
            ],
          },
        ],
      };

      const tree = renderer.create(renderOccupantsSection(input, 'any-icon')).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should render occupants when bookingDate value is null', () => {
      const input = {
        fieldSetName: 'Passengers',
        childSets: [
          {
            contents: [
              {
                fieldName: 'Name',
                type: 'STRING',
                content: 'MR FIRST PASSENGER',
                versionLastUpdated: null,
                propName: 'name',
              },
            ],
          },
          {
            contents: [
              {
                fieldName: 'Name',
                type: 'STRING',
                content: 'MRS SECOND PASSENGER',
                versionLastUpdated: null,
                propName: 'name',
              },
            ],
          },
          {
            contents: [
              {
                fieldName: 'Name',
                type: 'STRING',
                content: 'MR OTHER PASSENGER',
                versionLastUpdated: null,
                propName: 'name',
              },
              {
                fieldName: 'Entity Search URL',
                type: 'HIDDEN',
                content: 'http://localhost:4020/search?term=56565656&type=PERSON&fields=["id"]',
                versionLastUpdated: null,
                propName: 'entitySearchUrl',
              },
            ],
          },
        ],
      };

      const bookingDate = {
        fieldName: 'Date and time',
        type: 'BOOKING_DATETIME',
        content: null,
        versionLastUpdated: null,
        propName: 'dateBooked',
      };

      const tree = renderer.create(renderOccupantsSection(input, 'any-icon', bookingDate)).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should render occupants when passport country of issue code is invalid', () => {
      const input = {
        fieldSetName: 'Passengers',
        childSets: [
          {
            contents: [
              {
                fieldName: 'Name',
                type: 'STRING',
                content: 'MR FIRST PASSENGER',
                versionLastUpdated: null,
                propName: 'name',
              },
              {
                fieldName: 'Travel document country of issue',
                type: 'STRING',
                content: 'UN',
                versionLastUpdated: null,
                propName: 'docCountryOfIssue',
              },
            ],
          },
          {
            contents: [
              {
                fieldName: 'Name',
                type: 'STRING',
                content: 'MRS SECOND PASSENGER',
                versionLastUpdated: null,
                propName: 'name',
              },
              {
                fieldName: 'Travel document country of issue',
                type: 'STRING',
                content: 'UN',
                versionLastUpdated: null,
                propName: 'docCountryOfIssue',
              },
            ],
          },
          {
            contents: [
              {
                fieldName: 'Name',
                type: 'STRING',
                content: 'MR OTHER PASSENGER',
                versionLastUpdated: null,
                propName: 'name',
              },
              {
                fieldName: 'Entity Search URL',
                type: 'HIDDEN',
                content: 'http://localhost:4020/search?term=56565656&type=PERSON&fields=["id"]',
                versionLastUpdated: null,
                propName: 'entitySearchUrl',
              },
            ],
          },
        ],
      };

      const bookingDate = {
        fieldName: 'Date and time',
        type: 'BOOKING_DATETIME',
        content: null,
        versionLastUpdated: null,
        propName: 'dateBooked',
      };

      render(renderOccupantsSection(input, 'any-icon', bookingDate));
      expect(screen.queryAllByText('Unknown (Unknown)')).toHaveLength(2);
    });
  });

  describe('renderPrimaryTraveller', () => {
    it('should return undefined if first childset contents is empty', () => {
      const input = {
        childSets: [
          {
            contents: [],
          },
        ],
      };

      const section = renderPrimaryTraveller(input, 'any-icon');
      expect(section).toBeUndefined();
    });

    it('should render traveller and document fields if icon is single tourist icon', () => {
      const input = {
        childSets: [
          {
            contents: [
              {
                fieldName: 'Name',
                type: 'STRING',
                content: 'MR PRIMARY TRAVELLER',
                versionLastUpdated: null,
                propName: 'name',
              },
              {
                fieldName: 'Date of birth',
                type: 'SHORT_DATE',
                content: '4171',
                versionLastUpdated: null,
                propName: 'dob',
              },
              {
                fieldName: 'Gender',
                type: 'STRING',
                content: 'M',
                versionLastUpdated: null,
                propName: 'gender',
              },
              {
                fieldName: 'Nationality',
                type: 'STRING',
                content: 'GB',
                versionLastUpdated: null,
                propName: 'nationality',
              },
              {
                fieldName: 'Travel document type',
                type: 'STRING',
                content: 'PASSPORT',
                versionLastUpdated: null,
                propName: 'docType',
              },
              {
                fieldName: 'Travel document number',
                type: 'STRING',
                content: 'ST0111111',
                versionLastUpdated: null,
                propName: 'docNumber',
              },
              {
                fieldName: 'Travel document expiry',
                type: 'SHORT_DATE',
                content: '18628',
                versionLastUpdated: null,
                propName: 'docExpiry',
              },
              {
                fieldName: 'Pole ID',
                type: 'String',
                content: '222841bd7ba8e303cad527111a5de222',
                versionLastUpdated: null,
                propName: 'poleId',
              },
            ],
          },
        ],
      };

      const tree = renderer.create(renderPrimaryTraveller(input, 'c-icon-person')).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should only render traveller fields and not document fields if icon is not single tourist icon', () => {
      const input = {
        childSets: [
          {
            contents: [
              {
                fieldName: 'Name',
                type: 'STRING',
                content: 'MR PRIMARY TRAVELLER',
                versionLastUpdated: null,
                propName: 'name',
              },
              {
                fieldName: 'Date of birth',
                type: 'SHORT_DATE',
                content: '4171',
                versionLastUpdated: null,
                propName: 'dob',
              },
              {
                fieldName: 'Gender',
                type: 'STRING',
                content: 'M',
                versionLastUpdated: null,
                propName: 'gender',
              },
              {
                fieldName: 'Nationality',
                type: 'STRING',
                content: 'GB',
                versionLastUpdated: null,
                propName: 'nationality',
              },
              {
                fieldName: 'Travel document type',
                type: 'STRING',
                content: 'PASSPORT',
                versionLastUpdated: null,
                propName: 'docType',
              },
            ],
          },
        ],
      };

      const tree = renderer.create(renderPrimaryTraveller(input, 'any-icon')).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should render primary traveller entity search link if fields are present', () => {
      const input = {
        childSets: [
          {
            contents: [
              {
                fieldName: 'Name',
                type: 'STRING',
                content: 'MR PRIMARY TRAVELLER',
                versionLastUpdated: null,
                propName: 'name',
              },
              {
                fieldName: 'Entity Search URL',
                type: 'HIDDEN',
                content: 'http://localhost:4020/search?term=2828282828&type=PERSON&fields=["id"]',
                versionLastUpdated: null,
                propName: 'entitySearchUrl',
              },
            ],
          },
        ],
      };

      const tree = renderer.create(renderPrimaryTraveller(input, 'any-icon')).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('renderPrimaryTravellerDocument', () => {
    it('should return undefined if first childset contents is empty', () => {
      const input = {
        childSets: [
          {
            contents: [],
          },
        ],
      };

      const section = renderPrimaryTravellerDocument(input, 'any-icon');
      expect(section).toBeUndefined();
    });

    it('should render only render document fields', () => {
      const input = {
        childSets: [
          {
            contents: [
              {
                fieldName: 'Name',
                type: 'STRING',
                content: 'MR PRIMARY TRAVELLER',
                versionLastUpdated: null,
                propName: 'name',
              },
              {
                fieldName: 'Travel document type',
                type: 'STRING',
                content: 'PASSPORT',
                versionLastUpdated: null,
                propName: 'docType',
              },
              {
                fieldName: 'Travel document number',
                type: 'STRING',
                content: 'ST0111111',
                versionLastUpdated: null,
                propName: 'docNumber',
              },
              {
                fieldName: 'Travel document expiry',
                type: 'SHORT_DATE',
                content: '18628',
                versionLastUpdated: null,
                propName: 'docExpiry',
              },
            ],
          },
        ],
      };

      const tree = renderer.create(renderPrimaryTravellerDocument(input, 'any-icon')).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('renderOccupantCarrierCountsSection', () => {
    it('should render category counts when there is a driver, no passengers and counts are available', () => {
      const driverField = hasDriverNoPaxHasCategoryCounts.find(({ propName }) => propName === 'driver');
      const passengersField = hasDriverNoPaxHasCategoryCounts.find(({ propName }) => propName === 'passengers');
      const passengersMetadata = hasDriverNoPaxHasCategoryCounts.find(({ propName }) => propName === 'occupants');

      const tree = renderer.create(renderOccupantCarrierCountsSection(driverField,
        passengersField, passengersMetadata, RORO_ACCOMPANIED_FREIGHT)).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should render category counts when there is no driver, no passengers but category counts are available', () => {
      const driverField = noDriverNoPaxHasCategoryCounts.find(({ propName }) => propName === 'driver');
      const passengersField = noDriverNoPaxHasCategoryCounts.find(({ propName }) => propName === 'passengers');
      const passengersMetadata = noDriverNoPaxHasCategoryCounts.find(({ propName }) => propName === 'occupants');

      const tree = renderer.create(renderOccupantCarrierCountsSection(driverField,
        passengersField, passengersMetadata, RORO_ACCOMPANIED_FREIGHT)).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should render unknown category count when there is no driver, 0 passengers but no valid category counts are available', () => {
      const driverField = noDriverNoPaxNoCategoryCounts.find(({ propName }) => propName === 'driver');
      const passengersField = noDriverNoPaxNoCategoryCounts.find(({ propName }) => propName === 'passengers');
      const passengersMetadata = noDriverNoPaxNoCategoryCounts.find(({ propName }) => propName === 'occupants');

      const tree = renderer.create(renderOccupantCarrierCountsSection(driverField,
        passengersField, passengersMetadata, RORO_ACCOMPANIED_FREIGHT)).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should not render category count when there is a driver, 1+ passenger(s) and does/ does not have category counts', () => {
      const driverField = hasDriverHasPaxHasCategoryCounts.find(({ propName }) => propName === 'driver');
      const passengersField = hasDriverHasPaxHasCategoryCounts.find(({ propName }) => propName === 'passengers');
      const passengersMetadata = hasDriverHasPaxHasCategoryCounts.find(({ propName }) => propName === 'occupants');

      const tree = renderer.create(renderOccupantCarrierCountsSection(driverField,
        passengersField, passengersMetadata, RORO_ACCOMPANIED_FREIGHT)).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should not render category count when there is no driver, but have one or more passengers and has category counts', () => {
      const driverField = noDriverHasPaxHasCategoryCounts.find(({ propName }) => propName === 'driver');
      const passengersField = noDriverHasPaxHasCategoryCounts.find(({ propName }) => propName === 'passengers');
      const passengersMetadata = noDriverHasPaxHasCategoryCounts.find(({ propName }) => propName === 'occupants');

      const tree = renderer.create(renderOccupantCarrierCountsSection(
        driverField, passengersField, passengersMetadata, RORO_ACCOMPANIED_FREIGHT,
      )).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should not render category count section there is no driver, no passengers and unknown counts is null', () => {
      const driverField = noDriverNoPaxNoCategoryAndNoUnknownCounts.find(({ propName }) => propName === 'driver');
      const passengersField = noDriverNoPaxNoCategoryAndNoUnknownCounts.find(({ propName }) => propName === 'passengers');
      const passengersMetadata = noDriverNoPaxNoCategoryAndNoUnknownCounts.find(({ propName }) => propName === 'occupants');

      const section = renderOccupantCarrierCountsSection(driverField,
        passengersField, passengersMetadata, RORO_ACCOMPANIED_FREIGHT);
      expect(section).toBeUndefined();
    });
  });

  describe('Render the difference of travel booked date and passport expirty date', () => {
    it('Should render time left for passport expiry before travel booked date', () => {
      const arrivalTime = '2020-08-03T13:05:00';
      const passportExpiry = '01 Feb 2021';
      const expiry = renderDocumentExpiry(passportExpiry, arrivalTime);
      expect(expiry).toEqual('6 months after travel');
    });

    it('Should render passport expiry time passed before travel booked date', () => {
      const arrivalTime = '2020-02-01T13:05:00';
      const passportExpiry = '03 Aug 2019';
      const expiry = renderDocumentExpiry(passportExpiry, arrivalTime);
      expect(expiry).toEqual('6 months before travel');
    });
  });
});
