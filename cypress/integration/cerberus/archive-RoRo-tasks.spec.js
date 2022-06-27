describe('Airpax tasks archive functionality', () => {
  const userName = Cypress.env('userName');
  beforeEach(() => {
    cy.login(Cypress.env('userName'));
    cy.acceptPNRTerms();
  });

  it('Should verify RoRo tasks older than 6 months are archived', () => {
    const taskName = 'AUTO_TEST';
    cy.fixture('dismiss-task.json').as('dismissPayload');
    let pastTime = Cypress.dayjs().utc().subtract(180, 'days');
    let present = Cypress.dayjs().utc();
    let diff = (pastTime.diff(present)) / 1000;
    cy.setTimeOffset(diff);

    cy.fixture('RoRo-accompanied-v2.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      cy.createAirPaxTask(task).then((response) => {
        expect(response.movement.id).to.contain(taskName);
        cy.wait(4000);
        const taskID = response.id;
        cy.checkAirPaxTaskDisplayed(taskID);

        cy.claimAirPaxTask();

        cy.contains('Back to task list').click();

        cy.get('@dismissPayload').then((payload) => {
          payload.userId = Cypress.env('userName');
          cy.dismissAirPaxTask(payload, taskID).then((dismissTaskResponse) => {
            expect(dismissTaskResponse.id).to.equals(taskID);
            expect(dismissTaskResponse.status).to.equals('COMPLETE');
          });
        });

        cy.reSetTimeOffset();

        cy.archiveTasks();

        cy.wait(2000);

        cy.getArchivedTasks().then((archivedTasks) => {
          const taskIds = archivedTasks.map((archivedTask) => archivedTask.id);
          expect(taskIds).to.contain(taskID);
        });
      });
    });
  });

  it('Should verify RoRo targets older than 6 months are archived', () => {
    const taskName = 'AUTO_TEST';
    cy.fixture('issue-roro-task.json').as('issueTargetPayload');
    cy.fixture('recordOutcome.json').as('recordOutcomePayload');
    let pastTime = Cypress.dayjs().utc().subtract(7, 'month');
    let present = Cypress.dayjs().utc();
    let diff = (pastTime.diff(present)) / 1000;
    cy.setTimeOffset(diff);
    cy.fixture('RoRo-accompanied-v2.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      cy.createAirPaxTask(task).then((response) => {
        expect(response.movement.id).to.contain(taskName);
        cy.wait(4000);
        const taskID = response.id;
        cy.checkAirPaxTaskDisplayed(taskID);

        cy.claimAirPaxTask();

        cy.contains('Back to task list').click();
        cy.get('@issueTargetPayload').then((issueTask) => {
          issueTask.id = taskID;
          issueTask.movement.id = response.movement.id;
          issueTask.form.submittedBy = userName;
          cy.issueAirPaxTask(issueTask).then((issueTaskResponse) => {
            expect(issueTaskResponse.informationSheet.id).to.equals(taskID);
            expect(issueTaskResponse.informationSheet.movement.id).to.equals(task.data.movementId);
            cy.acknowledgeTarget(userName, taskID);
            cy.claimTarget(userName, taskID);
            cy.get('@recordOutcomePayload').then((target) => {
              target.outcome = 'NO_SHOW';
              target.user.email = userName;
              target.form.submittedBy = userName;
              cy.recordOutcome(target, taskID).then((targetResponse) => {
                console.log(targetResponse);
              });
            });
          });
        });
        cy.reSetTimeOffset();

        cy.archiveTasks();

        cy.wait(2000);

        cy.getArchivedTasks().then((archivedTasks) => {
          const taskIds = archivedTasks.map((archivedTask) => archivedTask.id);
          expect(taskIds).to.contain(taskID);
        });
      });
    });
  });

  it('Should verify RoRo tasks less than 6 months are NOT archived', () => {
    const taskName = 'AUTO_TEST';
    cy.fixture('dismiss-task.json').as('dismissPayload');
    let pastTime = Cypress.dayjs().utc().subtract(179, 'days');
    let present = Cypress.dayjs().utc();

    let diff = (pastTime.diff(present)) / 1000;
    cy.setTimeOffset(diff);

    cy.fixture('RoRo-accompanied-v2.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      cy.createAirPaxTask(task).then((response) => {
        expect(response.movement.id).to.contain(taskName);
        cy.wait(4000);
        const taskID = response.id;
        cy.checkAirPaxTaskDisplayed(taskID);

        cy.claimAirPaxTask();

        cy.contains('Back to task list').click();

        cy.get('@dismissPayload').then((payload) => {
          payload.userId = Cypress.env('userName');
          cy.dismissAirPaxTask(payload, taskID).then((dismissTaskResponse) => {
            expect(dismissTaskResponse.id).to.equals(taskID);
            expect(dismissTaskResponse.status).to.equals('COMPLETE');
          });
        });

        cy.reSetTimeOffset();

        cy.archiveTasks();

        cy.wait(2000);

        cy.getArchivedTasks().then((archivedTasks) => {
          const taskIds = archivedTasks.map((archivedTask) => archivedTask.id);
          expect(taskIds).not.to.contain(taskID);
        });
      });
    });
  });

  after(() => {
    cy.contains('Sign out').click();
    cy.url().should('include', Cypress.env('auth_realm'));
  });
});
