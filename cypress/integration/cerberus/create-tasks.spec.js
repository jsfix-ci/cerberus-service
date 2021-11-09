describe('Create task with different payload from Cerberus', () => {
  before(() => {
    cy.login(Cypress.env('userName'));
  });

  it('Should create a task with a payload contains hazardous cargo without description and passport number as null', () => {
    cy.createCerberusTask('tasks-hazardous-cargo.json', 'HAZARDOUS');
  });

  it('Should create a task with a payload contains organisation value as null', () => {
    cy.createCerberusTask('tasks-org-null.json', 'ORG-NULL');
  });

  it('Should create a task with a payload contains vehicle value as null', () => {
    cy.fixture('task-vehicle-null.json').then((task) => {
      let date = new Date();
      let dateNowFormatted = Cypress.dayjs(date).format('DD-MM-YYYY');
      let bookingDateTime = task.variables.rbtPayload.value.data.movement.serviceMovement.attributes.attrs.bookingDateTime;
      bookingDateTime = Cypress.dayjs(bookingDateTime).format('D MMM YYYY [at] HH:mm');
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      cy.postTasks(task, `AUTOTEST-${dateNowFormatted}-VEHICLE-NULL`).then((response) => {
        cy.wait(4000);
        cy.checkTaskDisplayed(`${response.businessKey}`);
        cy.checkTaskSummary(null, bookingDateTime);
      });
    });
  });

  it('Should create a task with a payload contains RoRo Tourist and check AbuseType set to correct value', () => {
    cy.createCerberusTask('RoRo-Tourist.json', 'TOURIST-WITH-PASSENGERS').then(() => {
      cy.wait(2000);
      cy.expandTaskDetails(0).then(() => {
        cy.contains('h2', 'Rules matched').next().contains('.govuk-summary-list__key', 'Abuse type')
          .next()
          .should('have.text', 'Obscene Material');
      });
    });
  });

  it('Should create a task with a payload contains RoRo Tourist from RBT & SBT', () => {
    cy.createCerberusTask('RoRo-Tourist-RBT-SBT.json', 'TOURIST-RBT-SBT');
  });

  it('Should create a task with a payload contains RoRo Tourist from SBT', () => {
    cy.createCerberusTask('RoRo-Tourist-SBT.json', 'TOURIST-SBT');
  });

  it('Should create a task with a payload contains RoRo Accompanied Freight', () => {
    cy.createCerberusTask('RoRo-Freight-Accompanied.json', 'RoRo-ACC');
  });

  it('Should create a task with a payload contains RoRo Accompanied Freight from RBT & SBT', () => {
    cy.createCerberusTask('RoRo-Accompanied-RBT-SBT.json', 'RoRo-ACC-RBT-SBT');
  });

  it('Should create a task with a payload contains RoRo Accompanied Freight from SBT', () => {
    cy.createCerberusTask('RoRo-Accompanied-SBT.json', 'RoRo-ACC-SBT');
  });

  it('Should create a task with a payload contains RoRo Unaccompanied Freight from SBT', () => {
    cy.createCerberusTask('RoRo-Unaccompanied-Freight.json', 'RoRo-UNACC-SBT');
  });

  it('Should create a task with a payload contains RoRo Unaccompanied Freight from RBT & SBT', () => {
    cy.createCerberusTask('RoRo-Unaccompanied-RBT-SBT.json', 'RoRo-UNACC-RBT-SBT');
  });

  it('Should create a task with a payload contains RoRo accompanied with no passengers', () => {
    cy.createCerberusTask('RoRo-Freight-Accompanied-no-passengers.json', 'RoRo-ACC-NO-PASSENGERS');
  });

  it('Should create TSV task with payload contains actual and scheduled timestamps different', () => {
    cy.createCerberusTask('tsv-timestamps-different.json', 'TSV-TIMESTAMP-DIFF');
  });

  it('Should create TSV task with payload contains actual and scheduled timestamps same', () => {
    cy.createCerberusTask('tsv-timestamps-same.json', 'TSV-TIMESTAMP-SAME');
  });

  it('Should create TSV task with payload contains only scheduled timestamp', () => {
    cy.createCerberusTask('tsv-scheduled-timestamp.json', 'TSV-TIMESTAMP-SCHEDULED');
  });

  it('Should create TSV task with payload with no actual and scheduled timestamps', () => {
    cy.createCerberusTask('tsv-only-estimated-timestamp.json', 'TSV-NO-ACTUAL-SCHEDULED-TIMESTAMP');
  });

  it('Should create TSV task with payload with no departure location, actual, scheduled and estimated timestamps', () => {
    cy.createCerberusTask('tsv-no-departure-location.json', 'TSV-NO-DEPARTURE-LOCATION');
  });

  it('Should create a task with payload contains risks array as null', () => {
    cy.intercept('POST', '/camunda/task/*/claim').as('claim');
    cy.fixture('task-risks-null.json').then((task) => {
      let date = new Date();
      let dateNowFormatted = Cypress.dayjs(date).format('DD-MM-YYYY');
      let mode = task.variables.rbtPayload.value.data.movement.serviceMovement.movement.mode.replace(/ /g, '-');
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      cy.postTasks(task, `AUTOTEST-${dateNowFormatted}-${mode}-RISKS-NULL`).then((response) => {
        cy.wait(4000);
        cy.navigation('Tasks');
        cy.get('.govuk-heading-xl').should('have.text', 'Task management');
        cy.checkTaskDisplayed(`${response.businessKey}`);
        cy.contains('0 selector matches');
      });
    });
  });

  after(() => {
    cy.deleteAutomationTestData();
    cy.contains('Sign out').click();
    cy.url().should('include', Cypress.env('auth_realm'));
  });
});
