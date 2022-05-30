describe('Create AirPax task and verify it on UI', () => {
  before(() => {
    cy.login(Cypress.env('userName'));
    cy.sendPNRrequest();
  });

  it('Should create an AirPax task and verify the expected Payload', () => {
    const taskName = 'AIRPAX';
    cy.fixture('airpax/task-airpax.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      cy.createAirPaxTask(task).then((response) => {
        expect(response.movement.id).to.contain('AIRPAX');
        console.log(response);
        cy.fixture('airpax/airpax-expected-response.json').then((expectedResponse) => {
          expect(expectedResponse.flight).to.deep.equal(response.movement.flight);
          expect(response.movement.person.ssrCodes).to.deep.equal(expectedResponse.person.ssrCodes);
          expect(response.movement.otherPersons[0].ssrCodes).to.deep.equal(expectedResponse.otherPersons[0].ssrCodes);
          expect(expectedResponse.baggage).to.deep.equal(response.movement.baggage);
          expect(expectedResponse.person).to.deep.equal(response.movement.person);
          expect(expectedResponse.journey.arrival).to.deep.equal(response.movement.journey.arrival);
          expect(expectedResponse.journey.departure).to.deep.equal(response.movement.journey.departure);
          expect(expectedResponse.journey.route).to.deep.equal(response.movement.journey.route);
          expect(expectedResponse.journey.itinerary).to.deep.equal(response.movement.journey.itinerary);
          expect(expectedResponse.booking.payments).to.deep.equal(response.movement.booking.payments);
          expect(expectedResponse.booking.agent).to.deep.equal(response.movement.booking.agent);
          expect(expectedResponse.booking.ticket).to.deep.equal(response.movement.booking.ticket);
        });
      });
    });
  });

  it('Should create an AirPax task and check it on UI', () => {
    const taskName = 'AIRPAX';
    cy.fixture('airpax/task-airpax.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      cy.createAirPaxTask(task).then((response) => {
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
