class RoRoAccompaniedMother {
  constructor() {
    this.data = {
      id: 'DEV-123',
      status: 'NEW',
      assignee: 'test',
      relisted: false,
      latestVersionNumber: 1,
      notes: [
        {
          id: 'f8ceaf4f-78c6-4436-90d2-b18dbcf7e5b8',
          content: 'task unclaimed',
          timestamp: '2022-08-14T19:23:33.332810412Z',
          userId: 'test@homeoffice.gov.uk',
        },
        {
          id: 'a878b42b-0a32-408c-85b0-c1a531520bb7',
          content: 'task claimed',
          timestamp: '2022-08-14T19:23:29.288071909Z',
          userId: 'test@homeoffice.gov.uk',
        },
      ],
      movement: {
        id: 'ROROTSV:CMID=9c19fe74233c057f25e5ad333672c3f9/2b4a6b5b08ea434880562d6836b1036',
        status: 'PRE_ARRIVAL',
        mode: 'RORO_ACCOMPANIED_FREIGHT',
        description: 'vehicle-with-trailer',
        groupSize: 2,
        booking: {
          reference: '357485637',
          type: 'Online',
          paymentMethod: 'Account',
          bookedAt: '2020-08-02T09:20:00Z',
          checkInAt: '2020-08-04T12:10:00Z',
          ticket: {
            number: 'TIC-998765421',
            type: 'Return',
            price: '59.99',
          },
          country: 'GB',
          payments: [],
          agent: null,
        },
        journey: {
          id: '19aafdcd743bd63ca19bfe917f75a2db',
          direction: null,
          arrival: {
            country: 'FR',
            location: 'CAL',
            time: '2020-08-04T13:55:00Z',
          },
          departure: {
            country: 'GB',
            location: 'DOV',
            time: '2020-08-04T13:10:00Z',
          },
          route: [
            'DOV',
            'CAL',
          ],
          itinerary: [
            {
              id: '19aafdcd743bd63ca19bfe917f75a2db',
              arrival: {
                country: 'FR',
                location: 'CAL',
                time: '2020-08-04T13:55:00Z',
              },
              departure: {
                country: 'GB',
                location: 'DOV',
                time: '2020-08-04T13:10:00Z',
              },
              duration: 2700000,
            },
          ],
          duration: 2700000,
        },
        vessel: {
          operator: 'DFDS',
          name: 'KHALEESI SEAWAYS',
        },
        person: {
          entitySearchUrl: 'https://entitysearch.notprod.dacc.homeoffice.gov.uk//search?type=PERSON&term=103000003407504&fields=[%22id%22]',
          name: {
            first: 'Daniel',
            last: 'Fagan',
            full: 'Daniel Fagan',
          },
          role: 'DRIVER',
          dateOfBirth: '1984-08-03T00:00:00Z',
          gender: 'M',
          nationality: 'GB',
          document: {
            entitySearchUrl: null,
            type: 'PASSPORT',
            number: 'ST0392315',
            validFrom: null,
            expiry: '2021-02-01T00:00:00Z',
            countryOfIssue: 'GB',
          },
          movementStats: null,
          frequentFlyerNumber: null,
          ssrCodes: [],
        },
        otherPersons: [
          {
            entitySearchUrl: 'https://entitysearch.notprod.dacc.homeoffice.gov.uk//search?type=PERSON&term=101234567888,101234567999&fields=[%22id%22]',
            name: {
              first: 'Donald',
              last: 'Fox',
              full: 'Donald Fox',
            },
            role: 'PASSENGER',
            dateOfBirth: '1981-06-03T00:00:00Z',
            gender: 'M',
            nationality: 'GB',
            document: {
              entitySearchUrl: null,
              type: 'PASSPORT',
              number: 'ST0394612',
              validFrom: null,
              expiry: '2021-02-01T00:00:00Z',
              countryOfIssue: 'GB',
            },
            movementStats: null,
            frequentFlyerNumber: null,
            ssrCodes: null,
          },
        ],
        flight: null,
        baggage: null,
        vehicle: {
          entitySearchUrl: 'https://entitysearch.notprod.dacc.homeoffice.gov.uk//search?type=VEHICLE&term=103000003407504&fields=[%22id%22]',
          type: 'Truck',
          registration: 'GB57MJP',
          nationality: 'GB',
          colour: 'Grey',
          model: 'R-Series',
          make: 'Scania',
          netWeight: '3455',
          grossWeight: '43623',
          movementStats: null,
        },
        trailer: {
          entitySearchUrl: 'https://entitysearch.notprod.dacc.homeoffice.gov.uk//search?type=VEHICLE&term=103000003407321&fields=[%22id%22]',
          type: 'TR',
          registration: 'GB09NFD',
          nationality: 'GB',
          length: '75',
          height: '3',
          loadStatus: 'Empty',
          movementStats: null,
        },
        goods: {
          description: 'PPE Masks',
          hazardous: false,
        },
        haulier: {
          entitySearchUrl: null,
          name: 'Sinkable Hauling',
          address: {
            entitySearchUrl: null,
            line1: 'University of Portsmouth',
            line2: 'Royal Dockyards',
            line3: null,
            city: 'Portsmouth',
            postcode: 'PO1 2EF',
            country: 'GB',
          },
          contacts: {
            phone: {
              value: '289675932',
              entitySearchUrl: null,
            },
            mobile: {
              value: '07809123456',
              entitySearchUrl: null,
            },
          },
          movementStats: null,
        },
        account: {
          entitySearchUrl: 'https://entitysearch.notprod.dacc.homeoffice.gov.uk//search?type=ORGANISATION&term=10311111113407504&fields=[%22id%22]',
          name: 'Safe Cafe Medical PPE',
          shortName: 'SCM PPE',
          reference: '000361676',
          address: {
            entitySearchUrl: null,
            line1: 'University of Portsmouth',
            line2: 'Royal Dockyards',
            line3: null,
            city: 'Portsmouth',
            postcode: 'PO1 2EF',
            country: 'GB',
          },
          contacts: {
            phone: {
              value: '01234 926459',
              entitySearchUrl: null,
            },
            mobile: {
              value: '07809 386670',
              entitySearchUrl: null,
            },
          },
          movementStats: null,
        },
        booker: null,
        occupants: {
          numberOfOaps: 0,
          numberOfAdults: 1,
          numberOfChildren: 0,
          numberOfInfants: 0,
          numberOfUnknowns: 3,
          numberOfOccupants: 4,
        },
      },
      risks: {
        targetingIndicators: {
          indicators: [
            {
              id: 10,
              name: 'STANDARDISED:cashPaid',
              description: 'Paid by cash',
              score: 30,
            },
            {
              id: 12,
              name: 'EMPTY-TRAILER-ON-ROUND-TRIP',
              description: 'Empty trailer for round trip',
              score: 30,
            },
            {
              id: 13,
              name: 'STANDARDISED:emptyVehicle',
              description: 'Empty vehicle',
              score: 20,
            },
          ],
          count: 3,
          score: 80,
        },
        matchedRules: [
          {
            id: 556,
            name: 'Checkin lead time',
            type: 'Both',
            priority: 'Tier 4',
            description: 'Qui nesciunt suscip',
            version: 1,
            abuseTypes: [
              'Class A Drugs',
            ],
            indicatorMatches: [
              {
                entity: 'Booking',
                descriptor: 'checkInLeadTime',
                operator: 'between',
                value: '[1, 24]',
              },
              {
                entity: 'Message',
                descriptor: 'mode',
                operator: 'in',
                value: '[RORO Accompanied Freight, RORO Tourist, RORO Unaccompanied Freight]',
              },
            ],
          },
        ],
        matchedSelectorGroups: {
          groups: [
            {
              groupReference: 'SR-245',
              groupVersionNumber: 1,
              requestingOfficer: 'fe',
              intelligenceSource: 'fefe',
              category: 'A',
              threatType: 'Class A Drugs',
              pointOfContactMessage: 'fdvdfb',
              pointOfContact: 'bfb',
              inboundActionCode: 'No action required',
              outboundActionCode: 'No action required',
              notes: 'notes',
              creator: 'user',
              selectors: [
                {
                  id: 279,
                  reference: '2021-279',
                  category: 'A',
                  warning: {
                    status: 'YES',
                    types: [],
                    detail: 'other warning details',
                  },
                  indicatorMatches: [
                    {
                      entity: 'Message',
                      descriptor: 'mode',
                      operator: 'in',
                      value: 'RORO Accompanied Freight',
                    },
                    {
                      entity: 'Trailer',
                      descriptor: 'registrationNumber',
                      operator: 'equal',
                      value: 'qwerty',
                    },
                  ],
                  description: 'RORO Accompanied Freight qwerty',
                },
                {
                  id: 300,
                  reference: '2022-300',
                  category: 'B',
                  warning: {
                    status: 'NO',
                    types: [],
                    detail: null,
                  },
                  indicatorMatches: [
                    {
                      entity: 'Trailer',
                      descriptor: 'registrationNumber',
                      operator: 'equal',
                      value: 'GB09NFD',
                    },
                  ],
                  description: 'GB09NFD',
                },
              ],
            },
          ],
          totalNumberOfSelectors: 2,
        },
        highestThreatLevel: {
          type: 'SELECTOR',
          value: 'A',
        },
      },
      versions: [
        {
          number: 1,
          createdAt: '2022-09-09T13:27:29.587786358Z',
          movement: {
            id: 'RoRoV2_396765:CMID=TEST',
            status: 'PRE_ARRIVAL',
            mode: 'RORO_ACCOMPANIED_FREIGHT',
            description: 'vehicle-with-trailer',
            groupSize: 2,
            booking: {
              reference: '357485637',
              type: 'Online',
              paymentMethod: 'Account',
              bookedAt: '2020-08-02T09:20:00Z',
              checkInAt: '2020-08-04T12:10:00Z',
              tickets: [
                {
                  number: 'TIC-998765421',
                  type: 'Return',
                  price: '59.99',
                },
              ],
              country: 'GB',
              payments: [],
              agent: null,
            },
            journey: {
              id: '19aafdcd743bd63ca19bfe917f75a2db',
              direction: null,
              arrival: {
                country: 'FR',
                location: 'CAL',
                time: '2020-08-04T13:55:00Z',
              },
              departure: {
                country: 'GB',
                location: 'DOV',
                time: '2020-08-04T13:10:00Z',
              },
              route: [
                'DOV',
                'CAL',
              ],
              itinerary: [
                {
                  id: '19aafdcd743bd63ca19bfe917f75a2db',
                  arrival: {
                    country: 'FR',
                    location: 'CAL',
                    time: '2020-08-04T13:55:00Z',
                  },
                  departure: {
                    country: 'GB',
                    location: 'DOV',
                    time: '2020-08-04T13:10:00Z',
                  },
                  duration: 2700000,
                },
              ],
              duration: 2700000,
            },
            vessel: {
              operator: 'DFDS',
              name: 'KHALEESI SEAWAYS',
            },
            person: {
              entitySearchUrl: 'https://entitysearch.notprod.dacc.homeoffice.gov.uk//search?type=PERSON&term=103000003407504&fields=[%22id%22]',
              name: {
                first: 'Daniel',
                last: 'Fagan',
                full: 'Daniel Fagan',
              },
              role: 'DRIVER',
              dateOfBirth: '1984-08-03T00:00:00Z',
              gender: 'M',
              nationality: 'GB',
              document: {
                entitySearchUrl: null,
                type: 'PASSPORT',
                number: 'ST0392315',
                validFrom: null,
                expiry: '2021-02-01T00:00:00Z',
                countryOfIssue: 'GB',
              },
              movementStats: null,
              frequentFlyerNumber: null,
              ssrCodes: [],
            },
            otherPersons: [
              {
                entitySearchUrl: 'https://entitysearch.notprod.dacc.homeoffice.gov.uk//search?type=PERSON&term=101234567888,101234567999&fields=[%22id%22]',
                name: {
                  first: 'Donald',
                  last: 'Fox',
                  full: 'Donald Fox',
                },
                role: 'PASSENGER',
                dateOfBirth: '1981-06-03T00:00:00Z',
                gender: 'M',
                nationality: 'GB',
                document: {
                  entitySearchUrl: null,
                  type: 'PASSPORT',
                  number: 'ST0394612',
                  validFrom: null,
                  expiry: '2021-02-01T00:00:00Z',
                  countryOfIssue: 'GB',
                },
                movementStats: null,
                frequentFlyerNumber: null,
                ssrCodes: null,
              },
            ],
            flight: null,
            baggage: null,
            vehicle: {
              entitySearchUrl: 'https://entitysearch.notprod.dacc.homeoffice.gov.uk//search?type=VEHICLE&term=103000003407504&fields=[%22id%22]',
              type: 'Truck',
              registration: 'GB57MJP',
              nationality: 'GB',
              colour: 'Grey',
              model: 'R-Series',
              make: 'Scania',
              netWeight: '3455',
              grossWeight: '43623',
              movementStats: null,
            },
            trailer: {
              entitySearchUrl: 'https://entitysearch.notprod.dacc.homeoffice.gov.uk//search?type=VEHICLE&term=103000003407321&fields=[%22id%22]',
              type: 'TR',
              registration: 'GB09NFD',
              nationality: 'GB',
              length: '75',
              height: '3',
              loadStatus: 'Empty',
              movementStats: null,
            },
            goods: {
              description: 'PPE Masks',
              hazardous: false,
            },
            haulier: {
              entitySearchUrl: null,
              name: 'Sinkable Hauling',
              address: null,
              contacts: {
                phone: {
                  value: '289675932',
                  entitySearchUrl: null,
                },
                mobile: {
                  value: '07809123456',
                  entitySearchUrl: null,
                },
              },
              movementStats: null,
            },
            account: {
              entitySearchUrl: 'https://entitysearch.notprod.dacc.homeoffice.gov.uk//search?type=ORGANISATION&term=10311111113407504&fields=[%22id%22]',
              name: 'Safe Cafe Medical PPE',
              shortName: 'SCM PPE',
              reference: '000361676',
              address: {
                entitySearchUrl: null,
                line1: 'University of Portsmouth',
                line2: 'Royal Dockyards',
                line3: null,
                city: 'Portsmouth',
                postcode: 'PO1 2EF',
                country: 'GB',
              },
              contacts: {
                phone: {
                  value: '01234 926459',
                  entitySearchUrl: null,
                },
                mobile: {
                  value: '07809 386670',
                  entitySearchUrl: null,
                },
              },
              movementStats: null,
            },
            booker: null,
            occupants: {
              numberOfOaps: 0,
              numberOfAdults: 1,
              numberOfChildren: 0,
              numberOfInfants: 0,
              numberOfUnknowns: 3,
              numberOfOccupants: 4,
            },
          },
          risks: {
            targetingIndicators: {
              indicators: [
                {
                  id: 10,
                  name: 'STANDARDISED:cashPaid',
                  description: 'Paid by cash',
                  score: 30,
                },
                {
                  id: 12,
                  name: 'EMPTY-TRAILER-ON-ROUND-TRIP',
                  description: 'Empty trailer for round trip',
                  score: 30,
                },
                {
                  id: 13,
                  name: 'STANDARDISED:emptyVehicle',
                  description: 'Empty vehicle',
                  score: 20,
                },
              ],
              count: 3,
              score: 80,
            },
            matchedRules: [
              {
                id: 556,
                name: 'Checkin lead time',
                type: 'Both',
                priority: 'Tier 4',
                description: 'Qui nesciunt suscip',
                version: 1,
                abuseTypes: [
                  'Class A Drugs',
                ],
                indicatorMatches: [
                  {
                    entity: 'Booking',
                    descriptor: 'checkInLeadTime',
                    operator: 'between',
                    value: '[1, 24]',
                  },
                  {
                    entity: 'Message',
                    descriptor: 'mode',
                    operator: 'in',
                    value: '[RORO Accompanied Freight, RORO Tourist, RORO Unaccompanied Freight]',
                  },
                ],
              },
            ],
            matchedSelectorGroups: {
              groups: [
                {
                  groupReference: 'SR-245',
                  groupVersionNumber: 1,
                  requestingOfficer: 'fe',
                  intelligenceSource: 'fefe',
                  category: 'A',
                  threatType: 'Class A Drugs',
                  pointOfContactMessage: 'fdvdfb',
                  pointOfContact: 'bfb',
                  inboundActionCode: 'No action required',
                  outboundActionCode: 'No action required',
                  notes: 'notes',
                  creator: 'user',
                  selectors: [
                    {
                      id: 279,
                      reference: '2021-279',
                      category: 'A',
                      warning: {
                        status: 'YES',
                        types: [],
                        detail: 'other warning details',
                      },
                      indicatorMatches: [
                        {
                          entity: 'Message',
                          descriptor: 'mode',
                          operator: 'in',
                          value: 'RORO Accompanied Freight',
                        },
                        {
                          entity: 'Trailer',
                          descriptor: 'registrationNumber',
                          operator: 'equal',
                          value: 'qwerty',
                        },
                      ],
                      description: 'RORO Accompanied Freight qwerty',
                    },
                    {
                      id: 300,
                      reference: '2022-300',
                      category: 'B',
                      warning: {
                        status: 'NO',
                        types: [],
                        detail: null,
                      },
                      indicatorMatches: [
                        {
                          entity: 'Trailer',
                          descriptor: 'registrationNumber',
                          operator: 'equal',
                          value: 'GB09NFD',
                        },
                      ],
                      description: 'GB09NFD',
                    },
                  ],
                },
              ],
              totalNumberOfSelectors: 2,
            },
            highestThreatLevel: {
              type: 'SELECTOR',
              value: 'A',
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

export default RoRoAccompaniedMother;
