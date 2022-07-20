describe('Delet tasks and verify it on UI', () => {
  beforeEach(() => {
    cy.login(Cypress.env('userName'));
    cy.acceptPNRTerms();
  });

  it('Should delete an airpax task with movementId and verify it is not present', () => {
    cy.intercept('POST', '/v2/targeting-tasks/pages').as('taskList');
    const taskName = 'AIRPAX';
    cy.fixture('airpax/task-airpax.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      cy.createTargetingApiTask(task).then((taskResponse) => {
          expect(taskResponse.movement.id).to.contain('AIRPAX');
          let movementId = taskResponse.movement.id;
          let businessKey = taskResponse.id;
          cy.wait(4000);
          cy.visit('/airpax/tasks');
          cy.wait('@taskList').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
          });
          cy.get('.govuk-task-list-card').find('h4.task-heading')
          .should('be.visible')
          .invoke('text')
          .then((text) => {
            expect(text).to.include(businessKey);
          });
          cy.deleteTasks(movementId);
          cy.reload();
          cy.wait(3000);
          cy.get('.govuk-task-list-card').find('h4.task-heading')
          .should('be.visible')
          .invoke('text')
          .then((text) => {
            expect(text).to.not.include(businessKey);
          });
      });
    });
    });
  it('Should delete an airpax task with partial movementId verify it is not present', () => {
    cy.intercept('POST', '/v2/targeting-tasks/pages').as('taskList');
    let date = new Date();
    let dateNowFormatted = Cypress.dayjs(date).utc().format('DD-MM-YYYY');
    const taskName = 'AIRPAX';
    cy.fixture('airpax/task-airpax.json').then((task) => {
      task.data.movementId = `${taskName}-${dateNowFormatted}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
        cy.createTargetingApiTask(task).then((taskResponse) => {
          expect(taskResponse.movement.id).to.contain('AIRPAX');
          let movementId = taskResponse.movement.id;
          let businessKey = taskResponse.id;
          cy.wait(4000);
          cy.visit('/airpax/tasks');
          cy.wait('@taskList').then(({ response }) => {
            expect(response.statusCode).to.equal(200);
          });
          cy.get('.govuk-task-list-card').find('h4.task-heading')
          .should('be.visible')
          .invoke('text')
          .then((text) => {
            expect(text).to.include(businessKey);
          });
          cy.deleteTasks(`${taskName}-${dateNowFormatted}`);
          cy.reload();
          cy.wait(3000);
          cy.get('.govuk-task-list-card').find('h4.task-heading')
          .should('be.visible')
          .invoke('text')
          .then((text) => {
            expect(text).to.not.include(businessKey);
        });
      });
    });
  });
    
  it('Should delete a RoRo task with movementId verify it is not present', () => {
    cy.intercept('POST', '/v2/targeting-tasks/pages').as('taskList');
    let date = new Date();
    let dateNowFormatted = Cypress.dayjs(date).utc().format('DD-MM-YYYY');
    const taskName = 'AUTOTEST';
    cy.fixture('RoRo-accompanied-v2.json').then((task) => {
      task.data.movementId = `${taskName}-${dateNowFormatted}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      cy.createTargetingApiTask(task).then((taskResponse) => {
          expect(taskResponse.movement.id).to.contain('AUTOTEST');
          let movementId = taskResponse.movement.id;
          let businessKey = taskResponse.id;
          cy.wait(4000);
          cy.visit('/tasks');
          cy.wait('@taskList').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
          });
          cy.get('.govuk-task-list-card').find('h4.task-heading')
          .should('be.visible')
          .invoke('text')
          .then((text) => {
            expect(text).to.include(movementId);
          });
          cy.deleteTasks(movementId );
          cy.reload();
          cy.wait(3000);
          cy.get('.govuk-task-list-card').find('h4.task-heading')
          .should('be.visible')
          .invoke('text')
          .then((text) => {
            expect(text).to.not.include(movementId);
          });
      });
    });
  });

  it('Should delete a RoRo task with partial movementId verify it is not present', () => {
    cy.intercept('POST', '/v2/targeting-tasks/pages').as('taskList');
    let date = new Date();
    let dateNowFormatted = Cypress.dayjs(date).utc().format('DD-MM-YYYY');
    const taskName = 'AUTOTEST';
    cy.fixture('RoRo-accompanied-v2.json').then((task) => {
      task.data.movementId = `${taskName}-${dateNowFormatted}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      cy.createTargetingApiTask(task).then((taskResponse) => {
          expect(taskResponse.movement.id).to.contain('AUTOTEST');
          let movementId = taskResponse.movement.id;
          let businessKey = taskResponse.id;
          cy.wait(4000);
          cy.visit('/tasks');
          cy.wait('@taskList').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
          });
          cy.get('.govuk-task-list-card').find('h4.task-heading')
          .should('be.visible')
          .invoke('text')
          .then((text) => {
            expect(text).to.include(movementId);
          });
          cy.deleteTasks(movementId );
          cy.reload();
          cy.wait(3000);
          cy.get('.govuk-task-list-card').find('h4.task-heading')
          .should('be.visible')
          .invoke('text')
          .then((text) => {
            expect(text).to.not.include(`${taskName}-${dateNowFormatted}`);
          });
      });
    });
  });

  after(() => {
    cy.contains('Sign out').click();
    cy.url().should('include', Cypress.env('auth_realm'));
  });
});
