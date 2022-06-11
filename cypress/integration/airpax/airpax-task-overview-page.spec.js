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
      cy.createAirPaxTask(task).then((taskResponse) => {
        expect(taskResponse.movement.id).to.contain('AIRPAX');
        cy.wait(4000);
        let businessKey = taskResponse.id;
        cy.intercept('POST', '/v2/targeting-tasks/pages').as('airpaxTask');
        cy.visit('/airpax/tasks');
        cy.wait('@airpaxTask').then(({ response }) => {
          console.log(response);
          expect(response.statusCode).to.be.equal(200);
        });
        cy.log(Cypress.$(nextPage).length);
        cy.get('body').then(($el) => {
          if ($el.find(nextPage).length > 0) {
            cy.findTaskInAllThePages(`${businessKey}`, 'Claim', null).then((returnValue) => {
              expect(returnValue).to.equal(true);
              cy.wait('@claim').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
              });
            });
          } else {
            cy.findTaskInSinglePage(`${businessKey}`, 'Claim', null).then((returnValue) => {
              expect(returnValue).to.equal(true);
              cy.wait('@claim').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
              });
            });
          }
        });
        cy.wait(2000);

        cy.get('.govuk-caption-xl').invoke('text').as('taskName');

        cy.get('p.govuk-body').eq(0).should('contain.text', 'Assigned to you');

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
                cy.wait('@unclaim').then(({ response }) => {
                  expect(response.statusCode).to.equal(200);
                });
              });
            } else {
              cy.findTaskInSinglePage(value, 'Unclaim', null).then((returnValue) => {
                expect(returnValue).to.equal(true);
                cy.wait('@unclaim').then(({ response }) => {
                  expect(response.statusCode).to.equal(200);
                });
              });
            }
          });
        });
        cy.checkAirPaxTaskDisplayed(`${taskResponse.id}`);
        cy.get('p.govuk-body').eq(0).should('contain.text', 'Task not assigned');
      });
    });
  });

  it('Should Unclaim a task assigned to me Successfully from In Progress tab and verify it moved to New tab', () => {
    cy.acceptPNRTerms();
    cy.intercept('POST', 'v2/targeting-tasks/*/claim').as('claim');
    cy.intercept('POST', 'v2/targeting-tasks/*/unclaim').as('unclaim');
    const nextPage = 'a[data-test="next"]';
    const taskName = 'AIRPAX';
    cy.fixture('airpax/task-airpax.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      cy.createAirPaxTask(task).then((taskResponse) => {
        expect(taskResponse.movement.id).to.contain('AIRPAX');
        cy.wait(4000);
        let businessKey = taskResponse.id;
        cy.intercept('POST', '/v2/targeting-tasks/pages').as('airpaxTask');
        cy.visit('/airpax/tasks');
        cy.wait('@airpaxTask').then(({ response }) => {
          expect(response.statusCode).to.be.equal(200);
        });
        cy.checkAirPaxTaskDisplayed(businessKey);

        cy.claimAirPaxTask();

        cy.get('.govuk-caption-xl').invoke('text').as('taskName');

        cy.wait(2000);

        cy.get('button.link-button').should('be.visible').and('have.text', 'Unclaim task').click();

        cy.wait('@unclaim').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });

        cy.wait(2000);

        cy.url().should('contain', '/tasks?tab=new');

        cy.get('body').then(($el) => {
          if ($el.find(nextPage).length > 0) {
            cy.findTaskInAllThePages(`${businessKey}`, null, null).then((returnValue) => {
              expect(returnValue).to.equal(true);
            });
          } else {
            cy.findTaskInSinglePage(`${businessKey}`, null, null).then((returnValue) => {
              expect(returnValue).to.equal(true);
            });
          }
        });
      });
    });
  });

  it('Should Unclaim a task assigned to another user Successfully verify it moved to New tab', () => {
    cy.acceptPNRTerms();
    cy.intercept('POST', 'v2/targeting-tasks/*/claim').as('claim');
    cy.intercept('POST', 'v2/targeting-tasks/*/unclaim').as('unclaim');
    const nextPage = 'a[data-test="next"]';
    const taskName = 'AIRPAX';
    cy.fixture('airpax/task-airpax.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      cy.createAirPaxTask(task).then((taskResponse) => {
        expect(taskResponse.movement.id).to.contain('AIRPAX');
        cy.wait(4000);
        let businessKey = taskResponse.id;
        cy.intercept('POST', '/v2/targeting-tasks/pages').as('airpaxTask');
        cy.visit('/airpax/tasks');
        cy.wait('@airpaxTask').then(({ response }) => {
          expect(response.statusCode).to.be.equal(200);
        });

        cy.claimAirPaxTaskWithUserId(businessKey);

        cy.checkAirPaxTaskDisplayed(businessKey);

        cy.get('.govuk-caption-xl').invoke('text').as('taskName');

        cy.wait(2000);

        cy.get('button.link-button').should('be.visible').and('have.text', 'Unclaim task').click();

        cy.wait('@unclaim').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });

        cy.wait(2000);

        cy.url().should('contain', '/tasks?tab=new');

        cy.get('body').then(($el) => {
          if ($el.find(nextPage).length > 0) {
            cy.findTaskInAllThePages(`${businessKey}`, null, null).then((returnValue) => {
              expect(returnValue).to.equal(true);
            });
          } else {
            cy.findTaskInSinglePage(`${businessKey}`, null, null).then((returnValue) => {
              expect(returnValue).to.equal(true);
            });
          }
        });

        cy.checkAirPaxTaskDisplayed(businessKey);

        cy.get('button.link-button').should('be.visible').and('have.text', 'Claim');
      });
    });
  });

  it('Should check AirPax task information on task overview', () => {
    cy.acceptPNRTerms();
    const taskName = 'AIRPAX';
    cy.fixture('airpax/taskSummaryExpected.json').as('expectedData');
    cy.fixture('airpax/task-airpax.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      cy.createAirPaxTask(task).then((taskResponse) => {
        expect(taskResponse.movement.id).to.contain('AIRPAX');
        cy.wait(4000);
        let businessKey = taskResponse.id;
        cy.intercept('POST', '/v2/targeting-tasks/pages').as('airpaxTask');
        cy.visit('/airpax/tasks');
        cy.wait('@airpaxTask').then(({ response }) => {
          expect(response.statusCode).to.be.equal(200);
        });
        cy.get('@expectedData').then((expectedTaskSumary) => {
          cy.verifyAirPaxTaskListInfo(businessKey).then((actualTaskSummary) => {
            expect(expectedTaskSumary).to.deep.equal(actualTaskSummary);
          });
        });
      });
    });
  });

  after(() => {
    cy.contains('Sign out').click();
    cy.url().should('include', Cypress.env('auth_realm'));
  });
});
