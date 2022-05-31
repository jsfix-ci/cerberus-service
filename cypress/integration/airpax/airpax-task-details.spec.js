describe('Verify AirPax task details of different sections', () => {
  beforeEach(() => {
    cy.login(Cypress.env('userName'));
  });

  it('Should check document section of the airPax task', () => {
    cy.acceptPNRTerms();
    const taskName = 'AIRPAX';
    cy.fixture('airpax/task-airpax.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      cy.createAirPaxTask(task).then((response) => {
        expect(response.movement.id).to.contain('AIRPAX');
        cy.wait(4000);
        cy.checkAirPaxTaskDisplayed(`${response.id}`);
        cy.fixture('airpax/airpax-task-expected-details.json').then((expectedResponse) => {
          cy.contains('h3', 'Document').nextAll().within((elements) => {
            cy.getairPaxDocument(elements).then((details) => {
              expect(details).to.deep.equal(expectedResponse.Document);
            });
          });
        });
      });
    });
  });

  it('Should check airPax task not visible if User not agreed for PNR terms', () => {
    cy.doNotAcceptPNRTerms();
    cy.intercept('POST', '/v2/targeting-tasks/pages').as('airpaxTask');
    cy.visit('/airpax/tasks');
    cy.wait('@airpaxTask').then(({ response }) => {
      expect(response.statusCode).to.be.equal(403);
    });
  });

  after(() => {
    cy.contains('Sign out').click();
    cy.url().should('include', Cypress.env('auth_realm'));
  });
});
