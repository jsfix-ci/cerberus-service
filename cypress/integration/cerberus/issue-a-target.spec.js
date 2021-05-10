describe('Issue target from cerberus UI using target sheet information form', () => {
  before(() => {
    cy.login(Cypress.env('userName'));
    cy.postTasks('CERB-AUTOTEST');
  });

  beforeEach(() => {
    cy.login(Cypress.env('userName'));
  });

  it('Should submit target sheet information form successfully', () => {
    cy.intercept('POST', '/camunda/task/*/claim').as('claim');

    cy.get('.govuk-grid-row').eq(0).within(() => {
      cy.get('a').invoke('text').as('taskName');
      cy.get('a').click();
    });

    cy.wait(2000);

    cy.get('p.govuk-body').eq(0).should('contain.text', 'Unassigned');

    cy.get('button.link-button').should('be.visible').and('have.text', 'Claim').click();

    cy.wait('@claim').then(({ response }) => {
      expect(response.statusCode).to.equal(204);
    });

    cy.contains('Issue target').click();

    cy.wait(2000);

    cy.selectDropDownValue('mode', 'RoRo Freight');

    cy.selectDropDownValue('eventPort', '135 Dunganno Road');

    cy.typeTodaysDateTime('eta');

    cy.selectDropDownValue('strategy', 'Alcohol');

    cy.selectRadioButton('warningsIdentified', 'No');

    cy.clickNext();

    cy.selectDropDownValue('teamToReceiveTheTarget', 'Aberdeen Commodity team - DN02G5');

    cy.clickSubmit();

    cy.verifySuccessfulSubmissionHeader('Target created successfully');
  });
});
