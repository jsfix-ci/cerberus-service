describe('Create task with different payload from Cerberus', () => {
  beforeEach(() => {
    cy.login(Cypress.env('userName'));
  });

  it('Should create a task with a payload contains hazardous cargo without description', () => {
    cy.fixture('tasks-hazardous-cargo.json').then((task) => {
      cy.postTasks(task, 'AUTOTEST-HAZARDOUS').then((response) => {
        cy.wait(4000);
        cy.getProcessInstanceId(`${response.businessKey}`).then((processInstanceId) => {
          cy.checkTaskDisplayed(processInstanceId, `${response.businessKey}`);
        });
      });
    });
  });

  it('Should create a task with a payload contains RoRo Tourist', () => {
    cy.fixture('RoRo-Tourist.json').then((task) => {
      cy.postTasks(task, 'AUTOTEST-TOURIST').then((response) => {
        cy.wait(4000);
        cy.getProcessInstanceId(`${response.businessKey}`).then((processInstanceId) => {
          cy.checkTaskDisplayed(processInstanceId, `${response.businessKey}`);
        });
      });
    });
  });

  it('Should create a task with a payload contains RoRo Tourist from RBT & SBT', () => {
    cy.fixture('RoRo-Tourist-RBT-SBT.json').then((task) => {
      cy.postTasks(task, 'AUTOTEST-TOURIST-RBT-SBT').then((response) => {
        cy.wait(4000);
        cy.getProcessInstanceId(`${response.businessKey}`).then((processInstanceId) => {
          cy.checkTaskDisplayed(processInstanceId, `${response.businessKey}`);
        });
      });
    });
  });

  it('Should create a task with a payload contains RoRo Tourist from SBT', () => {
    cy.fixture('RoRo-Tourist-SBT.json').then((task) => {
      cy.postTasks(task, 'AUTOTEST-TOURIST-SBT').then((response) => {
        cy.wait(4000);
        cy.getProcessInstanceId(`${response.businessKey}`).then((processInstanceId) => {
          cy.checkTaskDisplayed(processInstanceId, `${response.businessKey}`);
        });
      });
    });
  });

  it('Should create a task with a payload contains RoRo Accompanied Freight', () => {
    cy.fixture('RoRo-Accompanied-Freight.json').then((task) => {
      cy.postTasks(task, 'AUTOTEST-RoRo-ACC').then((response) => {
        cy.wait(4000);
        cy.getProcessInstanceId(`${response.businessKey}`).then((processInstanceId) => {
          cy.checkTaskDisplayed(processInstanceId, `${response.businessKey}`);
        });
      });
    });
  });

  it('Should create a task with a payload contains RoRo Accompanied Freight from RBT & SBT', () => {
    cy.fixture('RoRo-Accompanied-RBT-SBT.json').then((task) => {
      cy.postTasks(task, 'AUTOTEST-RoRo-ACC-RBT-SBT').then((response) => {
        cy.wait(4000);
        cy.getProcessInstanceId(`${response.businessKey}`).then((processInstanceId) => {
          cy.checkTaskDisplayed(processInstanceId, `${response.businessKey}`);
        });
      });
    });
  });

  it('Should create a task with a payload contains RoRo Accompanied Freight from SBT', () => {
    cy.fixture('RoRo-Accompanied-SBT.json').then((task) => {
      cy.postTasks(task, 'AUTOTEST-RoRo-ACC-SBT').then((response) => {
        cy.wait(4000);
        cy.getProcessInstanceId(`${response.businessKey}`).then((processInstanceId) => {
          cy.checkTaskDisplayed(processInstanceId, `${response.businessKey}`);
        });
      });
    });
  });

  it('Should create a task with a payload contains RoRo Unaccompanied Freight from SBT', () => {
    cy.fixture('RoRo-Unaccompanied-Freight.json').then((task) => {
      cy.postTasks(task, 'AUTOTEST-RoRo-UNACC-SBT').then((response) => {
        cy.wait(4000);
        cy.getProcessInstanceId(`${response.businessKey}`).then((processInstanceId) => {
          cy.checkTaskDisplayed(processInstanceId, `${response.businessKey}`);
        });
      });
    });
  });

  it('Should create a task with a payload contains RoRo Unaccompanied Freight from RBT & SBT', () => {
    cy.fixture('RoRo-Unaccompanied-RBT-SBT.json').then((task) => {
      cy.postTasks(task, 'AUTOTEST-RoRo-UNACC-RBT-SBT').then((response) => {
        cy.wait(4000);
        cy.getProcessInstanceId(`${response.businessKey}`).then((processInstanceId) => {
          cy.checkTaskDisplayed(processInstanceId, `${response.businessKey}`);
        });
      });
    });
  });
});
