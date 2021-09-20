describe('Task Details of different tasks on task details Page', () => {
  let dateNowFormatted;
  beforeEach(() => {
    cy.login(Cypress.env('userName'));
  });

  before(() => {
    dateNowFormatted = Cypress.moment(new Date()).format('DD-MM-YYYY');
  });

  it('Should verify task version details of unaccompanied task on task details page', () => {
    let date = new Date();
    let targetURL;
    cy.fixture('RoRo-Unaccompanied-RBT-SBT.json').then((task) => {
      date.setDate(date.getDate() + 8);
      task.variables.rbtPayload.value.data.movement.voyage.voyage.actualArrivalTimestamp = date.getTime();
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      cy.postTasks(task, `AUTOTEST-${dateNowFormatted}-RoRo-UNACC-VERSION`).then((response) => {
        cy.wait(4000);
        targetURL = response.businessKey;
        cy.checkTaskDisplayed(`${response.businessKey}`);
      });
    });

    cy.wait(2000);
    cy.get('.govuk-accordion__section-button').invoke('attr', 'aria-expanded').should('equal', 'true');
    cy.expandTaskDetails();

    cy.fixture('unaccompanied-task-details.json').then((expectedDetails) => {
      cy.contains('h2', 'Vehicle details').next().within(() => {
        cy.getTaskDetails().then((details) => {
          expect(details).to.deep.equal(expectedDetails.vehicle);
        });
      });

      cy.contains('h2', 'Account details').next().within(() => {
        cy.getTaskDetails().then((details) => {
          expect(details).to.deep.equal(expectedDetails.account);
        });
      });

      cy.contains('h2', 'Haulier details').next().within(() => {
        cy.getTaskDetails().then((details) => {
          expect(details).to.deep.equal(expectedDetails.haulier);
        });
      });

      cy.contains('h2', 'Driver').next().within(() => {
        cy.getTaskDetails().then((details) => {
          expect(details).to.deep.equal(expectedDetails.driver);
        });
      });

      cy.contains('h2', 'Passengers').next().within(() => {
        cy.getTaskDetails().then((details) => {
          expect(details).to.deep.equal(expectedDetails.passengers);
        });
      });

      cy.contains('h2', 'Goods').next().within(() => {
        cy.getTaskDetails().then((details) => {
          expect(details).to.deep.equal(expectedDetails.goods);
        });
      });

      cy.contains('h2', 'Booking').next().within(() => {
        cy.getTaskDetails().then((details) => {
          expect(details).to.deep.equal(expectedDetails.booking);
        });
      });

      cy.contains('h2', 'Targeting indicators').next().within(() => {
        cy.getTaskDetails().then((details) => {
          expect(details).to.deep.equal(expectedDetails.TargetingIndicators);
        });
      });

      cy.contains('h2', '1 selector matches').next().within(() => {
        cy.getTaskDetails().then((details) => {
          expect(details).to.deep.equal(expectedDetails.selector_matches);
        });
      });
      // COP-6433 : Auto-expand current task version
      cy.collapseTaskDetails();
      cy.get('.govuk-accordion__section-button').invoke('attr', 'aria-expanded').should('equal', 'false');
      cy.reload();
      cy.wait(2000);
      cy.get('.govuk-accordion__section-button').invoke('attr', 'aria-expanded').should('equal', 'false');

      cy.contains('Sign out').click();

      cy.login(Cypress.env('userName'));

      cy.checkTaskDisplayed(targetURL);

      cy.wait(2000);

      cy.get('.govuk-accordion__section-button').invoke('attr', 'aria-expanded').should('equal', 'true');
    });
  });

  it('Should verify task version details of accompanied task with no passengers on task details page', () => {
    let date = new Date();
    cy.fixture('RoRo-Accompanied-Freight.json').then((task) => {
      date.setDate(date.getDate() + 8);
      task.variables.rbtPayload.value.data.movement.voyage.voyage.actualArrivalTimestamp = date.getTime();
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      cy.postTasks(task, `AUTOTEST-${dateNowFormatted}-RoRo-ACC`).then((response) => {
        cy.wait(4000);
        cy.checkTaskDisplayed(`${response.businessKey}`);
      });
    });

    cy.wait(2000);

    cy.get('.govuk-accordion__section-button').invoke('attr', 'aria-expanded').should('equal', 'true');
    cy.expandTaskDetails();

    cy.fixture('accompanied-task-details.json').then((expectedDetails) => {
      cy.contains('h2', 'Vehicle details').next().within(() => {
        cy.getTaskDetails().then((details) => {
          expect(details).to.deep.equal(expectedDetails.vehicle);
        });
      });

      cy.contains('h2', 'Account details').next().within(() => {
        cy.getTaskDetails().then((details) => {
          expect(details).to.deep.equal(expectedDetails.account);
        });
      });

      cy.contains('h2', 'Haulier details').next().within(() => {
        cy.getTaskDetails().then((details) => {
          expect(details).to.deep.equal(expectedDetails.haulier);
        });
      });

      cy.contains('h2', 'Driver').next().within(() => {
        cy.getTaskDetails().then((details) => {
          expect(details).to.deep.equal(expectedDetails.driver);
        });
      });

      cy.contains('h2', 'Passengers').next().within(() => {
        cy.getTaskDetails().then((details) => {
          expect(details).to.deep.equal(expectedDetails.passengers);
        });
      });

      cy.contains('h2', 'Goods').next().within(() => {
        cy.getTaskDetails().then((details) => {
          expect(details).to.deep.equal(expectedDetails.goods);
        });
      });

      cy.contains('h2', 'Booking').next().within(() => {
        cy.getTaskDetails().then((details) => {
          expect(details).to.deep.equal(expectedDetails.booking);
        });
      });

      cy.contains('h2', 'Targeting indicators').next().within(() => {
        cy.getTaskDetails().then((details) => {
          expect(details).to.deep.equal(expectedDetails.TargetingIndicators);
        });
      });
    });
  });

  it('Should verify task version details of accompanied task with 2 passengers on task details page', () => {
    let date = new Date();
    cy.fixture('RoRo-Freight-Accompanied.json').then((task) => {
      date.setDate(date.getDate() + 8);
      task.variables.rbtPayload.value.data.movement.voyage.voyage.actualArrivalTimestamp = date.getTime();
      console.log(task.variables.rbtPayload.value);
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      cy.postTasks(task, `AUTOTEST-${dateNowFormatted}-RoRo-ACC-2-Passengers`).then((response) => {
        cy.wait(4000);
        cy.checkTaskDisplayed(`${response.businessKey}`);
      });
    });

    cy.wait(2000);

    cy.get('.govuk-accordion__section-button').invoke('attr', 'aria-expanded').should('equal', 'true');

    cy.expandTaskDetails();

    cy.fixture('accompanied-task-2-passengers-details.json').then((expectedDetails) => {
      cy.contains('h2', 'Vehicle details').next().within(() => {
        cy.getTaskDetails().then((details) => {
          expect(details).to.deep.equal(expectedDetails.vehicle);
        });
      });

      cy.contains('h2', 'Account details').next().within(() => {
        cy.getTaskDetails().then((details) => {
          expect(details).to.deep.equal(expectedDetails.account);
        });
      });

      cy.contains('h2', 'Haulier details').next().within(() => {
        cy.getTaskDetails().then((details) => {
          expect(details).to.deep.equal(expectedDetails.haulier);
        });
      });

      cy.contains('h2', 'Driver').next().within(() => {
        cy.getTaskDetails().then((details) => {
          expect(details).to.deep.equal(expectedDetails.driver);
        });
      });

      cy.contains('h2', 'Passengers').next().within(() => {
        cy.getTaskDetails().then((details) => {
          expect(details).to.deep.equal(expectedDetails.passengers);
        });
      });

      cy.contains('h2', 'Goods').next().within(() => {
        cy.getTaskDetails().then((details) => {
          expect(details).to.deep.equal(expectedDetails.goods);
        });
      });

      cy.contains('h2', 'Booking').next().within(() => {
        cy.getTaskDetails().then((details) => {
          expect(details).to.deep.equal(expectedDetails.booking);
        });
      });

      cy.contains('h2', 'Rules matched').next().within(() => {
        cy.getTaskDetails().then((details) => {
          expect(details).to.deep.equal(expectedDetails.rules);
        });
      });
    });
  });

  it('Should verify single task created for the same target with different versions when payloads sent with delay', () => {
    let date = new Date();
    const businessKey = `AUTOTEST-${dateNowFormatted}-RoRo-Versions-with-Delay-30Sec/${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
    date.setDate(date.getDate() + 8);
    cy.fixture('RoRo-task-v1.json').then((task) => {
      task.businessKey = businessKey;
      task.variables.rbtPayload.value.data.movementId = businessKey;
      task.variables.rbtPayload.value.data.movement.voyage.voyage.actualArrivalTimestamp = date.getTime();
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      cy.postTasks(task, null);
    });

    cy.wait(30000);

    cy.fixture('RoRo-task-v2.json').then((task) => {
      task.businessKey = businessKey;
      task.variables.rbtPayload.value.data.movementId = businessKey;
      task.variables.rbtPayload.value.data.movement.voyage.voyage.actualArrivalTimestamp = date.getTime();
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      cy.postTasks(task, null);
    });

    cy.wait(30000);

    cy.fixture('RoRo-task-v3.json').then((task) => {
      task.businessKey = businessKey;
      task.variables.rbtPayload.value.data.movementId = businessKey;
      task.variables.rbtPayload.value.data.movement.voyage.voyage.actualArrivalTimestamp = date.getTime();
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      cy.postTasks(task, null).then((response) => {
        cy.wait(15000);
        cy.checkTaskDisplayed(`${response.businessKey}`);
        let encodedBusinessKey = encodeURIComponent(`${response.businessKey}`);
        cy.getAllProcessInstanceId(encodedBusinessKey).then((res) => {
          expect(res.body.length).to.not.equal(0);
          expect(res.body.length).to.equal(1);
        });
      });
    });

    cy.get('.govuk-accordion__section-heading').should('have.length', 3);

    // COP-6433 : Auto-expand latest task version

    cy.get('.govuk-accordion__section-button').eq(0).invoke('attr', 'aria-expanded').should('equal', 'true');

    cy.get('.govuk-accordion__section-button').eq(0).click();

    cy.wait(2000);

    cy.get('.govuk-accordion__section-button').eq(0).invoke('attr', 'aria-expanded').should('equal', 'false');
    cy.reload();
    cy.wait(2000);
    cy.get('.govuk-accordion__section-button').eq(0).invoke('attr', 'aria-expanded').should('equal', 'false');

    cy.contains('Sign out').click();

    cy.login(Cypress.env('userName'));

    cy.checkTaskDisplayed(businessKey);

    cy.wait(2000);

    cy.get('.govuk-accordion__section-button').eq(0).invoke('attr', 'aria-expanded').should('equal', 'true');
  });

  it.skip('Should verify single task created for the same target with different versions when payloads sent without delay', () => {
    let date = new Date();
    date.setDate(date.getDate() + 8);
    const businessKey = `AUTOTEST-${dateNowFormatted}-RoRo-Versions-No-Delay/${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;

    let tasks = [];

    cy.fixture('RoRo-task-v1.json').then((task) => {
      task.variables.rbtPayload.value.data.movement.voyage.voyage.actualArrivalTimestamp = date.getTime();
      task.variables.rbtPayload.value.data.movementId = businessKey;
      task.businessKey = businessKey;
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      tasks.push(task);
    });

    cy.fixture('RoRo-task-v2.json').then((task) => {
      task.variables.rbtPayload.value.data.movement.voyage.voyage.actualArrivalTimestamp = date.getTime();
      task.variables.rbtPayload.value.data.movementId = businessKey;
      task.businessKey = businessKey;
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      tasks.push(task);
    });

    cy.fixture('RoRo-task-v3.json').then((task) => {
      task.variables.rbtPayload.value.data.movement.voyage.voyage.actualArrivalTimestamp = date.getTime();
      task.variables.rbtPayload.value.data.movementId = businessKey;
      task.businessKey = businessKey;
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      tasks.push(task);
    });

    cy.postTasksInParallel(tasks).then((response) => {
      cy.wait(15000);
      cy.checkTaskDisplayed(`${response.businessKey}`);
      let encodedBusinessKey = encodeURIComponent(`${response.businessKey}`);
      cy.getAllProcessInstanceId(encodedBusinessKey).then((res) => {
        expect(res.body.length).to.not.equal(0);
        expect(res.body.length).to.equal(1);
      });
    });
    cy.get('.govuk-accordion__section-heading').should('have.length', 1);
  });

  it.skip('Should verify single task created for the same target with different versions of failure when payloads sent without delay', () => {
    let date = new Date();
    date.setDate(date.getDate() + 8);
    const businessKey = `AUTOTEST-${dateNowFormatted}-RoRo-Versions-No-Delay-Failure/${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;

    let tasks = [];

    cy.fixture('/task-version/RoRo-task-v1.json').then((task) => {
      task.variables.rbtPayload.value.data.movement.voyage.voyage.actualArrivalTimestamp = date.getTime();
      task.variables.rbtPayload.value.data.movementId = businessKey;
      task.businessKey = businessKey;
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      tasks.push(task);
    });

    cy.fixture('/task-version/RoRo-task-v2.json').then((task) => {
      task.variables.rbtPayload.value.data.movement.voyage.voyage.actualArrivalTimestamp = date.getTime();
      task.variables.rbtPayload.value.data.movementId = businessKey;
      task.businessKey = businessKey;
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      tasks.push(task);
    });

    cy.fixture('/task-version/RoRo-task-v3.json').then((task) => {
      task.variables.rbtPayload.value.data.movement.voyage.voyage.actualArrivalTimestamp = date.getTime();
      task.variables.rbtPayload.value.data.movementId = businessKey;
      task.businessKey = businessKey;
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      tasks.push(task);
    });

    cy.fixture('/task-version/RoRo-task-v4.json').then((task) => {
      task.variables.rbtPayload.value.data.movement.voyage.voyage.actualArrivalTimestamp = date.getTime();
      task.variables.rbtPayload.value.data.movementId = businessKey;
      task.businessKey = businessKey;
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      tasks.push(task);
    });

    cy.postTasksInParallel(tasks).then((response) => {
      cy.wait(15000);
      cy.checkTaskDisplayed(`${response.businessKey}`);
      let encodedBusinessKey = encodeURIComponent(`${response.businessKey}`);
      cy.getAllProcessInstanceId(encodedBusinessKey).then((res) => {
        expect(res.body.length).to.not.equal(0);
        expect(res.body.length).to.equal(1);
      });
    });
    cy.get('.govuk-accordion__section-heading').should('have.length', 1);
  });

  // COP-6905 Scenario-2
  it('Should verify only one versions are created for a task when the attribute for the target indicators in the payload not changed', () => {
    let date = new Date();
    date.setDate(date.getDate() + 8);
    const businessKey = `AUTOTEST-${dateNowFormatted}-RoRo-Versions-target-indicators-same-version/${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;

    cy.fixture('RoRo-task-v1.json').then((task) => {
      task.businessKey = businessKey;
      task.variables.rbtPayload.value.data.movementId = businessKey;
      task.variables.rbtPayload.value.data.movement.voyage.voyage.actualArrivalTimestamp = date.getTime();
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      cy.postTasks(task, null);
    });

    cy.wait(30000);

    cy.fixture('RoRo-task-v1-target-update.json').then((task) => {
      task.businessKey = businessKey;
      task.variables.rbtPayload.value.data.movementId = businessKey;
      task.variables.rbtPayload.value.data.movement.voyage.voyage.actualArrivalTimestamp = date.getTime();
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      cy.postTasks(task, null).then((response) => {
        cy.wait(15000);
        cy.checkTaskDisplayed(`${response.businessKey}`);
        let encodedBusinessKey = encodeURIComponent(`${response.businessKey}`);
        cy.getAllProcessInstanceId(encodedBusinessKey).then((res) => {
          expect(res.body.length).to.not.equal(0);
          expect(res.body.length).to.equal(1);
        });
      });
    });
    cy.get('.govuk-accordion__section-heading').should('have.length', 1);
    cy.get('.govuk-accordion__section-button').invoke('attr', 'aria-expanded').should('equal', 'true');
    cy.expandTaskDetails();

    const expectedDetails = {
      'Name': 'Quick turnaround tourist (24-72 hours)',
      'Name': 'Paid by cash',
    };

    cy.contains('h2', 'Targeting indicators').next().within(() => {
      cy.getTaskDetails().then((details) => {
        expect(details).to.deep.equal(expectedDetails);
      });
    });
  });

  // COP-6905 Scenario-3
  it('Should verify 2 versions are created for a task when the payload has different target indicators', () => {
    let date = new Date();
    date.setDate(date.getDate() + 8);
    const businessKey = `AUTOTEST-${dateNowFormatted}-RoRo-Versions-target-indicators-diff-version/${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;

    cy.fixture('RoRo-task-v1.json').then((task) => {
      task.businessKey = businessKey;
      task.variables.rbtPayload.value.data.movementId = businessKey;
      task.variables.rbtPayload.value.data.movement.voyage.voyage.actualArrivalTimestamp = date.getTime();
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      cy.postTasks(task, null);
    });

    cy.wait(30000);

    cy.fixture('RoRo-task-v1-target-update.json').then((task) => {
      task.businessKey = businessKey;
      task.variables.rbtPayload.value.data.movementId = businessKey;
      task.variables.rbtPayload.value.data.movement.voyage.voyage.actualArrivalTimestamp = date.getTime();
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      cy.postTasks(task, null);
    });

    cy.wait(3000);

    cy.fixture('RoRo-task-v3-target-update.json').then((task) => {
      task.businessKey = businessKey;
      task.variables.rbtPayload.value.data.movementId = businessKey;
      task.variables.rbtPayload.value.data.movement.voyage.voyage.actualArrivalTimestamp = date.getTime();
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      cy.postTasks(task, null).then((response) => {
        cy.wait(15000);
        cy.checkTaskDisplayed(`${response.businessKey}`);
        let encodedBusinessKey = encodeURIComponent(`${response.businessKey}`);
        cy.getAllProcessInstanceId(encodedBusinessKey).then((res) => {
          expect(res.body.length).to.not.equal(0);
          expect(res.body.length).to.equal(1);
        });
      });
    });
    cy.get('.govuk-accordion__section-heading').should('have.length', 2);

    cy.get('.govuk-accordion__section-button').eq(0).invoke('attr', 'aria-expanded').should('equal', 'true');

    cy.get('.govuk-accordion__section-button').eq(0).invoke('attr', 'aria-expanded').then((value) => {
      if (value !== true) {
        cy.get('.govuk-accordion__section-button').eq(0).click();
      }
    });

    const expectedDetails = {
      'Name': 'UK port hop inbound',
      'Name': 'First use of account (Driver)',
      'Name': 'First time through this UK port (Trailer)',
    };

    cy.contains('h2', 'Targeting indicators').next().within(() => {
      cy.getTaskDetails().then((details) => {
        expect(details).to.deep.equal(expectedDetails);
      });
    });
  });

  after(() => {
    cy.deleteAutomationTestData();
    cy.contains('Sign out').click();
    cy.url().should('include', Cypress.env('auth_realm'));
  });
});
