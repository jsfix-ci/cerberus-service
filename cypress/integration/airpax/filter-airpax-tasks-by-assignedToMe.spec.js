describe('Filter airpax tasks by Assignee', () => {
  beforeEach(() => {
    cy.login(Cypress.env('userName'));
    cy.acceptPNRTerms();
  });

  it('Should filter tasks in progress by Assigned to me', () => {
    cy.intercept('POST', '/v2/targeting-tasks/pages').as('airpaxTask');
    const userId = Cypress.env('userName');
    const taskName = 'AIRPAX';
    cy.fixture('airpax/task-airpax.json').then((task) => {
      cy.createMovementId(task, taskName);
      cy.createTargetingApiTask(task).then((taskResponse) => {
        cy.wait(3000);
        let businessKey = taskResponse.id;
        cy.claimAirPaxTaskWithUsername(businessKey, userId);
        cy.wait(2000);
        cy.visit('/airpax/tasks');
        cy.get('a[href="#inProgress"]').click();
        cy.wait(2000);

        cy.get('.govuk-radios__item [value=\'ANY\']').should('be.checked');
        cy.get('.govuk-checkboxes__input').should('have.value', userId).check();
        cy.contains('Apply').click({ force: true });
        cy.wait('@airpaxTask').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });

        cy.get('.govuk-task-list-card').then(($taskListCard) => {
          cy.wait(2000);
          if ($taskListCard.text().includes(businessKey)) {
            cy.get('.govuk-task-list-card').contains(businessKey).parents('.card-container').within(() => {
              cy.get('.task-list--assignee').should('include.text', 'Assigned to you');
            });
          }
        });
      });
    });
  });

  after(() => {
    cy.contains('Sign out').click();
    cy.url().should('include', Cypress.env('auth_realm'));
  });
});
