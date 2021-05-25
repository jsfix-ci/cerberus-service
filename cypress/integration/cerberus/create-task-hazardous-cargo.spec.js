describe('Create task with a payload contains hazardous cargo without description', () => {
  beforeEach(() => {
    cy.login(Cypress.env('userName'));
  });

  it('Should create a task with a payload contains hazardous cargo without description', () => {
    cy.clock();
    cy.fixture('tasks-hazardous-cargo.json').then((task) => {
      cy.postTasks(task, 'CERB-AUTOTEST-HAZARDOUS').then((businessKey) => {
        cy.tick(60000);
        cy.findTaskInAllThePages(businessKey, null).then((taskFound) => {
          expect(taskFound).to.equal(true);
        });
      });
    });
  });
});
