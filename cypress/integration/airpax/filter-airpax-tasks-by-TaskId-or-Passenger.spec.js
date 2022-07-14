describe('Filter airpax tasks by TaskId or Passenger name', () => {
  beforeEach(() => {
    cy.login(Cypress.env('userName'));
    cy.acceptPNRTerms();
  });

  it('Should be able to filter by taskID', () => {
    cy.intercept('POST', '/v2/targeting-tasks/pages').as('pages');
    const taskName = 'AIRPAX';
    cy.fixture('airpax/task-airpax.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      cy.createTargetingApiTask(task).then((taskResponse) => {
        cy.wait(3000);
        let businessKey = taskResponse.id;
        cy.visit('/airpax/tasks');
        cy.get('.govuk-input').should('be.visible').type(businessKey);
        cy.contains('Apply').click();
        cy.wait('@pages').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.get('.govuk-task-list-card').should('have.length', '1').contains(businessKey);
      });
    });
  });

  after(() => {
    cy.contains('Sign out').click();
    cy.url().should('include', Cypress.env('auth_realm'));
  });
});
