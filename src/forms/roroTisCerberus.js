/* eslint-disable no-template-curly-in-string */
export default {
  id: 'cerberus-roro-target-information-sheet',
  version: '1.0.0',
  name: 'cerberus-roro-target-information-sheet',
  title: 'Target Information Sheet (RoRo)',
  type: 'wizard',
  components: [
    {
      id: 'arrivalPort',
      fieldId: 'arrivalPort',
      label: 'Port',
      hint: 'The port that the target is scheduled to arrive at',
      type: 'autocomplete',
      item: {
        value: 'id',
        label: 'name',
      },
      required: true,
      data: {
        url: '${environmentContext.referenceDataUrl}/v2/entities/port?skip=0&sort=name.asc&select=id,name&filter=countryid=eq.234&filter=sea=eq.true&filter=nonoperational=eq.false&mode=dataOnly&validDateTime=true',
      },
      show_when: {
        field: './direction',
        op: 'eq',
        value: 'INBOUND',
      },
    },
    {
      id: 'departurePort',
      fieldId: 'departurePort',
      label: 'Port',
      hint: 'The port that the target is scheduled to depart from',
      type: 'autocomplete',
      item: {
        value: 'id',
        label: 'name',
      },
      required: true,
      data: {
        url: '${environmentContext.referenceDataUrl}/v2/entities/port?skip=0&sort=name.asc&select=id,name&filter=countryid=eq.234&filter=sea=eq.true&filter=nonoperational=eq.false&mode=dataOnly&validDateTime=true',
      },
      show_when: {
        field: './direction',
        op: 'eq',
        value: 'OUTBOUND',
      },
    },
    {
      id: 'direction',
      fieldId: 'direction',
      label: 'Inbound or outbound',
      type: 'radios',
      required: true,
      data: {
        options: [
          {
            value: 'INBOUND',
            label: 'Inbound',
          },
          {
            value: 'OUTBOUND',
            label: 'Outbound',
          },
        ],
      },
    },
    {
      id: 'goods',
      fieldId: 'goods',
      type: 'container',
      components: [
        {
          type: 'heading',
          size: 'm',
          content: 'Goods description',
        },
        {
          id: 'load',
          fieldId: 'load',
          label: 'Manifested load',
          type: 'text',
        },
        {
          id: 'weight',
          fieldId: 'weight',
          label: 'Manifest weight',
          type: 'text',
        },
        {
          id: 'destinationCountry',
          fieldId: 'destinationCountry',
          label: 'Country of destination',
          type: 'autocomplete',
          item: {
            value: 'id',
            label: 'name',
          },
          data: {
            url: '${environmentContext.referenceDataUrl}/v2/entities/country?sort=name.asc&mode=dataOnly&validDateTime=true',
          },
        },
        {
          id: 'detailsAvailable',
          fieldId: 'detailsAvailable',
          label: 'Details are available for',
          type: 'checkboxes',
          data: {
            options: [
              {
                value: 'consignor',
                label: 'Consignor',
              },
              {
                value: 'consignee',
                label: 'Consignee',
              },
              {
                value: 'haulier',
                label: 'Haulier',
              },
            ],
          },
        },
        {
          id: 'consignee',
          fieldId: 'consignee',
          type: 'container',
          components: [
            {
              type: 'heading',
              size: 'm',
              content: 'Consignee details',
            },
            {
              id: 'name',
              fieldId: 'name',
              label: 'Consignee name',
              type: 'text',
            },
            {
              id: 'line1',
              fieldId: 'line1',
              label: 'Address line 1',
              type: 'text',
            },
            {
              id: 'line2',
              fieldId: 'line2',
              label: 'Address line 2',
              type: 'text',
            },
            {
              id: 'line3',
              fieldId: 'line3',
              label: 'Address line 3',
              type: 'text',
            },
            {
              id: 'city',
              fieldId: 'city',
              label: 'Town or city',
              type: 'text',
            },
            {
              id: 'postcode',
              fieldId: 'postcode',
              label: 'Postcode',
              type: 'text',
            },
            {
              id: 'country',
              fieldId: 'country',
              label: 'Country',
              type: 'text',
            },
          ],
          show_when: {
            field: './detailsAvailable',
            op: 'contains',
            value: 'consignee',
          },
        },
        {
          id: 'consignor',
          fieldId: 'consignor',
          title: 'Consignor details',
          type: 'container',
          components: [
            {
              type: 'heading',
              size: 'm',
              content: 'Consignor details',
            },
            {
              id: 'name',
              fieldId: 'name',
              label: 'Consignor name',
              type: 'text',
            },
            {
              id: 'line1',
              fieldId: 'line1',
              label: 'Address line 1',
              type: 'text',
            },
            {
              id: 'line2',
              fieldId: 'line2',
              label: 'Address line 2',
              type: 'text',
            },
            {
              id: 'line3',
              fieldId: 'line3',
              label: 'Address line 3',
              type: 'text',
            },
            {
              id: 'city',
              fieldId: 'city',
              label: 'Town or city',
              type: 'text',
            },
            {
              id: 'postcode',
              fieldId: 'postcode',
              label: 'Postcode',
              type: 'text',
            },
            {
              id: 'country',
              fieldId: 'country',
              label: 'Country',
              type: 'text',
            },
          ],
          show_when: {
            field: './detailsAvailable',
            op: 'contains',
            value: 'consignor',
          },
        },
        {
          id: 'haulier',
          fieldId: 'haulier',
          title: 'Haulier details',
          type: 'container',
          components: [
            {
              type: 'heading',
              size: 'm',
              content: 'Haulier details',
            },
            {
              id: 'name',
              fieldId: 'name',
              label: 'Haulier Name',
              type: 'text',
            },
            {
              id: 'line1',
              fieldId: 'line1',
              label: 'Address line 1',
              type: 'text',
            },
            {
              id: 'line2',
              fieldId: 'line2',
              label: 'Address line 2',
              type: 'text',
            },
            {
              id: 'line3',
              fieldId: 'line3',
              label: 'Address line 3',
              type: 'text',
            },
            {
              id: 'city',
              fieldId: 'city',
              label: 'Town or city',
              type: 'text',
            },
            {
              id: 'postcode',
              fieldId: 'postcode',
              label: 'Postcode',
              type: 'text',
            },
            {
              id: 'country',
              fieldId: 'country',
              label: 'Country',
              type: 'text',
            },
          ],
          show_when: {
            field: './detailsAvailable',
            op: 'contains',
            value: 'haulier',
          },
        },
      ],
      show_when: {
        field: '../refDataMode.modecode',
        op: 'in',
        values: [
          'rorofrac',
          'rorofrun',
        ],
      },
    },
    {
      id: 'informTouristFreight',
      fieldId: 'informTouristFreight',
      label: 'Inform both Freight and Tourist',
      type: 'checkboxes',
      data: {
        options: [
          {
            value: 'true',
            label: 'Inform both Freight and Tourist',
          },
        ],
      },
    },
    {
      id: 'interception',
      fieldId: 'interception',
      type: 'container',
      components: [
        {
          type: 'heading',
          size: 'm',
          content: 'Interception details',
        },
        {
          id: 'vesselName',
          fieldId: 'vesselName',
          label: 'Vessel name',
          type: 'text',
        },
        {
          id: 'shippingCompany',
          fieldId: 'shippingCompany',
          label: 'Shipping company',
          type: 'text',
        },
        {
          id: 'arrival',
          fieldId: 'arrival',
          type: 'container',
          components: [
            {
              type: 'inset-text',
              content: 'Please note, the date and time displayed here is in UTC time.',
            },
            {
              id: 'date',
              fieldId: 'date',
              label: 'Estimated date of arrival',
              type: 'date',
              required: true,
              additionalValidation: [
                {
                  function: 'mustBeAfter',
                  unit: 'month',
                  value: -3,
                  message: 'Estimated date of arrival must not be older than 3 months',
                },
              ],
            },
            {
              id: 'time',
              fieldId: 'time',
              label: 'Estimated time of arrival',
              type: 'time',
              required: true,
            },
          ],
          required: true,
          show_when: {
            field: '../direction',
            op: 'eq',
            value: 'INBOUND',
          },
        },
        {
          id: 'departure',
          fieldId: 'departure',
          type: 'container',
          components: [
            {
              type: 'inset-text',
              content: 'Please note, the date and time displayed here is in UTC time.',
            },
            {
              id: 'date',
              fieldId: 'date',
              label: 'Estimated date of departure',
              type: 'date',
              required: true,
              additionalValidation: [
                {
                  function: 'mustBeInTheFuture',
                  todayAllowed: true,
                  message: 'Estimated date of departure must be in the future',
                },
              ],
            },
            {
              id: 'time',
              fieldId: 'time',
              label: 'Estimated time of departure',
              type: 'time',
              required: true,
            },
          ],
          required: true,
          show_when: {
            field: '../direction',
            op: 'eq',
            value: 'OUTBOUND',
          },
        },
      ],
    },
    {
      id: 'issuingHub',
      fieldId: 'issuingHub',
      label: 'Issuing hub',
      type: 'autocomplete',
      required: true,
      item: {
        value: 'id',
        label: 'name',
      },
      data: {
        options: [
          {
            id: 'GAMAH',
            name: 'GA MAH',
            telephone: '01589 654785 Example',
          },
          {
            id: 'GAMAH',
            name: 'People Hub - NBTC',
            telephone: '01589 654785 Example',
          },
          {
            id: 'GAMAH',
            name: 'Accompanied RoRo Hub',
            telephone: '01589 654785 Example',
          },
          {
            id: 'GAMAH',
            name: 'Airfreight Hub',
            telephone: '01589 654785 Example',
          },
          {
            id: 'GAMAH',
            name: 'Causeway MAH',
            telephone: '01589 654785 Example',
          },
          {
            id: 'GAMAH',
            name: 'Container Hub',
            telephone: '01589 654785 Example',
          },
          {
            id: 'GAMAH',
            name: 'Fast Parcel Hub',
            telephone: '01589 654785 Example',
          },
          {
            id: 'GAMAH',
            name: 'Gateway MAH',
            telephone: '01589 654785 Example',
          },
          {
            id: 'GAMAH',
            name: 'NMIC',
            telephone: '01589 654785 Example',
          },
          {
            id: 'GAMAH',
            name: 'Vessel Targeting',
            telephone: '01589 654785 Example',
          },
          {
            id: 'GAMAH',
            name: 'People Hub - PICU',
            telephone: '01589 654785 Example',
          },
          {
            id: 'GAMAH',
            name: 'People Hub - Development',
            telephone: '01589 654785 Example',
          },
          {
            id: 'GAMAH',
            name: 'People Hub - RBTT',
            telephone: '01589 654785 Example',
          },
          {
            id: 'GAMAH',
            name: 'Unaccompanied RoRo Hub',
            telephone: '01589 654785 Example',
          },
        ],
      },
    },
    {
      id: 'refDataMode',
      fieldId: 'refDataMode',
      label: 'Mode',
      type: 'autocomplete',
      required: true,
      item: {
        value: 'id',
        label: 'mode',
      },
      data: {
        url: '${environmentContext.referenceDataUrl}/v2/entities/targetmode?filter=ca=eq.t&mode=dataOnly&validDateTime=true',
      },
    },
    {
      id: 'nominalChecks',
      fieldId: 'nominalChecks',
      type: 'collection',
      labels: {
        item: 'Nominal ${index} details',
        add: 'Add another nominal',
      },
      item: [
        {
          id: 'nominalType',
          fieldId: 'nominalType',
          label: 'Nominal type',
          type: 'autocomplete',
          item: {
            value: 'value',
            label: 'label',
          },
          data: {
            options: [
              {
                label: 'Account',
                value: 'account',
              },
              {
                label: 'Aircraft',
                value: 'aircraft',
              },
              {
                label: 'Air Waybill',
                value: 'airWaybill',
              },
              {
                label: 'Bank Account',
                value: 'bank',
              },
              {
                label: 'Carriage',
                value: 'carriage',
              },
              {
                label: 'Container',
                value: 'container',
              },
              {
                label: 'Flight',
                value: 'flight',
              },
              {
                label: 'Identity Document',
                value: 'identity',
              },
              {
                label: 'Organisation',
                value: 'organisation',
              },
              {
                label: 'Person',
                value: 'person',
              },
              {
                label: 'Postal Address',
                value: 'postal',
              },
              {
                label: 'Telephone',
                value: 'telephone',
              },
              {
                label: 'Trailer',
                value: 'trailer',
              },
              {
                label: 'Vehicle',
                value: 'vehicle',
              },
              {
                label: 'Vessel',
                value: 'vessel',
              },
            ],
          },
        },
        {
          id: 'systemsCheck',
          fieldId: 'systemsCheck',
          label: 'System checks completed',
          hint: 'List all the systems you have checked this nominal against',
          type: 'autocomplete',
          multi: 'true',
          item: {
            value: 'id',
            label: 'name',
          },
          data: {
            url: '${environmentContext.referenceDataUrl}/v2/entities/partnersystems?mode=dataOnly&validDateTime=true',
          },
        },
        {
          id: 'comments',
          fieldId: 'comments',
          label: 'Comments',
          hint: 'Provide as much useful information as possible. This target will be sent to a frontline team for interdiction.',
          type: 'textarea',
        },
      ],
    },
    {
      id: 'operation',
      fieldId: 'operation',
      label: 'Operation name',
      type: 'text',
    },
    {
      id: 'otherPersons',
      fieldId: 'otherPersons',
      type: 'collection',
      labels: {
        item: 'Passenger ${index} details',
        add: 'Add another passenger',
      },
      countOffset: 0,
      item: [
        {
          id: 'name',
          fieldId: 'name',
          type: 'container',
          components: [
            {
              id: 'first',
              fieldId: 'first',
              label: 'First name',
              type: 'text',
            },
            {
              id: 'middle',
              fieldId: 'middle',
              label: 'Middle name(s)',
              type: 'text',
            },
            {
              id: 'last',
              fieldId: 'last',
              label: 'Last name',
              type: 'text',
            },
          ],
        },
        {
          id: 'dateOfBirth',
          fieldId: 'dateOfBirth',
          label: 'Date of Birth',
          type: 'date',
        },
        {
          id: 'nationality',
          fieldId: 'nationality',
          label: 'Nationality',
          type: 'autocomplete',
          item: {
            value: 'id',
            label: 'nationality',
          },
          data: {
            url: '${environmentContext.referenceDataUrl}/v2/entities/nationality?sort=nationality.asc&mode=dataOnly&validDateTime=true',
          },
        },
        {
          id: 'sex',
          fieldId: 'sex',
          label: 'Sex',
          type: 'autocomplete',
          item: {
            value: 'id',
            label: 'name',
          },
          data: {
            url: '${environmentContext.referenceDataUrl}/v2/entities/sex?mode=dataOnly&validDateTime=true',
          },
          description: 'This is shown as Gender in the UI, which is a different thing to sex.',
        },
        {
          id: 'document',
          fieldId: 'document',
          type: 'container',
          components: [
            {
              id: 'type',
              fieldId: 'type',
              label: 'Travel document type',
              type: 'autocomplete',
              item: {
                value: 'id',
                label: 'shortdescription',
              },
              data: {
                url: '${environmentContext.referenceDataUrl}/v2/entities/documenttype?sort=shortdescription.asc&mode=dataOnly&validDateTime=true',
              },
            },
            {
              id: 'documentNumber',
              fieldId: 'documentNumber',
              label: 'Travel document number',
              type: 'text',
            },
            {
              id: 'documentExpiry',
              fieldId: 'documentExpiry',
              label: 'Travel document expiry',
              type: 'date',
            },
          ],
        },
      ],
      show_when: {
        field: 'refDataMode.modecode',
        op: 'in',
        values: [
          'rorofrac',
          'rorotour',
        ],
      },
    },
    {
      id: 'person',
      fieldId: 'person',
      type: 'container',
      components: [
        {
          type: 'heading',
          size: 'm',
          content: 'Driver details',
        },
        {
          id: 'name',
          fieldId: 'name',
          type: 'container',
          components: [
            {
              id: 'first',
              fieldId: 'first',
              label: 'First name',
              type: 'text',
            },
            {
              id: 'middle',
              fieldId: 'middle',
              label: 'Middle name(s)',
              type: 'text',
            },
            {
              id: 'last',
              fieldId: 'last',
              label: 'Last name',
              type: 'text',
            },
          ],
        },
        {
          id: 'dateOfBirth',
          fieldId: 'dateOfBirth',
          label: 'Date of Birth',
          type: 'date',
        },
        {
          id: 'nationality',
          fieldId: 'nationality',
          label: 'Nationality',
          type: 'autocomplete',
          item: {
            value: 'id',
            label: 'nationality',
          },
          data: {
            url: '${environmentContext.referenceDataUrl}/v2/entities/nationality?sort=nationality.asc&mode=dataOnly&validDateTime=true',
          },
        },
        {
          id: 'sex',
          fieldId: 'sex',
          label: 'Sex',
          type: 'autocomplete',
          item: {
            value: 'id',
            label: 'name',
          },
          data: {
            url: '${environmentContext.referenceDataUrl}/v2/entities/sex?mode=dataOnly&validDateTime=true',
          },
          description: 'This is shown as Gender in the UI, which is a different thing to sex.',
        },
        {
          id: 'document',
          fieldId: 'document',
          type: 'container',
          components: [
            {
              id: 'type',
              fieldId: 'type',
              label: 'Travel document type',
              type: 'autocomplete',
              item: {
                value: 'id',
                label: 'shortdescription',
              },
              data: {
                url: '${environmentContext.referenceDataUrl}/v2/entities/documenttype?sort=shortdescription.asc&mode=dataOnly&validDateTime=true',
              },
            },
            {
              id: 'documentNumber',
              fieldId: 'documentNumber',
              label: 'Travel document number',
              type: 'text',
            },
            {
              id: 'documentExpiry',
              fieldId: 'documentExpiry',
              label: 'Travel document expiry',
              type: 'date',
            },
          ],
        },
      ],
      show_when: {
        field: '../refDataMode.modecode',
        op: 'in',
        values: [
          'rorofrac',
          'rorotour',
        ],
      },
    },
    {
      id: 'preArrival',
      fieldId: 'preArrival',
      type: 'container',
      components: [
        {
          type: 'heading',
          size: 'm',
          content: 'Pre-arrival details',
        },
        {
          id: 'controlStrategy',
          fieldId: 'controlStrategy',
          label: 'Control strategy',
          type: 'autocomplete',
          multi: true,
          required: true,
          item: {
            value: 'id',
            label: 'strategy',
          },
          data: {
            url: '${environmentContext.referenceDataUrl}/v2/entities/controlstrategy?sort=strategy.asc&mode=dataOnly&validDateTime=true',
          },
        },
        {
          id: 'accountName',
          fieldId: 'accountName',
          label: 'Account name',
          type: 'text',
          show_when: {
            field: 'refDataMode.modecode',
            op: 'in',
            values: [
              'rorofrac',
              'rorofrun',
            ],
          },
        },
        {
          id: 'accountNumber',
          fieldId: 'accountNumber',
          label: 'Account number',
          type: 'text',
          show_when: {
            field: 'refDataMode.modecode',
            op: 'in',
            values: [
              'rorofrac',
              'rorofrun',
            ],
          },
        },
        {
          id: 'whySelected',
          fieldId: 'whySelected',
          label: 'Comments on reason for selection',
          hint: 'Provide as much useful information as possible. This target will be sent to a frontline team for interdiction.',
          type: 'textarea',
        },
      ],
    },
    {
      id: 'category',
      fieldId: 'category',
      label: 'Target category',
      type: 'autocomplete',
      item: {
        value: 'value',
        label: 'label',
      },
      required: true,
      data: {
        options: [
          {
            value: 'target_A',
            label: 'A',
          },
          {
            value: 'target_B',
            label: 'B',
          },
          {
            value: 'target_C',
            label: 'C',
          },
          {
            value: 'target_U',
            label: 'U',
          },
          {
            value: 'target_S',
            label: 'SABR',
          },
        ],
      },
    },
    {
      id: 'targetingIndicators',
      fieldId: 'targetingIndicators',
      label: 'Targeting indicators',
      type: 'autocomplete',
      required: true,
      multi: 'true',
      item: {
        value: 'id',
        label: 'userfacingtext',
      },
      data: {
        url: '${environmentContext.referenceDataUrl}/v2/entities/tisfeaturenames?sort=userfacingtext.asc&validto=is.null',
      },
    },
    {
      id: 'teamToReceiveTheTarget',
      fieldId: 'teamToReceiveTheTarget',
      label: 'Select the team that should receive the target',
      type: 'autocomplete',
      item: {
        value: 'id',
        label: 'displayname',
      },
      required: true,
      data: {
        url: '${environmentContext.referenceDataUrl}/v2/entities/groups?limit=100&filter=grouptypeid=eq.5&filter=name=neq.GP6XOHK0&mode=dataOnly&validDateTime=true',
      },
    },
    {
      id: 'trailer',
      fieldId: 'trailer',
      type: 'container',
      components: [
        {
          id: 'registration',
          fieldId: 'registration',
          label: 'Trailer registration number',
          type: 'text',
        },
        {
          id: 'type',
          fieldId: 'type',
          label: 'Trailer Type',
          type: 'autocomplete',
          item: {
            value: 'id',
            label: 'name',
          },
          data: {
            url: '${environmentContext.referenceDataUrl}/v2/entities/trailertypes?sort=name.asc&mode=dataOnly&validDateTime=true',
          },
        },
        {
          id: 'nationality',
          fieldId: 'nationality',
          label: 'Trailer registration nationality',
          type: 'autocomplete',
          item: {
            value: 'id',
            label: 'nationality',
          },
          data: {
            url: '${environmentContext.referenceDataUrl}/v2/entities/nationality?sort=nationality.asc&mode=dataOnly&validDateTime=true',
          },
        },
      ],
      show_when: {
        field: '../refDataMode.modecode',
        op: 'in',
        values: [
          'rorofrac',
          'rorofrun',
        ],
      },
    },
    {
      id: 'vehicle',
      fieldId: 'vehicle',
      type: 'container',
      components: [
        {
          id: 'registration',
          fieldId: 'registration',
          label: 'Vehicle registration number',
          type: 'text',
        },
        {
          id: 'make',
          fieldId: 'make',
          label: 'Vehicle make',
          type: 'text',
        },
        {
          id: 'model',
          fieldId: 'model',
          label: 'Vehicle model',
          type: 'text',
        },
        {
          id: 'colour',
          fieldId: 'colour',
          label: 'Vehicle colour',
          type: 'text',
        },
        {
          id: 'nationality',
          fieldId: 'nationality',
          label: 'Vehicle registration nationality',
          type: 'autocomplete',
          item: {
            value: 'id',
            label: 'nationality',
          },
          data: {
            url: '${environmentContext.referenceDataUrl}/v2/entities/nationality?sort=nationality.asc&mode=dataOnly&validDateTime=true',
          },
        },
      ],
      show_when: {
        field: '../refDataMode.modecode',
        op: 'in',
        values: [
          'rorofrac',
          'rorotour',
        ],
      },
    },
    {
      id: 'warnings',
      fieldId: 'warnings',
      type: 'container',
      components: [
        {
          type: 'heading',
          size: 'm',
          content: 'Warnings',
        },
        {
          id: 'identified',
          fieldId: 'identified',
          label: 'Have any warnings been identified?',
          hint: 'Use this to notify the target recipient of any warnings or markers, for example the person has a history of violence or has previously ran the controls',
          type: 'radios',
          data: {
            options: [
              {
                value: 'yes',
                label: 'Yes',
              },
              {
                value: 'no',
                label: 'No',
              },
            ],
          },
          required: true,
        },
        {
          id: 'details',
          fieldId: 'details',
          label: 'Details of the warnings',
          hint: 'Please only enter the parameters of the search conducted and not the warning marker itself',
          type: 'textarea',
          required: true,
          show_when: {
            field: './identified',
            op: '=',
            value: 'yes',
          },
        },
        {
          id: 'watchListIrn',
          fieldId: 'watchListIrn',
          label: 'Watchlist IRN / Selector Group Reference',
          type: 'text',
        },
        {
          id: 'targetActions',
          fieldId: 'targetActions',
          label: 'Targeter actions / Remarks',
          type: 'text',
        },
      ],
      required: true,
    },
  ],
  pages: [
    {
      id: 'info',
      name: 'info',
      title: 'Target Information Sheet (RoRo)',
      components: [
        {
          type: 'heading',
          size: 'm',
          content: 'Target Information',
        },
        {
          use: 'refDataMode',
        },
        {
          use: 'issuingHub',
        },
        {
          use: 'category',
        },
        {
          use: 'direction',
        },
        {
          use: 'arrivalPort',
        },
        {
          use: 'departurePort',
        },
        {
          use: 'operation',
        },
        {
          use: 'targetingIndicators',
        },
        {
          use: 'interception',
        },
        {
          type: 'heading',
          size: 'm',
          content: 'Vehicle details',
          show_when: {
            field: 'refDataMode.modecode',
            op: 'in',
            values: [
              'rorofrac',
              'rorofrun',
              'rorotour',
            ],
          },
        },
        {
          use: 'vehicle',
        },
        {
          use: 'trailer',
        },
        {
          use: 'person',
        },
        {
          type: 'heading',
          size: 'm',
          content: 'Passenger details',
          show_when: {
            field: 'refDataMode.modecode',
            op: 'in',
            values: [
              'rorofrac',
              'rorotour',
            ],
          },
        },
        {
          use: 'otherPersons',
        },
        {
          use: 'goods',
        },
        {
          use: 'preArrival',
        },
        {
          type: 'heading',
          size: 'm',
          content: 'Checks completed on nominals',
        },
        {
          use: 'nominalChecks',
        },
        {
          use: 'warnings',
        },
      ],
      actions: [
        {
          type: 'cancel',
          validate: false,
          label: 'Cancel',
          classModifiers: 'secondary',
        },
        {
          type: 'next',
          validate: true,
          label: 'Next',
        },
      ],
    },
    {
      id: 'recipientDetails',
      name: 'recipientDetails',
      title: 'Recipient Details',
      components: [
        {
          use: 'teamToReceiveTheTarget',
        },
        {
          use: 'informTouristFreight',
        },
      ],
      actions: [
        {
          type: 'cancel',
          validate: false,
          label: 'Cancel',
          classModifiers: 'secondary',
        },
        {
          type: 'navigate',
          page: 'info',
          validate: false,
          label: 'Previous',
        },
        {
          type: 'submit',
          validate: true,
          label: 'Accept and send',
        },
      ],
    },
  ],
};
