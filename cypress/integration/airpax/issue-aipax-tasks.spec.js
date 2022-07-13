describe('Create AirPax task and issue target', () => {
  beforeEach(() => {
    cy.login(Cypress.env('userName'));
    cy.acceptPNRTerms();
  });

  it('Should verify filter targets by Assignee', () => {
    const userId = Cypress.env('userName');
    const taskName = 'AIRPAX';
    cy.fixture('airpax/task-airpax.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      cy.createTargetingApiTask(task).then((taskResponse) => {
        cy.wait(3000);
        let businessKey = taskResponse.id;
        let movementId = taskResponse.movement.id;
        cy.claimAirPaxTaskWithUserId(`${taskResponse.id}`, userId);
        cy.wait(2000);
        cy.fixture('airpax/issue-task-airpax.json').then((issueTask) => {
          issueTask.id = businessKey;
          issueTask.movement.id = movementId;
          issueTask.form.submittedBy = userId;
          cy.issueTarget(issueTask).then((issueTaskResponse) => {
            expect(issueTaskResponse.informationSheet.id).to.equals(businessKey);
            expect(issueTaskResponse.informationSheet.movement.id).to.equals(movementId);
            cy.wait(2000);
            cy.acknowledgeTarget(userId, businessKey);
            cy.wait(2000);
            cy.claimTarget(userId, businessKey);
            cy.fixture('airpax/filterTargetPage.json').then((filter) => {
              filter.filterParams.assignees[0] = userId;
              cy.filterPageByAssignee(filter).then((filterResponse) => {
                expect(filterResponse[0].assignee).to.eql(userId);
              });
            });
          });
        });
      });
    });
  });

  it.only('Should verify filter target journeys by Assignee', () => {
    const userId = Cypress.env('userName');
    const taskName = 'AIRPAX';
    cy.fixture('airpax/task-airpax.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      cy.createTargetingApiTask(task).then((taskResponse) => {
        cy.wait(3000);
        let businessKey = taskResponse.id;
        let movementId = taskResponse.movement.id;
        cy.claimAirPaxTaskWithUserId(`${taskResponse.id}`, userId);
        cy.wait(2000);
        cy.fixture('airpax/issue-task-airpax.json').then((issueTask) => {
          issueTask.id = businessKey;
          issueTask.movement.id = movementId;
          issueTask.form.submittedBy = userId;
          cy.issueTarget(issueTask).then((issueTaskResponse) => {
            expect(issueTaskResponse.informationSheet.id).to.equals(businessKey);
            expect(issueTaskResponse.informationSheet.movement.id).to.equals(movementId);
            cy.wait(2000);
            cy.acknowledgeTarget(userId, businessKey);
            cy.wait(2000);
            cy.claimTarget(userId, businessKey);
            cy.fixture('airpax/filterTargetPage.json').then((filter) => {
              filter.filterParams.assignees[0] = userId;
              cy.filterJourneysByAssignee(filter).then((filterResponse) => {
                expect(filterResponse[0].targets[0].assignee).to.eql(userId);
              });
            });
          });
        });
      });
    });
  });

  after(() => {
    cy.contains('Sign out').click();
    cy.url().should('include', Cypress.env('auth_realm'));
  });
});
