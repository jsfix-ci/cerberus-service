describe('Create task with different payload from Cerberus', () => {
  let date;
  beforeEach(() => {
    cy.login(Cypress.env('userName'));
    date = new Date();
  });

  it('Should create a task with a payload contains hazardous cargo without description', () => {
    cy.fixture('tasks-hazardous-cargo.json').then((task) => {
      cy.postTasks(task, 'AUTOTEST-HAZARDOUS').then((response) => {
        cy.wait(4000);
        cy.checkTaskDisplayed(`${response.businessKey}`);
      });
    });
  });

  it('Should create a task with a payload contains organisation value as null', () => {
    cy.fixture('tasks-org-null.json').then((task) => {
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      console.log(task);
      cy.postTasks(task, 'AUTOTEST-ORG-NULL').then((response) => {
        cy.wait(4000);
        cy.checkTaskDisplayed(`${response.businessKey}`);
      });
    });
  });

  it('Should create a task with a payload contains RoRo Tourist and check AbuseType set to correct value', () => {
    cy.fixture('RoRo-Tourist.json').then((task) => {
      task.variables.rbtPayload.value = JSON.parse(task.variables.rbtPayload.value);
      date.setDate(date.getDate() + 2);
      task.variables.rbtPayload.value.data.movement.voyage.voyage.actualArrivalTimestamp = date.getTime();
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      cy.postTasks(task, 'AUTOTEST-TOURIST').then((response) => {
        cy.wait(4000);
        cy.checkTaskDisplayed(`${response.businessKey}`);
      });
      cy.wait(2000);
      cy.get('.govuk-accordion__section-button').invoke('attr', 'aria-expanded').then((value) => {
        if (value !== true) {
          cy.get('.govuk-accordion__section-button').click();
        }
      });
      cy.contains('h2', 'Rules matched').next().contains('.govuk-summary-list__key', 'Abuse type')
        .next()
        .should('have.text', 'Obscene Material');
    });
  });

  it('Should create a task with a payload contains RoRo Tourist from RBT & SBT', () => {
    cy.fixture('RoRo-Tourist-RBT-SBT.json').then((task) => {
      task.variables.rbtPayload.value = JSON.parse(task.variables.rbtPayload.value);
      date.setDate(date.getDate() + 5);
      task.variables.rbtPayload.value.data.movement.voyage.voyage.actualArrivalTimestamp = date.getTime();
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      cy.postTasks(task, 'AUTOTEST-TOURIST-RBT-SBT').then((response) => {
        cy.wait(4000);
        cy.checkTaskDisplayed(`${response.businessKey}`);
      });
    });
  });

  it('Should create a task with a payload contains RoRo Tourist from SBT', () => {
    cy.fixture('RoRo-Tourist-SBT.json').then((task) => {
      task.variables.rbtPayload.value = JSON.parse(task.variables.rbtPayload.value);
      date.setDate(date.getDate() + 4);
      task.variables.rbtPayload.value.data.movement.voyage.voyage.actualArrivalTimestamp = date.getTime();
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      cy.postTasks(task, 'AUTOTEST-TOURIST-SBT').then((response) => {
        cy.wait(4000);
        cy.checkTaskDisplayed(`${response.businessKey}`);
      });
    });
  });

  it('Should create a task with a payload contains RoRo Accompanied Freight', () => {
    cy.fixture('RoRo-Accompanied-Freight.json').then((task) => {
      cy.postTasks(task, 'AUTOTEST-RoRo-ACC').then((response) => {
        cy.wait(4000);
        cy.checkTaskDisplayed(`${response.businessKey}`);
      });
    });
  });

  it('Should create a task with a payload contains RoRo Accompanied Freight from RBT & SBT', () => {
    cy.fixture('RoRo-Accompanied-RBT-SBT.json').then((task) => {
      task.variables.rbtPayload.value = JSON.parse(task.variables.rbtPayload.value);
      date.setDate(date.getDate() + 6);
      task.variables.rbtPayload.value.data.movement.voyage.voyage.actualArrivalTimestamp = date.getTime();
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      cy.postTasks(task, 'AUTOTEST-RoRo-ACC-RBT-SBT').then((response) => {
        cy.wait(4000);
        cy.checkTaskDisplayed(`${response.businessKey}`);
      });
    });
  });

  it('Should create a task with a payload contains RoRo Accompanied Freight from SBT', () => {
    cy.fixture('RoRo-Accompanied-SBT.json').then((task) => {
      task.variables.rbtPayload.value = JSON.parse(task.variables.rbtPayload.value);
      date.setDate(date.getDate() + 10);
      task.variables.rbtPayload.value.data.movement.voyage.voyage.actualArrivalTimestamp = date.getTime();
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      cy.postTasks(task, 'AUTOTEST-RoRo-ACC-SBT').then((response) => {
        cy.wait(4000);
        cy.checkTaskDisplayed(`${response.businessKey}`);
      });
    });
  });

  it('Should create a task with a payload contains RoRo Unaccompanied Freight from SBT', () => {
    cy.fixture('RoRo-Unaccompanied-Freight.json').then((task) => {
      task.variables.rbtPayload.value = JSON.parse(task.variables.rbtPayload.value);
      date.setDate(date.getDate() + 8);
      task.variables.rbtPayload.value.data.movement.voyage.voyage.actualArrivalTimestamp = date.getTime();
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      cy.postTasks(task, 'AUTOTEST-RoRo-UNACC-SBT').then((response) => {
        cy.wait(4000);
        cy.checkTaskDisplayed(`${response.businessKey}`);
      });
    });
  });

  it('Should create a task with a payload contains RoRo Unaccompanied Freight from RBT & SBT', () => {
    cy.fixture('RoRo-Unaccompanied-RBT-SBT.json').then((task) => {
      task.variables.rbtPayload.value = JSON.parse(task.variables.rbtPayload.value);
      date.setDate(date.getDate() + 1);
      task.variables.rbtPayload.value.data.movement.voyage.voyage.actualArrivalTimestamp = date.getTime();
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      cy.postTasks(task, 'AUTOTEST-RoRo-UNACC-RBT-SBT').then((response) => {
        cy.wait(4000);
        cy.checkTaskDisplayed(`${response.businessKey}`);
      });
    });
  });

  after(() => {
    cy.contains('Sign out').click();
    cy.url().should('include', Cypress.env('auth_realm'));
  });
});
