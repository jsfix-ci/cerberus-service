describe('Airpax task list page', () => {
  before(() => {
    cy.login(Cypress.env('userName'));
    cy.acceptPNRTerms();
  });
  it('Should verify task container list for airpax/tasks', () => {
    cy.visit('/airpax/tasks');
    const taskNavigationItems = [
      'New',
      'In progress',
      'Issued',
      'Complete'];
    cy.get('.govuk-heading-xl').invoke('text').then((Heading) => {
      expect(Heading).to.equal('Task management');
    });
    cy.get('.govuk-tabs__list li a').each((navigationItem, index) => {
      cy.wrap(navigationItem).click()
        .should('contain.text', taskNavigationItems[index]).and('be.visible');
    });
  });

  it('Should verify /v2/targeting-tasks/pages returns with status code 200', () => {
    cy.visit('/airpax/tasks');
    cy.intercept('POST', '/v2/targeting-tasks/pages').as('taskList');
    cy.wait('@taskList').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
      cy.get('.card-container').should('be.visible');
    });
  });

  after(() => {
    cy.contains('Sign out').click();
    cy.url().should('include', Cypress.env('auth_realm'));
  });
});
