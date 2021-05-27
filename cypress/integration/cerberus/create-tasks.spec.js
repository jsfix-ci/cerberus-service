describe('Create task with different payload from Cerberus', () => {
  beforeEach(() => {
    cy.login(Cypress.env('userName'));
  });

  it('Should create a task with a payload contains hazardous cargo without description', () => {
    cy.clock();
    cy.fixture('tasks-hazardous-cargo.json').then((task) => {
      cy.postTasks(task, 'AUTOTEST-HAZARDOUS').then((businessKey) => {
        cy.get('a[href="#new"]').click();
        cy.tick(65000);
        cy.findTaskInAllThePages(businessKey, null).then((taskFound) => {
          expect(taskFound).to.equal(true);
        });
      });
    });
  });

  it('Should create a task with a payload contains RoRo Tourist', () => {
    cy.clock();
    cy.fixture('RoRo-Tourist.json').then((task) => {
      cy.postTasks(task, 'AUTOTEST-TOURIST').then((businessKey) => {
        cy.get('a[href="#new"]').click();
        cy.tick(65000);
        cy.findTaskInAllThePages(businessKey, null).then((taskFound) => {
          expect(taskFound).to.equal(true);
        });
      });
    });
  });

  it('Should create a task with a payload contains RoRo Tourist from RBT & SBT', () => {
    cy.clock();
    cy.fixture('RoRo-Tourist-RBT-SBT.json').then((task) => {
      cy.postTasks(task, 'AUTOTEST-TOURIST-RBT-SBT').then((businessKey) => {
        cy.get('a[href="#new"]').click();
        cy.tick(65000);
        cy.findTaskInAllThePages(businessKey, null).then((taskFound) => {
          expect(taskFound).to.equal(true);
        });
      });
    });
  });

  it('Should create a task with a payload contains RoRo Tourist from SBT', () => {
    cy.clock();
    cy.fixture('RoRo-Tourist-SBT.json').then((task) => {
      cy.postTasks(task, 'AUTOTEST-TOURIST-SBT').then((businessKey) => {
        cy.get('a[href="#new"]').click();
        cy.tick(65000);
        cy.findTaskInAllThePages(businessKey, null).then((taskFound) => {
          expect(taskFound).to.equal(true);
        });
      });
    });
  });

  it('Should create a task with a payload contains RoRo Accompanied Freight', () => {
    cy.clock();
    cy.fixture('RoRo-Accompanied-Freight.json').then((task) => {
      cy.postTasks(task, 'AUTOTEST-RoRo-ACC').then((businessKey) => {
        cy.get('a[href="#new"]').click();
        cy.tick(65000);
        cy.findTaskInAllThePages(businessKey, null).then((taskFound) => {
          expect(taskFound).to.equal(true);
        });
      });
    });
  });

  it('Should create a task with a payload contains RoRo Accompanied Freight from RBT & SBT', () => {
    cy.clock();
    cy.fixture('RoRo-Accompanied-RBT-SBT.json').then((task) => {
      cy.postTasks(task, 'AUTOTEST-RoRo-ACC-RBT-SBT').then((businessKey) => {
        cy.get('a[href="#new"]').click();
        cy.tick(65000);
        cy.findTaskInAllThePages(businessKey, null).then((taskFound) => {
          expect(taskFound).to.equal(true);
        });
      });
    });
  });

  it('Should create a task with a payload contains RoRo Accompanied Freight from SBT', () => {
    cy.clock();
    cy.fixture('RoRo-Accompanied-SBT.json').then((task) => {
      cy.postTasks(task, 'AUTOTEST-RoRo-ACC-SBT').then((businessKey) => {
        cy.get('a[href="#new"]').click();
        cy.tick(65000);
        cy.findTaskInAllThePages(businessKey, null).then((taskFound) => {
          expect(taskFound).to.equal(true);
        });
      });
    });
  });

  it('Should create a task with a payload contains RoRo Unaccompanied Freight from SBT', () => {
    cy.clock();
    cy.fixture('RoRo-Unaccompanied-Freight.json').then((task) => {
      cy.postTasks(task, 'AUTOTEST-RoRo-UNACC-SBT').then((businessKey) => {
        cy.get('a[href="#new"]').click();
        cy.tick(65000);
        cy.findTaskInAllThePages(businessKey, null).then((taskFound) => {
          expect(taskFound).to.equal(true);
        });
      });
    });
  });

  it('Should create a task with a payload contains RoRo Unaccompanied Freight from RBT & SBT', () => {
    cy.clock();
    cy.fixture('RoRo-Unaccompanied-RBT-SBT.json').then((task) => {
      cy.postTasks(task, 'AUTOTEST-RoRo-UNACC-RBT-SBT').then((businessKey) => {
        cy.get('a[href="#new"]').click();
        cy.tick(65000);
        cy.findTaskInAllThePages(businessKey, null).then((taskFound) => {
          expect(taskFound).to.equal(true);
        });
      });
    });
  });
});
