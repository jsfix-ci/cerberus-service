describe('Occupant counts Details of different tasks on task details Page', () => {
  let dateNowFormatted;
  beforeEach(() => {
    cy.login(Cypress.env('userName'));
  });

  before(() => {
    dateNowFormatted = Cypress.dayjs().format('DD-MM-YYYY');
  });

  it('Should verify Occupant counts on task details page', () => {
    let date = new Date();
    cy.fixture('/has-counts-and-unknown-counts/task-with-occupant-count.json').then((task) => {
      date.setDate(date.getDate() + 8);
      task.variables.rbtPayload.value.data.movement.voyage.voyage.actualArrivalTimestamp = date.getTime();
      let mode = task.variables.rbtPayload.value.data.movement.serviceMovement.movement.mode.replace(/ /g, '-');
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      console.log(task);
      cy.postTasks(task, `AUTOTEST-${dateNowFormatted}-${mode}-OCCUPANT-COUNTS-WITH-UNKNOWN-COUNT`).then((response) => {
        cy.wait(4000);
        cy.checkTaskDisplayed(`${response.businessKey}`);
      });
    });

    cy.wait(2000);

    cy.get('.govuk-accordion__section-button').invoke('attr', 'aria-expanded').should('equal', 'true');

    cy.expandTaskDetails(0);

    cy.fixture('task-occupant-count-expected.json').then((expectedDetails) => {
      cy.contains('h3', 'Occupants').nextAll().within(() => {
        cy.getOccupantCounts().then((details) => {
          expect(details).to.deep.equal(expectedDetails['occupant-count-with-unknown']);
        });
      });
    });
  });

  it('Should verify Occupant counts on task details page when there are no unknown counts', () => {
    let date = new Date();
    cy.fixture('/has-counts-no-unknown-counts/task-with-occupant-counts-no-unknown.json').then((task) => {
      date.setDate(date.getDate() + 8);
      task.variables.rbtPayload.value.data.movement.voyage.voyage.actualArrivalTimestamp = date.getTime();
      let mode = task.variables.rbtPayload.value.data.movement.serviceMovement.movement.mode.replace(/ /g, '-');
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      console.log(task);
      cy.postTasks(task, `AUTOTEST-${dateNowFormatted}-${mode}-WITH-OCCUPANT-COUNTS-NO-UNKNOWN-COUNT`).then((response) => {
        cy.wait(4000);
        cy.checkTaskDisplayed(`${response.businessKey}`);
      });
    });

    cy.wait(2000);

    cy.get('.govuk-accordion__section-button').invoke('attr', 'aria-expanded').should('equal', 'true');

    cy.expandTaskDetails(0);

    cy.fixture('task-occupant-count-expected.json').then((expectedDetails) => {
      cy.contains('h3', 'Occupants').nextAll().within(() => {
        cy.getOccupantCounts().then((details) => {
          expect(details).to.deep.equal(expectedDetails['occupant-count-without-unknown']);
        });
      });
    });
  });

  it('Should verify Unknown Occupant counts on task details page when there are no counts available', () => {
    let date = new Date();
    cy.fixture('/no-counts-has-unknown-counts/task-with-occupant-no-counts-with-unknown-counts.json').then((task) => {
      date.setDate(date.getDate() + 8);
      task.variables.rbtPayload.value.data.movement.voyage.voyage.actualArrivalTimestamp = date.getTime();
      let mode = task.variables.rbtPayload.value.data.movement.serviceMovement.movement.mode.replace(/ /g, '-');
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      console.log(task);
      cy.postTasks(task, `AUTOTEST-${dateNowFormatted}-${mode}-NO-OCCUPANT-COUNTS-WITH-UNKNOWN-COUNT`).then((response) => {
        cy.wait(4000);
        cy.checkTaskDisplayed(`${response.businessKey}`);
      });
    });

    cy.wait(2000);

    cy.get('.govuk-accordion__section-button').invoke('attr', 'aria-expanded').should('equal', 'true');

    cy.expandTaskDetails(0);

    cy.fixture('task-occupant-count-expected.json').then((expectedDetails) => {
      cy.contains('h3', 'Occupants').nextAll().within(() => {
        cy.getOccupantCounts().then((details) => {
          expect(details).to.deep.equal(expectedDetails['unknown-count']);
        });
      });
    });
  });

  it('Should verify Occupant counts on task details page when there are no known and unknown counts', () => {
    let date = new Date();
    cy.fixture('/no-counts-vehicle-missing-attributes/task-with-occupant-no-counts-vehicle-missing-attr.json').then((task) => {
      date.setDate(date.getDate() + 8);
      task.variables.rbtPayload.value.data.movement.voyage.voyage.actualArrivalTimestamp = date.getTime();
      let mode = task.variables.rbtPayload.value.data.movement.serviceMovement.movement.mode.replace(/ /g, '-');
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      console.log(task);
      cy.postTasks(task, `AUTOTEST-${dateNowFormatted}-${mode}NO-OCCUPANT-COUNTS-MISSING-UNKNOWN-ATTR`).then((response) => {
        cy.wait(4000);
        cy.checkTaskDisplayed(`${response.businessKey}`);
      });
    });

    cy.wait(2000);

    cy.get('.govuk-accordion__section-button').invoke('attr', 'aria-expanded').should('equal', 'true');

    cy.expandTaskDetails(0);

    cy.contains('h3', 'Occupants').nextAll().within(() => {
      cy.get('.task-details-container').should('not.exist');
    });
  });

  after(() => {
    cy.deleteAutomationTestData();
    cy.contains('Sign out').click();
    cy.url().should('include', Cypress.env('auth_realm'));
  });
});
