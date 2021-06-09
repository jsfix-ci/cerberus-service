describe('Login', () => {
  before(() => {
    cy.login(Cypress.env('userName'));
    cy.fixture('tasks.json').then((task) => {
      cy.postTasks(task, 'CERB-AUTOTEST');
    });
  });

  it('should show an error when Form API does not respond', () => {
    cy.intercept('POST', '/camunda/task/*/claim').as('claim');

    cy.intercept('GET', 'https://form-api-server.dev.cop.homeoffice.gov.uk/form/name/*', {
      statusCode: 404,
    }).as('formAPI');

    cy.get('.govuk-grid-row').eq(0).within(() => {
      cy.get('a').invoke('text').as('taskName');
      cy.get('a').click();
    });

    cy.get('p.govuk-body').eq(0).should('contain.text', 'Unassigned');

    cy.get('button.link-button').should('be.visible').and('have.text', 'Claim').click();

    cy.wait('@claim').then(({ response }) => {
      expect(response.statusCode).to.equal(204);
    });

    cy.contains('Issue target').click();

    cy.wait('@formAPI').then(({ response }) => {
      expect(response.statusCode).to.equal(404);
    });

    cy.get('.govuk-error-summary a').eq(0).should('contain.text', 'Request failed with status code 404');
  });
});
