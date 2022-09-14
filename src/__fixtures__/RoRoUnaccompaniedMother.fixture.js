class RoRoUnaccompaniedMother {
  constructor() {
    this.data = {
      id: 'DEV-123',
      status: 'NEW',
      assignee: null,
      relisted: false,
      latestVersionNumber: 1,
      notes: [
        {
          id: 'cc04c66d-3be3-4e2b-b5ca-45967183640f',
          content: 'task created',
          timestamp: '2022-09-09T15:44:31.128416952Z',
          userId: 'charles.okafor@digital.homeoffice.gov.uk',
        },
      ],
      movement: {
        id: 'ROROXML:CMID=407a807484b28b145ae7523a3ac75331/b8023f94b83f92a1310a664aeab2caf1/',
        status: 'PRE_ARRIVAL',
        mode: 'RORO_UNACCOMPANIED_FREIGHT',
        description: 'trailer-only',
        groupSize: 0,
        booking: {
          reference: '72486800',
          type: null,
          paymentMethod: 'Account',
          bookedAt: '2021-05-03T09:38:10Z',
          checkInAt: '2021-12-30T07:19:39Z',
          tickets: [
            {
              number: null,
              type: 'Single',
              price: null,
            },
          ],
          country: 'GB',
          payments: [],
          agent: null,
        },
        journey: {
          id: '19aafdcd743bd63ca19bfe917f75a2db',
          direction: 'OUTBOUND',
          arrival: {
            country: null,
            location: 'HOO',
            time: null,
          },
          departure: {
            country: null,
            location: 'HAR',
            time: '2021-12-30T08:45:00Z',
          },
          route: [
            'HAR',
            'HOO',
          ],
          itinerary: [
            {
              id: '19aafdcd743bd63ca19bfe917f75a2db',
              arrival: {
                country: null,
                location: 'HOO',
                time: null,
              },
              departure: {
                country: null,
                location: 'HAR',
                time: '2021-12-30T08:45:00Z',
              },
              duration: null,
            },
          ],
          duration: null,
        },
        vessel: {
          operator: 'Stena Line',
          name: 'STENA HOLLANDICA',
        },
        person: null,
        otherPersons: null,
        flight: null,
        baggage: null,
        vehicle: null,
        trailer: {
          entitySearchUrl: null,
          type: 'TR',
          registration: 'MTB3759',
          nationality: null,
          length: null,
          height: null,
          loadStatus: 'Loaded',
          movementStats: null,
        },
        goods: {
          description: 'Metal',
          hazardous: false,
        },
        haulier: null,
        account: {
          entitySearchUrl: null,
          name: '42117770',
          shortName: null,
          reference: 'MAMMUKBV',
          address: {
            entitySearchUrl: null,
            line1: 'Aston Lane North',
            line2: 'Preston Brook',
            line3: null,
            city: 'Runcorn',
            postcode: 'WA7 3GE',
            country: 'GB',
          },
          contacts: {
            phone: null,
            mobile: null,
          },
          movementStats: null,
        },
        booker: {
          name: 'Stena Staff',
          address: {
            entitySearchUrl: null,
            line1: 'Aston Lane North',
            line2: 'Preston Brook',
            line3: null,
            city: 'Runcorn',
            postcode: 'WA7 3GE',
            country: 'GB',
          },
          contacts: {
            phone: null,
            mobile: null,
          },
        },
        occupants: null,
      },
      risks: {
        targetingIndicators: {
          indicators: [],
          count: 0,
          score: 0,
        },
        matchedRules: [
          {
            id: 206,
            name: 'goods description',
            type: 'Pre-arrival',
            priority: 'Tier 1',
            description: 'test',
            version: 1,
            abuseTypes: [
              'Class A Drugs',
            ],
            indicatorMatches: [
              {
                entity: 'Message',
                descriptor: 'mode',
                operator: 'in',
                value: '[RORO Unaccompanied Freight]',
              },
              {
                entity: 'Movement',
                descriptor: 'goodsDescriptionString',
                operator: 'in',
                value: '[Metal]',
              },
            ],
          },
        ],
        matchedSelectorGroups: {
          groups: [],
          totalNumberOfSelectors: 0,
        },
        highestThreatLevel: {
          type: 'RULE',
          value: 'Tier 1',
        },
      },
      versions: [
        {
          number: 1,
          createdAt: '2022-09-09T15:44:31.144874276Z',
          movement: {
            id: 'ROROXML:CMID=407a807484b28b145ae7523a3ac75331/b8023f94b83f92a1310a664aeab2caf1/',
            status: 'PRE_ARRIVAL',
            mode: 'RORO_UNACCOMPANIED_FREIGHT',
            description: 'trailer-only',
            groupSize: 0,
            booking: {
              reference: '72486800',
              type: null,
              paymentMethod: 'Account',
              bookedAt: '2021-05-03T09:38:10Z',
              checkInAt: '2021-12-30T07:19:39Z',
              tickets: [
                {
                  number: null,
                  type: 'Single',
                  price: null,
                },
              ],
              country: 'GB',
              payments: [],
              agent: null,
            },
            journey: {
              id: '19aafdcd743bd63ca19bfe917f75a2db',
              direction: 'OUTBOUND',
              arrival: {
                country: null,
                location: 'HOO',
                time: null,
              },
              departure: {
                country: null,
                location: 'HAR',
                time: '2021-12-30T08:45:00Z',
              },
              route: [
                'HAR',
                'HOO',
              ],
              itinerary: [
                {
                  id: '19aafdcd743bd63ca19bfe917f75a2db',
                  arrival: {
                    country: null,
                    location: 'HOO',
                    time: null,
                  },
                  departure: {
                    country: null,
                    location: 'HAR',
                    time: '2021-12-30T08:45:00Z',
                  },
                  duration: null,
                },
              ],
              duration: null,
            },
            vessel: {
              operator: 'Stena Line',
              name: 'STENA HOLLANDICA',
            },
            person: null,
            otherPersons: null,
            flight: null,
            baggage: null,
            vehicle: null,
            trailer: {
              entitySearchUrl: null,
              type: 'TR',
              registration: 'MTB3759',
              nationality: null,
              length: null,
              height: null,
              loadStatus: 'Loaded',
              movementStats: null,
            },
            goods: {
              description: 'Metal',
              hazardous: false,
            },
            haulier: null,
            account: {
              entitySearchUrl: null,
              name: '42117770',
              shortName: null,
              reference: 'MAMMUKBV',
              address: {
                entitySearchUrl: null,
                line1: 'Aston Lane North',
                line2: 'Preston Brook',
                line3: null,
                city: 'Runcorn',
                postcode: 'WA7 3GE',
                country: 'GB',
              },
              contacts: {
                phone: null,
                mobile: null,
              },
              movementStats: null,
            },
            booker: {
              name: 'Stena Staff',
              address: {
                entitySearchUrl: null,
                line1: 'Aston Lane North',
                line2: 'Preston Brook',
                line3: null,
                city: 'Runcorn',
                postcode: 'WA7 3GE',
                country: 'GB',
              },
              contacts: {
                phone: null,
                mobile: null,
              },
            },
            occupants: null,
          },
          risks: {
            targetingIndicators: {
              indicators: [],
              count: 0,
              score: 0,
            },
            matchedRules: [
              {
                id: 206,
                name: 'goods description',
                type: 'Pre-arrival',
                priority: 'Tier 1',
                description: 'test',
                version: 1,
                abuseTypes: [
                  'Class A Drugs',
                ],
                indicatorMatches: [
                  {
                    entity: 'Message',
                    descriptor: 'mode',
                    operator: 'in',
                    value: '[RORO Unaccompanied Freight]',
                  },
                  {
                    entity: 'Movement',
                    descriptor: 'goodsDescriptionString',
                    operator: 'in',
                    value: '[Metal]',
                  },
                ],
              },
            ],
            matchedSelectorGroups: {
              groups: [],
              totalNumberOfSelectors: 0,
            },
            highestThreatLevel: {
              type: 'RULE',
              value: 'Tier 1',
            },
          },
        },
      ],
    };
  }

  withVersion(version) {
    this.data.versions = [
      version,
    ];
    return this;
  }

  withVersions(versions) {
    this.data.versions = [
      ...versions,
    ];
    return this;
  }

  build() {
    return this.data;
  }
}

export default RoRoUnaccompaniedMother;
