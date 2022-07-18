describe('Filter airpax tasks by TaskId or Passenger name', () => {
  beforeEach(() => {
    cy.login(Cypress.env('userName'));
    cy.acceptPNRTerms();
  });

  it('Should be able to filter by taskID', () => {
    cy.intercept('POST', '/v2/targeting-tasks/pages').as('pages');
    const taskName = 'AIRPAX';
    cy.fixture('airpax/task-airpax.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      cy.createTargetingApiTask(task).then((taskResponse) => {
        cy.wait(3000);
        let businessKey = taskResponse.id;
        cy.visit('/airpax/tasks');
        cy.wait(2000);
        cy.get('.govuk-input').should('be.visible').type(businessKey);
        cy.contains('Apply').click();
        cy.wait('@pages').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.get('.govuk-task-list-card').should('have.length', '1').contains(businessKey);
      });
    });
  });

  it('Should be able to filter by partial taskID', () => {
    cy.intercept('POST', '/v2/targeting-tasks/pages').as('pages');
    const taskName = 'AIRPAX';
    cy.fixture('airpax/task-airpax.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      cy.createTargetingApiTask(task).then((taskResponse) => {
        cy.wait(3000);
        let businessKey = taskResponse.id;
        const split = businessKey.split('-');
        let partialBusinessKey = (split[0] + '-' + split[1]);
        cy.visit('/airpax/tasks');
        cy.wait(2000);
        cy.get('.govuk-input').should('be.visible').type(partialBusinessKey);
        cy.contains('Apply').click();
        cy.wait('@pages').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.get('.govuk-task-list-card').contains(partialBusinessKey);
      });
    });
   });
  
  it('Should not be able to filter by taskID that does not exist ', () => {
    cy.intercept('POST', '/v2/targeting-tasks/pages').as('pages');
    cy.visit('/airpax/tasks');
    cy.wait(2000);
      cy.get('.govuk-input').should('be.visible').type('DEV-22000629-1273');
      cy.contains('Apply').click();
      cy.wait('@pages').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
    cy.get('.govuk-task-list-card').should('not.exist');
   });
  
    it('Should be able to filter by valid passenger name ', () => {
    cy.intercept('POST', '/v2/targeting-tasks/pages').as('pages');
    const taskName = 'AIRPAX';
    cy.fixture('airpax/task-airpax.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      let passengerName = task.data.movement.persons[1].person.familyName;
      cy.createTargetingApiTask(task).then((taskResponse) => {
        cy.wait(3000);
        console.log(taskResponse);
        cy.visit('/airpax/tasks');
        cy.wait(2000);
        cy.get('.govuk-input').should('be.visible').type(passengerName);
        cy.contains('Apply').click();
        cy.wait('@pages').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.get('.govuk-task-list-card').contains(passengerName.toUpperCase());
      });
    });
    });
  
   it('Should be able to filter by valid partial passenger name ', () => {
    cy.intercept('POST', '/v2/targeting-tasks/pages').as('pages');
    const taskName = 'AIRPAX';
    cy.fixture('airpax/task-airpax.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      let passengerName = task.data.movement.persons[1].person.familyName;
      const partialPassengerName = passengerName.split(' ');
      cy.createTargetingApiTask(task).then((taskResponse) => {
        cy.wait(3000);
        console.log(taskResponse);
        cy.visit('/airpax/tasks');
        cy.wait(2000);
        cy.get('.govuk-input').should('be.visible').type(partialPassengerName[0]);
        cy.contains('Apply').click();
        cy.wait('@pages').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.get('.govuk-task-list-card').contains(partialPassengerName[0].toUpperCase());
      });
    });
   });
  
  it('Should not be able to filter by passenger name that does not exist ', () => {
    cy.intercept('POST', '/v2/targeting-tasks/pages').as('pages');
    cy.visit('/airpax/tasks');
    cy.wait(2000);
      cy.get('.govuk-input').should('be.visible').type('AutomationTester NotExist');
      cy.contains('Apply').click();
      cy.wait('@pages').then(({ response }) => {
          xpect(response.statusCode).to.equal(200);
      });
    cy.get('.govuk-task-list-card').should('not.exist');
   });


  after(() => {
    cy.contains('Sign out').click();
    cy.url().should('include', Cypress.env('auth_realm'));
  });
});
