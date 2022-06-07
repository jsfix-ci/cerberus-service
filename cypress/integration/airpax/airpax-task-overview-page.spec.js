describe('AirPax Tasks overview Page - Should check All user journeys', () => {
  beforeEach(() => {
    cy.login(Cypress.env('userName'));
  });

  it('Should Claim and Unclaimed AirPax task', () => {
    cy.acceptPNRTerms();
    const nextPage = 'a[data-test="next"]';
    cy.intercept('POST', 'v2/targeting-tasks/*/claim').as('claim');
    const taskName = 'AIRPAX';
    cy.fixture('airpax/task-airpax.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      cy.createAirPaxTask(task).then((response) => {
        expect(response.movement.id).to.contain('AIRPAX');
        cy.wait(4000);
        let businessKey = response.id;
        cy.intercept('POST', '/v2/targeting-tasks/pages').as('airpaxTask');
        cy.visit('/airpax/tasks');
        cy.wait('@airpaxTask').then(({ pageResponse }) => {
          expect(pageResponse.statusCode).to.be.equal(200);
        });
        cy.log(Cypress.$(nextPage).length);
        cy.get('body').then(($el) => {
          if ($el.find(nextPage).length > 0) {
            cy.findTaskInAllThePages(`${businessKey}`, 'Claim', null).then((returnValue) => {
              expect(returnValue).to.equal(true);
              cy.wait('@claim').then(({ claimResponse }) => {
                expect(claimResponse.statusCode).to.equal(200);
              });
            });
          } else {
            cy.findTaskInSinglePage(`${businessKey}`, 'Claim', null).then((returnValue) => {
              expect(returnValue).to.equal(true);
              cy.wait('@claim').then(({ claimResponse }) => {
                expect(claimResponse.statusCode).to.equal(200);
              });
            });
          }
        });
      });
      cy.wait(2000);

      cy.get('.govuk-caption-xl').invoke('text').as('taskName');

      cy.contains('Back to task list').click();

      cy.get('a[href="#inProgress"]').click();

      cy.reload();

      cy.get('a[href="#inProgress"]').click();

      cy.get('@taskName').then((value) => {
        cy.intercept('POST', 'v2/targeting-tasks/*/unclaim').as('unclaim');
        cy.get('body').then(($el) => {
          if ($el.find(nextPage).length > 0) {
            cy.findTaskInAllThePages(value, 'Unclaim', null).then((returnValue) => {
              expect(returnValue).to.equal(true);
              cy.wait('@unclaim').then(({ unClaimResponse }) => {
                expect(unClaimResponse.statusCode).to.equal(200);
              });
            });
          } else {
            cy.findTaskInSinglePage(value, 'Unclaim', null).then((returnValue) => {
              expect(returnValue).to.equal(true);
              cy.wait('@unclaim').then(({ unClaimResponse }) => {
                expect(unClaimResponse.statusCode).to.equal(200);
              });
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
