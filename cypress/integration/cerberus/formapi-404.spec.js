describe('Cerberus-UI handles the exception if Form API server is unresponsive', () => {
  let taskName;
  let formApiUrl = Cypress.env('formApiUrl');
  before(() => {
    let dateNowFormatted = Cypress.moment(new Date()).format('DD-MM-YYYY');
    cy.login(Cypress.env('userName'));
    cy.fixture('tasks.json').then((task) => {
      cy.postTasks(task, `AUTOTEST-${dateNowFormatted}-FORMAPI-DOWN`).then((response) => {
        taskName = response.businessKey;
      });
    });
  });

  it('should show an error when Form API does not respond', () => {
    cy.intercept('POST', '/camunda/task/*/claim').as('claim');

    cy.intercept('GET', `https://${formApiUrl}/form/name/*`, {
      statusCode: 404,
    }).as('formAPI');

    cy.wait(4000);

    cy.getTasksByBusinessKey(`${taskName}`).then((tasks) => {
      cy.navigateToTaskDetailsPage(tasks);
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

  after(() => {
    cy.deleteAutomationTestData();
    cy.contains('Sign out').click();
    cy.url().should('include', Cypress.env('auth_realm'));
  });
});
