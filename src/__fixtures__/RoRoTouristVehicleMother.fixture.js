class RoRoTouristVehicleMother {
  constructor() {
    this.data = {
      id: 'DEV-123',
      status: 'NEW',
      assignee: null,
      relisted: false,
      latestVersionNumber: 1,
      notes: [
        {
          id: 'f5e770cd-fd2b-4ba7-806c-356aa98c9baf',
          content: 'task created',
          timestamp: '2022-09-09T18:48:01.720112815Z',
          userId: 'test@homeoffice.gov.uk',
        },
      ],
      movement: {
        id: 'ROROXML:CMID=d7861bef82317fb7ae1dec2cbf2dc/91316f5f6ed40e68718156596fe2/323710d6c3d25c091755f142487243',
        status: 'PRE_ARRIVAL',
        mode: 'RORO_TOURIST',
        description: 'vehicle',
        groupSize: 3,
        booking: {
          reference: '87982044',
          type: null,
          paymentMethod: 'Cash',
          bookedAt: '2021-12-30T10:15:59.547Z',
          checkInAt: null,
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
          id: 'b33a44cece16cda881345b9374f18995',
          direction: 'OUTBOUND',
          arrival: {
            country: null,
            location: 'BEL',
            time: '2021-12-30T18:30:00Z',
          },
          departure: {
            country: null,
            location: 'BKD',
            time: '2021-12-30T10:30:00Z',
          },
          route: [
            'BKD',
            'BEL',
          ],
          itinerary: [
            {
              id: 'b33a44cece16cda881345b9374f18995',
              arrival: {
                country: null,
                location: 'BEL',
                time: '2021-12-30T18:30:00Z',
              },
              departure: {
                country: null,
                location: 'BKD',
                time: '2021-12-30T10:30:00Z',
              },
              duration: 28800000,
            },
          ],
          duration: 28800000,
        },
        vessel: {
          operator: 'Stena Line',
          name: 'Stena Edda',
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
          document: null,
          movementStats: null,
          frequentFlyerNumber: null,
          ssrCodes: [],
        },
        otherPersons: [
          {
            entitySearchUrl: null,
            name: {
              first: 'Donald 1',
              last: 'Fox',
              full: 'Donald 1 Fox',
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
          {
            entitySearchUrl: null,
            name: {
              first: 'Donald 2',
              last: 'Fox',
              full: 'Donald 2 Fox',
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
        trailer: null,
        goods: null,
        haulier: null,
        account: null,
        booker: null,
        occupants: {
          numberOfOaps: 0,
          numberOfAdults: 2,
          numberOfChildren: 0,
          numberOfInfants: 0,
          numberOfUnknowns: 2,
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
              id: 26,
              name: 'TOURIST-LATE-BOOKING-0_1_HR',
              description: 'Late booking tourist (under 1 hour)',
              score: 30,
            },
          ],
          count: 3,
          score: 90,
        },
        matchedRules: [
          {
            id: 208,
            name: 'PF - Cash Paid',
            type: 'Pre-arrival',
            priority: 'Tier 4',
            description: 'Booking has been paid by Cash',
            version: 2,
            abuseTypes: [
              'Class A Drugs',
            ],
            indicatorMatches: [
              {
                entity: 'Message',
                descriptor: 'cashPaid',
                operator: 'equals',
                value: 'true',
              },
              {
                entity: 'Message',
                descriptor: 'mode',
                operator: 'in',
                value: '[RORO Tourist]',
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
          value: 'Tier 4',
        },
      },
      versions: [
        {
          number: 1,
          createdAt: '2022-09-09T18:48:01.752430107Z',
          movement: {
            id: 'ROROXML:CMID=d7861bef82317fb7ae1dec2cbf2dc/91316f5f6ed40e68718156596fe2/323710d6c3d25c091755f142487243',
            status: 'PRE_ARRIVAL',
            mode: 'RORO_TOURIST',
            description: 'vehicle',
            groupSize: 3,
            booking: {
              reference: '87982044',
              type: null,
              paymentMethod: 'Cash',
              bookedAt: '2021-12-30T10:15:59.547Z',
              checkInAt: null,
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
              id: 'b33a44cece16cda881345b9374f18995',
              direction: 'OUTBOUND',
              arrival: {
                country: null,
                location: 'BEL',
                time: '2021-12-30T18:30:00Z',
              },
              departure: {
                country: null,
                location: 'BKD',
                time: '2021-12-30T10:30:00Z',
              },
              route: [
                'BKD',
                'BEL',
              ],
              itinerary: [
                {
                  id: 'b33a44cece16cda881345b9374f18995',
                  arrival: {
                    country: null,
                    location: 'BEL',
                    time: '2021-12-30T18:30:00Z',
                  },
                  departure: {
                    country: null,
                    location: 'BKD',
                    time: '2021-12-30T10:30:00Z',
                  },
                  duration: 28800000,
                },
              ],
              duration: 28800000,
            },
            vessel: {
              operator: 'Stena Line',
              name: 'Stena Edda',
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
              document: null,
              movementStats: null,
              frequentFlyerNumber: null,
              ssrCodes: [],
            },
            otherPersons: [
              {
                entitySearchUrl: null,
                name: {
                  first: 'Donald 1',
                  last: 'Fox',
                  full: 'Donald 1 Fox',
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
              {
                entitySearchUrl: null,
                name: {
                  first: 'Donald 2',
                  last: 'Fox',
                  full: 'Donald 2 Fox',
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
            trailer: null,
            goods: null,
            haulier: null,
            account: null,
            booker: null,
            occupants: {
              numberOfOaps: 0,
              numberOfAdults: 2,
              numberOfChildren: 0,
              numberOfInfants: 0,
              numberOfUnknowns: 2,
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
                  id: 26,
                  name: 'TOURIST-LATE-BOOKING-0_1_HR',
                  description: 'Late booking tourist (under 1 hour)',
                  score: 30,
                },
              ],
              count: 3,
              score: 90,
            },
            matchedRules: [
              {
                id: 208,
                name: 'PF - Cash Paid',
                type: 'Pre-arrival',
                priority: 'Tier 4',
                description: 'Booking has been paid by Cash',
                version: 2,
                abuseTypes: [
                  'Class A Drugs',
                ],
                indicatorMatches: [
                  {
                    entity: 'Message',
                    descriptor: 'cashPaid',
                    operator: 'equals',
                    value: 'true',
                  },
                  {
                    entity: 'Message',
                    descriptor: 'mode',
                    operator: 'in',
                    value: '[RORO Tourist]',
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
              value: 'Tier 4',
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

export default RoRoTouristVehicleMother;
