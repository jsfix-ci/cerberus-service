describe('Create task with different payload from Cerberus', () => {
  let taskNames = [];

  beforeEach(() => {
    cy.login(Cypress.env('userName'));
  });

  it('Should create a task with a payload contains hazardous cargo without description', () => {
    cy.fixture('tasks-hazardous-cargo.json').then((task) => {
      cy.postTasks(task, 'AUTOTEST-HAZARDOUS').then((businessKey) => {
        taskNames.push(businessKey);
      });
    });
  });

  it('Should create a task with a payload contains RoRo Tourist', () => {
    cy.fixture('RoRo-Tourist.json').then((task) => {
      cy.postTasks(task, 'AUTOTEST-TOURIST').then((businessKey) => {
        taskNames.push(businessKey);
      });
    });
  });

  it('Should create a task with a payload contains RoRo Tourist from RBT & SBT', () => {
    cy.fixture('RoRo-Tourist-RBT-SBT.json').then((task) => {
      cy.postTasks(task, 'AUTOTEST-TOURIST-RBT-SBT').then((businessKey) => {
        taskNames.push(businessKey);
      });
    });
  });

  it('Should create a task with a payload contains RoRo Tourist from SBT', () => {
    cy.fixture('RoRo-Tourist-SBT.json').then((task) => {
      cy.postTasks(task, 'AUTOTEST-TOURIST-SBT').then((businessKey) => {
        taskNames.push(businessKey);
      });
    });
  });

  it('Should create a task with a payload contains RoRo Accompanied Freight', () => {
    cy.fixture('RoRo-Accompanied-Freight.json').then((task) => {
      cy.postTasks(task, 'AUTOTEST-RoRo-ACC').then((businessKey) => {
        taskNames.push(businessKey);
      });
    });
  });

  it('Should create a task with a payload contains RoRo Accompanied Freight from RBT & SBT', () => {
    cy.fixture('RoRo-Accompanied-RBT-SBT.json').then((task) => {
      cy.postTasks(task, 'AUTOTEST-RoRo-ACC-RBT-SBT').then((businessKey) => {
        taskNames.push(businessKey);
      });
    });
  });

  it('Should create a task with a payload contains RoRo Accompanied Freight from SBT', () => {
    cy.fixture('RoRo-Accompanied-SBT.json').then((task) => {
      cy.postTasks(task, 'AUTOTEST-RoRo-ACC-SBT').then((businessKey) => {
        taskNames.push(businessKey);
      });
    });
  });

  it('Should create a task with a payload contains RoRo Unaccompanied Freight from SBT', () => {
    cy.fixture('RoRo-Unaccompanied-Freight.json').then((task) => {
      cy.postTasks(task, 'AUTOTEST-RoRo-UNACC-SBT').then((businessKey) => {
        taskNames.push(businessKey);
      });
    });
  });

  it('Should create a task with a payload contains RoRo Unaccompanied Freight from RBT & SBT', () => {
    cy.fixture('RoRo-Unaccompanied-RBT-SBT.json').then((task) => {
      cy.postTasks(task, 'AUTOTEST-RoRo-UNACC-RBT-SBT').then((businessKey) => {
        taskNames.push(businessKey);
      });
    });
  });

  it('Verify all the tasks on Cerberus-UI', () => {
    cy.get('a[href="#new"]').click();
    taskNames.forEach((item) => {
      cy.findTaskInAllThePages(item, null).then((taskFound) => {
        expect(taskFound).to.equal(true);
      });
    });
  });
});
