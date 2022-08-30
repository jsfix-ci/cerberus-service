describe('Create AirPax task and verify it on UI', () => {
  beforeEach(() => {
    cy.login(Cypress.env('userName'));
    cy.acceptPNRTerms();
  });

  it('Should create an AirPax task and verify the expected Payload', () => {
    const taskName = 'AIRPAX';
    cy.fixture('airpax/task-airpax.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      cy.createTargetingApiTask(task).then((response) => {
        expect(response.movement.id).to.contain('AIRPAX');
        console.log(response);
        cy.fixture('airpax/airpax-expected-response.json').then((expectedResponse) => {
          expect(expectedResponse.movement.flight).to.deep.equal(response.movement.flight);
          expect(expectedResponse.movement.person.ssrCodes).to.deep.equal(response.movement.person.ssrCodes);
          expect(expectedResponse.movement.baggage).to.deep.equal(response.movement.baggage);
          expect(expectedResponse.movement.person).to.deep.equal(response.movement.person);
          expect(expectedResponse.movement.journey.arrival).to.deep.equal(response.movement.journey.arrival);
          expect(expectedResponse.movement.journey.departure).to.deep.equal(response.movement.journey.departure);
          expect(expectedResponse.movement.journey.route).to.deep.equal(response.movement.journey.route);
          expect(expectedResponse.movement.journey.itinerary).to.deep.equal(response.movement.journey.itinerary);
          expect(expectedResponse.movement.booking.payments).to.deep.equal(response.movement.booking.payments);
          expect(expectedResponse.movement.booking.agent).to.deep.equal(response.movement.booking.agent);
          expect(expectedResponse.movement.booking.ticket).to.deep.equal(response.movement.booking.ticket);
        });
      });
    });
  });

  it('Should create an AirPax task and check it on UI', () => {
    const taskName = 'AIRPAX';
    cy.fixture('airpax/task-airpax.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      cy.createTargetingApiTask(task).then((response) => {
        expect(response.movement.id).to.contain('AIRPAX');
        cy.wait(4000);
        cy.checkAirPaxTaskDisplayed(`${response.id}`);
      });
    });
  });

  it('Should create an airpax task with STANDARDISED:arrivalPort/departurePort fields if present', () => {
    const departure = ['LHR', 'GB'];
    const arrival = ['CAL', 'FR'];
    const taskName = 'AIRPAX';
    cy.fixture('airpax/task-airpax-no-selectors.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      task.data.movement.voyage.voyage.departureLocation = null;
      task.data.movement.voyage.voyage.departureCountry = null;
      task.data.movement.voyage.voyage.arrivalLocation = null;
      task.data.movement.voyage.voyage.arrivalCountry = null;
      task.data.movement.voyage.features.feats['STANDARDISED:departurePort'].valueList.val[0].UNLO3 = departure[0];
      task.data.movement.voyage.features.feats['STANDARDISED:departurePort'].valueList.val[0].CountryCode = departure[1];
      task.data.movement.voyage.features.feats['STANDARDISED:arrivalPort'].valueList.val[0].UNLO3 = arrival[0];
      task.data.movement.voyage.features.feats['STANDARDISED:arrivalPort'].valueList.val[0].CountryCode = arrival[1];
      cy.createTargetingApiTask(task).then((taskResponse) => {
        expect(taskResponse.movement.id).to.contain('AIRPAX');
        expect(taskResponse.movement.journey.departure.country).to.eq(departure[1]);
        expect(taskResponse.movement.journey.departure.location).to.eq(departure[0]);
        expect(taskResponse.movement.journey.arrival.country).to.eq(arrival[1]);
        expect(taskResponse.movement.journey.arrival.location).to.eq(arrival[0]);
      });
    });
  });

  it('Should create an airpax task with STANDARDISED:arrivalPort/departurePort fields not present', () => {
    const departure = ['LHR', 'GB'];
    const arrival = ['CAL', 'FR'];
    const taskName = 'AIRPAX';
    cy.fixture('airpax/task-airpax-no-selectors.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      task.data.movement.voyage.voyage.departureLocation = departure[0];
      task.data.movement.voyage.voyage.departureCountry = departure[1];
      task.data.movement.voyage.voyage.arrivalLocation = arrival[0];
      task.data.movement.voyage.voyage.arrivalCountry = arrival[1];
      delete task.data.movement.voyage.features.feats['STANDARDISED:departurePort'];
      delete task.data.movement.voyage.features.feats['STANDARDISED:arrivalPort'];
      cy.createTargetingApiTask(task).then((taskResponse) => {
        expect(taskResponse.movement.id).to.contain('AIRPAX');
        expect(taskResponse.movement.journey.departure.country).to.eq(departure[1]);
        expect(taskResponse.movement.journey.departure.location).to.eq(departure[0]);
        expect(taskResponse.movement.journey.arrival.country).to.eq(arrival[1]);
        expect(taskResponse.movement.journey.arrival.location).to.eq(arrival[0]);
      });
    });
  });

  it('Should create an AirPax task with rules contains different levels of threat', () => {
    const taskName = 'AIRPAX';
    cy.fixture('airpax/task-airpax-rules-with-diff-threat.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      cy.createTargetingApiTask(task).then((response) => {
        expect(response.movement.id).to.contain('AIRPAX');
        cy.wait(4000);
        cy.checkAirPaxTaskDisplayed(`${response.id}`);
      });
    });
  });

  it('Should create an AirPax task with selectors & rules contains different levels of threat & category', () => {
    const taskName = 'AIRPAX';
    cy.fixture('airpax/task-airpax-rules-selectros-with-diff-threat-category.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      cy.createTargetingApiTask(task).then((response) => {
        expect(response.movement.id).to.contain('AIRPAX');
        cy.wait(4000);
        cy.checkAirPaxTaskDisplayed(`${response.id}`);
      });
    });
  });

  it('Should create an AirPax task with single passenger and check it on UI', () => {
    const taskName = 'AIRPAX';
    cy.fixture('airpax/task-airpax-singlePassenger.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      cy.createTargetingApiTask(task).then((response) => {
        expect(response.movement.id).to.contain('AIRPAX');
        cy.wait(4000);
        cy.checkAirPaxTaskDisplayed(`${response.id}`);
      });
    });
  });

  it('Should create an AirPax task with multiple passengers and check it on UI', () => {
    const taskName = 'AIRPAX';
    cy.fixture('airpax/task-airpax-multiple-passengers.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      cy.createTargetingApiTask(task).then((response) => {
        expect(response.movement.id).to.contain('AIRPAX');
        cy.wait(4000);
        cy.checkAirPaxTaskDisplayed(`${response.id}`);
      });
    });
  });

  after(() => {
    cy.contains('Sign out').click();
    cy.url().should('include', Cypress.env('auth_realm'));
  });
});
