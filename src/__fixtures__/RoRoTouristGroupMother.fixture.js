class RoRoTouristGroupMother {
  constructor() {
    this.data = {
      id: 'DEV-123',
      status: 'NEW',
      assignee: null,
      relisted: false,
      latestVersionNumber: 1,
      notes: [
        {
          id: '6527179a-f542-491d-a629-b1e0d0eb669b',
          content: 'task created',
          timestamp: '2022-09-09T16:18:44.013997107Z',
          userId: 'test@homeoffice.gov.uk',
        },
      ],
      movement: {
        id: 'ROROXML:CMID=d7861bef82317fb7ae1dec28ddcbf2dc/91316f5e02f6ed40e68718156596fe2/323710d6c3d25c091755f142487243',
        status: 'PRE_ARRIVAL',
        mode: 'RORO_TOURIST',
        description: 'group',
        groupSize: 6,
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
        otherPersons: [
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
          {
            entitySearchUrl: null,
            name: {
              first: 'Donald 3',
              last: 'Fox',
              full: 'Donald 3 Fox',
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
              first: 'Donald 4',
              last: 'Fox',
              full: 'Donald 4 Fox',
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
              first: 'Donald 5',
              last: 'Fox',
              full: 'Donald 5 Fox',
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
              first: 'calauz',
              last: 'geanina mihaela',
              full: 'calauz geanina mihaela',
            },
            role: 'PASSENGER',
            dateOfBirth: null,
            gender: 'M',
            nationality: 'GB',
            document: null,
            movementStats: null,
            frequentFlyerNumber: null,
            ssrCodes: [],
          },
        ],
        flight: null,
        baggage: null,
        vehicle: null,
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
          numberOfUnknowns: 1,
          numberOfOccupants: 3,
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
              id: 26,
              name: 'TOURIST-LATE-BOOKING-0_1_HR',
              description: 'Late booking tourist (under 1 hour)',
              score: 30,
            },
          ],
          count: 2,
          score: 60,
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
          createdAt: '2022-09-09T16:18:44.021678159Z',
          movement: {
            id: 'ROROXML:CMID=d7861bef82317fb7ae1dec28ddcbf2dc/91316f5e02f6ed40e68718156596fe2/323710d6c3d25c091755f142487243',
            status: 'PRE_ARRIVAL',
            mode: 'RORO_TOURIST',
            description: 'group',
            groupSize: 6,
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
            otherPersons: [
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
              {
                entitySearchUrl: null,
                name: {
                  first: 'Donald 3',
                  last: 'Fox',
                  full: 'Donald 3 Fox',
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
                  first: 'Donald 4',
                  last: 'Fox',
                  full: 'Donald 4 Fox',
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
                  first: 'Donald 5',
                  last: 'Fox',
                  full: 'Donald 5 Fox',
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
                  first: 'calauz',
                  last: 'geanina mihaela',
                  full: 'calauz geanina mihaela',
                },
                role: 'PASSENGER',
                dateOfBirth: null,
                gender: 'M',
                nationality: 'GB',
                document: null,
                movementStats: null,
                frequentFlyerNumber: null,
                ssrCodes: [],
              },
            ],
            flight: null,
            baggage: null,
            vehicle: null,
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
              numberOfUnknowns: 1,
              numberOfOccupants: 3,
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
                  id: 26,
                  name: 'TOURIST-LATE-BOOKING-0_1_HR',
                  description: 'Late booking tourist (under 1 hour)',
                  score: 30,
                },
              ],
              count: 2,
              score: 60,
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

export default RoRoTouristGroupMother;
