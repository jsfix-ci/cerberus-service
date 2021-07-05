describe('Task Details of different tasks on task details Page', () => {
  beforeEach(() => {
    cy.login(Cypress.env('userName'));
  });

  it('Should verify task version details of unaccompanied task on task details page', () => {
    let date = new Date();
    cy.fixture('RoRo-Unaccompanied-RBT-SBT.json').then((task) => {
      task.variables.rbtPayload.value = JSON.parse(task.variables.rbtPayload.value);
      date.setDate(date.getDate() + 8);
      task.variables.rbtPayload.value.data.movement.voyage.voyage.actualArrivalTimestamp = date.getTime();
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      cy.postTasks(task, 'AUTOTEST-RoRo-UNACC-SBT').then((response) => {
        cy.wait(4000);
        cy.checkTaskDisplayed(`${response.businessKey}`);
      });
    });

    cy.wait(2000);
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
    });
  });

  it('Should verify task version details of accompanied task with no passengers on task details page', () => {
    let date = new Date();
    cy.fixture('RoRo-Accompanied-Freight.json').then((task) => {
      task.variables.rbtPayload.value = JSON.parse(task.variables.rbtPayload.value);
      date.setDate(date.getDate() + 8);
      task.variables.rbtPayload.value.data.movement.voyage.voyage.actualArrivalTimestamp = date.getTime();
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      cy.postTasks(task, 'AUTOTEST-RoRo-ACC').then((response) => {
        cy.wait(4000);
        cy.checkTaskDisplayed(`${response.businessKey}`);
      });
    });

    cy.wait(2000);

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
    });
  });

  it('Should verify task version details of accompanied task with 2 passengers on task details page', () => {
    let date = new Date();
    cy.fixture('RoRo-Freight-Accompanied.json').then((task) => {
      task.variables.rbtPayload.value = JSON.parse(task.variables.rbtPayload.value);
      date.setDate(date.getDate() + 8);
      task.variables.rbtPayload.value.data.movement.voyage.voyage.actualArrivalTimestamp = date.getTime();
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      cy.postTasks(task, 'AUTOTEST-RoRo-ACC-2-Passengers').then((response) => {
        cy.wait(4000);
        cy.checkTaskDisplayed(`${response.businessKey}`);
      });
    });

    cy.wait(2000);

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

  after(() => {
    cy.contains('Sign out').click();
    cy.url().should('include', Cypress.env('auth_realm'));
  });
});
