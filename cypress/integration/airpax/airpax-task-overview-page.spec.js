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
          cy.verifyAirPaxTaskListInfo(businessKey, 'Passenger').then((actualTaskSummary) => {
            expect(expectedTaskSumary).to.deep.equal(actualTaskSummary);
          });
        });
      });
    });
  });

  it('Should dismiss a task with a reason', () => {
    const reasons = [
      'Vessel arrived',
      'False rule match',
      'Resource redirected',
      'Other',
    ];

    const expectedActivity = 'task dismissed, reason: other reason for testing, note: This is for testing';

    const dateFormat = 'D MMM YYYY [at] HH:mm';
    let taskCreationDateTime = Cypress.dayjs().utc().format(dateFormat);

    cy.acceptPNRTerms();
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
          expect(response.statusCode).to.be.equal(200);
        });
        cy.checkAirPaxTaskDisplayed(businessKey);

        cy.claimAirPaxTask();

        cy.wait(2000);

        cy.contains('Dismiss').click();

        cy.get('div[id="reasonForDismissing"] .govuk-radios__item label').each((reason, index) => {
          cy.wrap(reason)
            .should('contain.text', reasons[index]).and('be.visible');
        });

        cy.contains('Cancel').click();

        cy.on('window:confirm', (str) => {
          expect(str).to.equal('Are you sure you want to cancel?');
        });

        cy.on('window:confirm', () => true);

        cy.get('.task-versions .task-versions--left').should('contain.text', taskCreationDateTime);

        cy.contains('Dismiss').click();

        cy.contains('Next').click();

        cy.get('span[id="reasonForDismissing-error"]').should('contain.text', 'You must indicate at least one reason for dismissing the task');

        cy.get('div[id="reasonForDismissing"] .govuk-radios__item')
          .contains('Other')
          .closest('div')
          .find('input')
          .click({ force: true });

        cy.get('input[name="otherReasonToDismiss"]').type('other reason for testing');

        cy.contains('Next').click();

        cy.waitForNoErrors();

        cy.get('textarea[id="addANote"]').type('This is for testing');

        cy.contains('Submit form').click();

        cy.verifySuccessfulSubmissionHeader('Task has been dismissed');

        cy.visit(`/airpax/tasks/${businessKey}`);
      });

      cy.getActivityLogs().then((activities) => {
        expect(activities).to.contain(expectedActivity);
        expect(activities).not.to.contain('Property delete changed from false to true');
      });
    });
  });

  it('Should dismiss a task with a reason and without notes', () => {
    const reasons = [
      'Vessel arrived',
      'False rule match',
      'Resource redirected',
      'Other',
    ];

    const expectedActivity = 'task dismissed, reason: false rule match';

    cy.acceptPNRTerms();
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
          expect(response.statusCode).to.be.equal(200);
        });
        cy.checkAirPaxTaskDisplayed(businessKey);

        cy.claimAirPaxTask();

        cy.wait(2000);

        cy.contains('Dismiss').click();

        cy.get('div[id="reasonForDismissing"] .govuk-radios__item label').each((reason, index) => {
          cy.wrap(reason)
            .should('contain.text', reasons[index]).and('be.visible');
        });

        cy.contains('Next').click();

        cy.get('span[id="reasonForDismissing-error"]').should('contain.text', 'You must indicate at least one reason for dismissing the task');

        cy.get('div[id="reasonForDismissing"] .govuk-radios__item')
          .contains('False rule match')
          .closest('div')
          .find('input')
          .click({ force: true });

        cy.contains('Next').click();

        cy.waitForNoErrors();

        cy.contains('Submit form').click();

        cy.verifySuccessfulSubmissionHeader('Task has been dismissed');

        cy.visit(`/airpax/tasks/${businessKey}`);
      });

      cy.getActivityLogs().then((activities) => {
        expect(activities).to.contain(expectedActivity);
        expect(activities).not.to.contain('Property delete changed from false to true');
      });
    });
  });

  it('Should verify task summary displays Crew', () => {
    cy.acceptPNRTerms();
    const taskName = 'AIRPAX';
    cy.fixture('airpax/taskSummaryExpected-Crew.json').as('expectedData');
    cy.fixture('airpax/task-airpax-Crew.json').then((task) => {
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
          cy.verifyAirPaxTaskListInfo(businessKey, 'Crew').then((actualTaskSummary) => {
            expect(expectedTaskSumary).to.deep.equal(actualTaskSummary);
          });
        });
        cy.checkAirPaxTaskDisplayed(businessKey);
        cy.contains('Crew');
      });
    });
  });

  it('Should display new label for new tasks on task details and not display new label when it is claimed', () => {
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
        cy.get('strong.hods-tag.govuk-tag.govuk-tag--newTarget').should('be.visible').and('have.text', 'new');
        cy.claimAirPaxTaskWithUserId(businessKey);
        cy.checkAirPaxTaskDisplayed(businessKey);
        cy.get('strong.hods-tag.govuk-tag.govuk-tag--newTarget').should('not.exist');
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

        cy.get('strong.hods-tag.govuk-tag.govuk-tag--newTarget').should('be.visible').and('have.text', 'new');
      });
    });
  });

  it('Should check rule matches details on task management page', () => {
    cy.acceptPNRTerms();
    const taskName = 'AUTO-TEST';
    const nextPage = 'a[data-test="next"]';
    cy.fixture('airpax/task-airpax-rules-with-diff-threat.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      cy.createAirPaxTask(task).then((taskResponse) => {
        expect(taskResponse.movement.id).to.contain(taskName);
        cy.wait(4000);
        let businessKey = taskResponse.id;
        cy.intercept('POST', '/v2/targeting-tasks/pages').as('airpaxTask');
        cy.visit('/airpax/tasks');
        cy.wait('@airpaxTask').then(({ response }) => {
          expect(response.statusCode).to.be.equal(200);
        });
        cy.checkAirPaxTaskDisplayed(businessKey);

        cy.wait(2000);

        cy.get('.govuk-caption-xl').invoke('text').as('taskName');

        // COP-9672 Display highest threat level in task details
        cy.get('.task-versions .govuk-accordion__section').each((element) => {
          cy.wrap(element).find('.task-versions--right .govuk-list li span.govuk-tag--positiveTarget').invoke('text').then((value) => {
            expect('Tier 1').to.be.equal(value);
          });
        });

        cy.contains('Back to task list').click();

        cy.reload();

        cy.wait('@airpaxTask').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });

        cy.get('body').then(($el) => {
          if ($el.find(nextPage).length > 0) {
            cy.findTaskInAllThePages(`${businessKey}`, null, {
              selector: 'Paid by cash1',
              risk: 'Class A Drugs and 2 other rules',
              riskTier: 'Tier 1',
            }).then((taskFound) => {
              expect(taskFound).to.equal(true);
            });
          } else {
            cy.findTaskInSinglePage(`${businessKey}`, null, {
              selector: 'Paid by cash1',
              risk: 'Class A Drugs and 2 other rules',
              riskTier: 'Tier 1',
            }).then((taskFound) => {
              expect(taskFound).to.equal(true);
            });
          }
        });
      });
    });
  });

  it('Should verify task overview page for a task from each tab loads successfully', () => {
    cy.acceptPNRTerms();
    cy.intercept('POST', '/v2/targeting-tasks/pages').as('taskList');
    const taskName = 'AIRPAX';
    cy.fixture('airpax/task-airpax.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      cy.createAirPaxTask(task).then((taskResponse) => {
        expect(taskResponse.movement.id).to.contain('AIRPAX');
        let businessKey = taskResponse.id;
        let movementId = taskResponse.movement.id;
        cy.wait(2000);
        cy.visit('/airpax/tasks');
        cy.wait('@taskList').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.get('.govuk-task-list-card').then(($taskListCard) => {
          if ($taskListCard.text().includes(businessKey)) {
            cy.get('.govuk-task-list-card').contains(businessKey).parents('.card-container').within(() => {
              cy.get('a.govuk-link')
                .should('have.attr', 'href', `/airpax/tasks/${businessKey}`)
                .click();
              cy.wait(2000);
            });
          }
        });
        cy.get('.govuk-caption-xl').should('have.text', businessKey);
        cy.claimAirPaxTask();
        cy.wait(2000);
        cy.visit('/airpax/tasks');
        cy.wait('@taskList').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.contains('In progress').click();
        cy.get('.govuk-task-list-card').then(($taskListCard) => {
          if ($taskListCard.text().includes(businessKey)) {
            cy.get('.govuk-task-list-card').contains(businessKey).parents('.card-container').within(() => {
              cy.get('a.govuk-link')
                .should('have.attr', 'href', `/airpax/tasks/${businessKey}`)
                .click();
              cy.wait(2000);
            });
          }
        });
        cy.get('.govuk-caption-xl').should('have.text', businessKey);
        cy.fixture('airpax/issue-task-airpax.json').then((issueTask) => {
          issueTask.id = businessKey;
          issueTask.movement.id = movementId;
          issueTask.form.submittedBy = Cypress.env('userName');
          cy.issueAirPaxTask(issueTask).then((issueTaskResponse) => {
            expect(issueTaskResponse.informationSheet.id).to.equals(businessKey);
            expect(issueTaskResponse.informationSheet.movement.id).to.equals(movementId);
            cy.wait(2000);
            cy.visit('/airpax/tasks');
            cy.wait('@taskList').then(({ response }) => {
              expect(response.statusCode).to.equal(200);
            });
            cy.contains('Issued').click();
            cy.get('.govuk-task-list-card').then(($taskListCard) => {
              if ($taskListCard.text().includes(businessKey)) {
                cy.get('.govuk-task-list-card').contains(businessKey).parents('.card-container').within(() => {
                  cy.get('a.govuk-link')
                    .should('have.attr', 'href', `/airpax/tasks/${businessKey}`)
                    .click();
                  cy.wait(2000)
                });
              }
            });
          });
        });
        cy.get('.govuk-caption-xl').should('have.text', businessKey);
        cy.fixture('airpax/dismiss-task-airpax.json').then((dismissTask) => {
          dismissTask.userId = Cypress.env('userName');
          console.log(dismissTask);
          cy.dismissAirPaxTask(dismissTask, businessKey).then((dismissTaskResponse) => {
            expect(dismissTaskResponse.id).to.equals(businessKey);
            expect(dismissTaskResponse.status).to.equals('COMPLETE');
            cy.wait(2000);
            cy.visit('/airpax/tasks');
            cy.wait('@taskList').then(({ response }) => {
              expect(response.statusCode).to.equal(200);
            });
            cy.contains('Complete').click();
            cy.get('.govuk-task-list-card').then(($taskListCard) => {
              if ($taskListCard.text().includes(businessKey)) {
                cy.get('.govuk-task-list-card').contains(businessKey).parents('.card-container').within(() => {
                  cy.get('a.govuk-link')
                    .should('have.attr', 'href', `/airpax/tasks/${businessKey}`)
                    .click();
                  cy.wait(2000);
                });
              }
            });
          });
        });
        cy.get('.govuk-caption-xl').should('have.text', businessKey);
      });
    });
  });

  after(() => {
    cy.contains('Sign out').click();
    cy.url().should('include', Cypress.env('auth_realm'));
  });
});
