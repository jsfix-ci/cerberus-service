describe('Cerberus-UI handles the exception if Form API server is unresponsive', () => {
  let taskName;
  let formApiUrl = Cypress.env('formApiUrl');
  before(() => {
    cy.login(Cypress.env('userName'));
    cy.fixture('tasks.json').then((task) => {
      cy.postTasks(task, 'CERB-AUTOTEST').then((response) => {
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

    cy.getTasksByPartialBusinessKey(`${taskName}`).then((tasks) => {
      const processInstanceId = tasks.map(((item) => item.processInstanceId));
      expect(processInstanceId.length).to.not.equal(0);
      cy.intercept('GET', `/camunda/task?processInstanceId=${processInstanceId[0]}`).as('tasksDetails');
      cy.visit(`/tasks/${processInstanceId[0]}`);
      cy.wait('@tasksDetails').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
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
    cy.contains('Sign out').click();
    cy.get('#kc-page-title').should('contain.text', 'Log In');
  });
});
