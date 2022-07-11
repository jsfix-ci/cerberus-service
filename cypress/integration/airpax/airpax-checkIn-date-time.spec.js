describe('Targeter to see how long before departure check-in occurs So that Targeter can prioritise a task accordingly', () => {
  beforeEach(() => {
    cy.login(Cypress.env('userName'));
    cy.acceptPNRTerms();
  });
  it('Should verify when check-in time is not available, it populates as Unknown in Cerberus UI', () => {
    const taskName = 'AIRPAX';
    cy.fixture('airpax/task-airpax.json').then((task) => {
      task.data.movement.serviceMovement.features.feats['STANDARDISED:checkinDateTime'].value = null;
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      cy.createTargetingApiTask(task).then((taskResponse) => {
        expect(taskResponse.movement.id).to.contain('AIRPAX');
        cy.wait(4000);
        let businessKey = taskResponse.id;
        cy.checkAirPaxTaskDisplayed(businessKey);
        cy.verifyAirPaxCheckInDateTime('Unknown');
      });
    });
  });
  
  it('Should verify when check-in time is displayed', () => {
    const taskName = 'AIRPAX';
    cy.fixture('airpax/task-airpax.json').then((task) => {
      task.data.movement.serviceMovement.features.feats['STANDARDISED:checkinDateTime'].value = '2022-06-10T09:00:00Z';
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      cy.createTargetingApiTask(task).then((taskResponse) => {
        expect(taskResponse.movement.id).to.contain('AIRPAX');
        cy.wait(4000);
        let businessKey = taskResponse.id;
        cy.checkAirPaxTaskDisplayed(businessKey);
        cy.verifyAirPaxCheckInDateTime('10 Jun 2022 at 09:00');
      });
    });
  });

  after(() => {
    cy.deleteAutomationTestData();
    cy.contains('Sign out').click();
    cy.url().should('include', Cypress.env('auth_realm'));
  });
});
