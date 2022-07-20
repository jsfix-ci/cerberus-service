describe('Log-in to cerberus UI', () => {
  beforeEach(() => {
    cy.login('cypressuser-cerberus@lodev.xyz');
    cy.acceptPNRTerms();
  });

  it('Should Log-in Successfully into cerberus UI', () => {
    cy.url().should('include', '/tasks');

    cy.get('.govuk-heading-xl').should('contain.text', 'Task management');

    cy.contains('Tasks').click();
    cy.url().should('include', '/tasks');
  });

  after(() => {
    cy.contains('Sign out').click();
    cy.url().should('include', Cypress.env('auth_realm'));
  });
});
