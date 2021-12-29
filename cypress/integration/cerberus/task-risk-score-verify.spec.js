describe('View total Risk score from Targeting Indicators in the task list Page', () => {
  beforeEach(() => {
    cy.login(Cypress.env('userName'));
  });

  it('Should verify the Risk Score for a task with 2 Target Indicators', () => {
    // COP-9051
    cy.getBusinessKey('-RORO-Accompanied-Freight-target-indicators-same-version_').then((businessKeys) => {
      expect(businessKeys.length).to.not.equal(0);
      cy.verifyTaskListInfo(`${businessKeys[0]}`).then((taskListDetails) => {
        console.log(taskListDetails);
        expect('Risk Score: 50').to.deep.equal(taskListDetails.riskScore);
      });
    });
  });

  it('Should verify the Risk Score for Task with multiple versions', () => {
    // COP-9051 The aggregated score is for the TIs in the latest version and does NOT include the score for TIs in previous 2 versions
    cy.getBusinessKey('-RORO-Accompanied-Freight-target-indicators-diff-version_').then((businessKeys) => {
      expect(businessKeys.length).to.not.equal(0);
      cy.verifyTaskListInfo(`${businessKeys[0]}`).then((taskListDetails) => {
        expect('Risk Score: 80').to.deep.equal(taskListDetails.riskScore);
      });
    });
  });

  it('Should verify the Risk Score for Task with 16 TIs displays the correct aggregated score', () => {
    // COP-9051
    cy.getBusinessKey('-Target-Indicators-Details').then((businessKeys) => {
      expect(businessKeys.length).to.not.equal(0);
      cy.verifyTaskListInfo(`${businessKeys[0]}`).then((taskListDetails) => {
        expect('Risk Score: 4140').to.deep.equal(taskListDetails.riskScore);
      });
    });
  });

  it('Should verify the Risk Score for Tasks without TIs present are not displaying a score/value', () => {
    // COP-9051
    cy.getBusinessKey('-RORO-Unaccompanied-Freight-RoRo-UNACC-SBT_').then((businessKeys) => {
      expect(businessKeys.length).to.not.equal(0);
      cy.verifyTaskListInfo(`${businessKeys[0]}`).then((taskListDetails) => {
        expect('Risk Score: 0').to.deep.equal(taskListDetails.riskScore);
      });
    });
  });
});
