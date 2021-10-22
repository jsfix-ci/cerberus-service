/// <reference types="Cypress"/>
/// <reference path="../support/index.d.ts" />

describe('Cerberus User not in the Targeters Group should not have access to tasks', () => {
  beforeEach(() => {
    cy.login('cypressuser@lodev.xyz');
    cy.intercept('GET', '/camunda/variable-instance?variableName=taskSummaryBasedOnTIS&processInstanceIdIn=**').as('tasks');
    cy.navigation('Tasks');
  });

  it('Should render all the tabs on task management page and check access is restricted to view the tasks', () => {
    const locators = [
      'new',
      'in-progress',
      'target-issued',
      'complete',
    ];

    cy.get('.govuk-tabs__list li a').each((navigationItem, index) => {
      cy.wrap(navigationItem).click();
      cy.get(`#${locators[index]} p`).eq(0).should('have.text', 'You are not authorised to view these tasks.');
    });
  });

  after(() => {
    cy.deleteAutomationTestData();
    cy.contains('Sign out').click();
    cy.url().should('include', Cypress.env('auth_realm'));
  });
});
