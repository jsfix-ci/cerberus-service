describe('Cerberus User not in the Targeters Group should not have access to tasks', () => {
  beforeEach(() => {
    cy.login('cypressuser@lodev.xyz');
    cy.acceptPNRTerms();
    cy.intercept('GET', '/camunda/variable-instance?variableName=taskSummaryBasedOnTIS&processInstanceIdIn=**').as('tasks');
    cy.navigation('Tasks');
  });

  it('Should render all the tabs on task management page and check access is restricted to view the tasks', () => {
    cy.get('#main-content p').should('have.text', 'You are not authorised to view these tasks.');
  });

  after(() => {
    cy.deleteAutomationTestData();
    cy.contains('Sign out').click();
    cy.url().should('include', Cypress.env('auth_realm'));
  });
});
