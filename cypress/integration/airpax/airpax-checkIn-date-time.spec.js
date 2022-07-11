describe('Targeter to see how long before departure check-in occurs So that Targeter can prioritise a task accordingly', () => {
  beforeEach(() => {
    cy.login(Cypress.env('userName'));
    cy.acceptPNRTerms();
  });

  it('Should verify Difference between Checkin and departure date is a few seconds ago', () => {
    const taskName = 'AIRPAX';
    cy.fixture('airpax/task-airpax.json').then((task) => {
      task.data.movement.serviceMovement.features.feats['STANDARDISED:checkinDateTime'].value = null;
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      console.log(task);
      cy.createTargetingApiTask(task).then((taskResponse) => {
        expect(taskResponse.movement.id).to.contain('AIRPAX');
        cy.wait(4000);
        let businessKey = taskResponse.id;
        cy.checkAirPaxTaskDisplayed(businessKey);
        cy.verifyAirPaxCheckInDateTime('Unknown');
      });
    });
  });

  after(() => {
    cy.deleteAutomationTestData();
    cy.contains('Sign out').click();
    cy.url().should('include', Cypress.env('auth_realm'));
  });
});
