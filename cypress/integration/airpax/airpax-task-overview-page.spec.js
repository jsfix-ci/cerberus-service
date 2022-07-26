import { formatVoyageText } from '../../../src/utils/stringConversion';

describe('AirPax Tasks overview Page - Should check All user journeys', () => {
  const departureTime = Cypress.dayjs().utc().valueOf();
  const arrivalTimeInPast = Cypress.dayjs().utc().subtract(1, 'day').valueOf();
  const arrivalTimeInFeature = Cypress.dayjs().utc().add(3, 'hour').valueOf();
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
      cy.createTargetingApiTask(task).then((taskResponse) => {
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
      cy.createTargetingApiTask(task).then((taskResponse) => {
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
      cy.createTargetingApiTask(task).then((taskResponse) => {
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

  it('Should dismiss a task with a reason', () => {
    const reasons = [
      'Arrived at port',
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
      cy.createTargetingApiTask(task).then((taskResponse) => {
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
      'Arrived at port',
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
      cy.createTargetingApiTask(task).then((taskResponse) => {
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
      cy.createTargetingApiTask(task).then((taskResponse) => {
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
      cy.createTargetingApiTask(task).then((taskResponse) => {
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
      cy.createTargetingApiTask(task).then((taskResponse) => {
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
              risk: 'Alcohol and 2 other rules',
              riskTier: 'Tier 1',
            }).then((taskFound) => {
              expect(taskFound).to.equal(true);
            });
          } else {
            cy.findTaskInSinglePage(`${businessKey}`, null, {
              selector: 'Paid by cash1',
              risk: 'Alcohol and 2 other rules',
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
      cy.createTargetingApiTask(task).then((taskResponse) => {
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
          cy.issueTarget(issueTask).then((issueTaskResponse) => {
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
                  cy.wait(2000);
                });
              }
            });
          });
        });
        cy.get('.govuk-caption-xl').should('have.text', businessKey);
        cy.fixture('dismiss-task.json').then((dismissTask) => {
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

  it('Should check AirPax task information with arrival details in the feature on task overview', () => {
    cy.acceptPNRTerms();
    const taskName = 'AUTO-TEST';
    cy.fixture('airpax/taskSummaryExpected.json').as('expectedData');
    cy.fixture('airpax/task-airpax.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      task.data.movement.voyage.voyage.scheduledDepartureTimestamp = departureTime;
      task.data.movement.voyage.voyage.scheduledArrivalTimestamp = arrivalTimeInFeature;
      cy.createTargetingApiTask(task).then((taskResponse) => {
        expect(taskResponse.movement.id).to.contain(taskName);
        cy.wait(5000);
        let businessKey = taskResponse.id;
        cy.intercept('POST', '/v2/targeting-tasks/pages').as('airpaxTask');
        cy.visit('/airpax/tasks');
        cy.wait('@airpaxTask').then(({ response }) => {
          expect(response.statusCode).to.be.equal(200);
        });
        cy.get('@expectedData').then((expectedTaskSumary) => {
          expectedTaskSumary.flightArrivalTime = formatVoyageText(arrivalTimeInFeature);
          expectedTaskSumary.arrivalDateTime = Cypress.dayjs(arrivalTimeInFeature).utc().format('D MMM YYYY [at] HH:mm');
          const departureDateTimeFormatted = Cypress.dayjs(departureTime).utc().format('D MMM YYYY [at] HH:mm');
          expectedTaskSumary.departureDateTime = `${task.data.movement.voyage.voyage.routeId}${departureDateTimeFormatted}`;
          cy.wait(2000);
          cy.verifyAirPaxTaskListInfo(businessKey, 'Passenger').then((actualTaskSummary) => {
            expect(expectedTaskSumary).to.deep.equal(actualTaskSummary);
          });
        });
      });
    });
  });

  it('Should check AirPax task information with arrival details in the past on task overview', () => {
    cy.acceptPNRTerms();
    const taskName = 'AUTO-TEST';
    cy.fixture('airpax/taskSummaryExpected.json').as('expectedData');
    cy.fixture('airpax/task-airpax.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      task.data.movement.voyage.voyage.scheduledDepartureTimestamp = departureTime;
      task.data.movement.voyage.voyage.scheduledArrivalTimestamp = arrivalTimeInPast;
      cy.createTargetingApiTask(task).then((taskResponse) => {
        expect(taskResponse.movement.id).to.contain(taskName);
        cy.wait(5000);
        let businessKey = taskResponse.id;
        cy.intercept('POST', '/v2/targeting-tasks/pages').as('airpaxTask');
        cy.visit('/airpax/tasks');
        cy.wait('@airpaxTask').then(({ response }) => {
          expect(response.statusCode).to.be.equal(200);
        });
        cy.get('@expectedData').then((expectedTaskSumary) => {
          expectedTaskSumary.flightArrivalTime = formatVoyageText(task.data.movement.voyage.voyage.scheduledArrivalTimestamp);
          expectedTaskSumary.arrivalDateTime = Cypress.dayjs(arrivalTimeInPast).utc().format('D MMM YYYY [at] HH:mm');
          const departureDateTimeFormatted = Cypress.dayjs(departureTime).utc().format('D MMM YYYY [at] HH:mm');
          expectedTaskSumary.departureDateTime = `${task.data.movement.voyage.voyage.routeId}${departureDateTimeFormatted}`;
          cy.wait(2000);
          cy.verifyAirPaxTaskListInfo(businessKey, 'Passenger').then((actualTaskSummary) => {
            expect(expectedTaskSumary).to.deep.equal(actualTaskSummary);
          });
        });
      });
    });
  });

  it('Should check notes are shown after correcting validation error', () => {
    const textNote = 'This is a test note';
    cy.acceptPNRTerms();
    const taskName = 'AIRPAX';
    cy.fixture('airpax/task-airpax.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      cy.createTargetingApiTask(task).then((response) => {
        expect(response.movement.id).to.contain('AIRPAX');
        cy.wait(4000);
        cy.checkAirPaxTaskDisplayed(`${response.id}`);
      });
    });
    cy.get('#note').should('not.exist');
    cy.claimAirPaxTask();
    cy.get('.govuk-label').invoke('text').then(($text) => {
      expect($text).to.equal('Add a new note');
    });
    cy.contains('Save').click();
    cy.wait(2000);
    cy.get('#error-summary').should('be.visible');
    cy.get('.govuk-list li a').should('have.text', 'Add a new note is required');
    cy.get('#note').should('be.visible').type(textNote);
    cy.contains('Save').click();
    cy.wait(2000);
    cy.get('p[class="govuk-body"]').invoke('text').as('taskActivity');
    cy.get('@taskActivity').then(($activityText) => {
      expect($activityText).includes(textNote);
    });
  });
  it('Should complete a task and validate it is moved to the Complete tab', () => {
    cy.acceptPNRTerms();
    cy.intercept('POST', '/v2/targeting-tasks/pages').as('taskList');
    const taskName = 'AIRPAX';
    const reason = 'Other reason Test01';
    cy.fixture('airpax/task-airpax.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      cy.createTargetingApiTask(task).then((taskResponse) => {
        expect(taskResponse.movement.id).to.contain('AIRPAX');
        let businessKey = taskResponse.id;
        cy.wait(4000);
        cy.checkAirPaxTaskDisplayed(businessKey);
        cy.claimAirPaxTask();
        cy.wait(2000);
        cy.contains('Assessment complete').click();
        cy.get('#reasonForCompletion-3').click();
        cy.get('.govuk-input').type(reason);
        cy.contains('Next').click();
        cy.contains('Submit form').click();
        cy.contains('Finish').click();
        cy.visit('/airpax/tasks');
        cy.contains('Complete').click();
        cy.wait('@taskList').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.get('.govuk-task-list-card').then(($taskListCard) => {
          if ($taskListCard.text().includes(businessKey)) {
            cy.get('.govuk-task-list-card').within(() => {
              cy.get('h4.task-heading').invoke('text').then((text) => {
                expect(text).includes(businessKey);
              });
            });
          }
        });
      });
    });
  });

  it('Should complete a task with a reason', () => {
    const reasonOptions = [
      'Credibility checks carried out no target required',
      'False SBT',
      'Arrived at port',
      'Other',
    ];
    const expectedActivity = 'task completed, reason: Other reason for testing, note: This is for testing';

    cy.acceptPNRTerms();
    cy.intercept('POST', 'v2/targeting-tasks/*/claim').as('claim');
    const taskName = 'AIRPAX';
    cy.fixture('airpax/task-airpax.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      cy.createTargetingApiTask(task).then((taskResponse) => {
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

        cy.contains('Assessment complete').click();

        cy.get('div[id="reasonForCompletion"] .govuk-radios__item label').each((reason, index) => {
          cy.wrap(reason)
            .should('contain.text', reasonOptions[index]).and('be.visible');
        });

        cy.get('#reasonForCompletion-3').click();
        cy.get('input[name="otherReasonForCompletion"]').type('Other reason for testing');

        cy.contains('Next').click();

        cy.waitForNoErrors();

        cy.get('textarea[id="addANote"]').type('This is for testing');

        cy.contains('Submit form').click();

        cy.verifySuccessfulSubmissionHeader('Task has been completed');
        cy.contains('Finish').click();
        cy.visit(`/airpax/tasks/${businessKey}`);
      });

      cy.getActivityLogs().then((activities) => {
        expect(activities).to.contain(expectedActivity);
        expect(activities).not.to.contain('Property delete changed from false to true');
      });
    });
  });

  it('Should validate Add notes section is hidden in Issue target, Assessment complete and Dismiss task', () => {
    cy.acceptPNRTerms();
    const taskName = 'AIRPAX';
    cy.fixture('airpax/task-airpax.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      cy.createTargetingApiTask(task).then((response) => {
        expect(response.movement.id).to.contain('AIRPAX');
        cy.wait(4000);
        cy.checkAirPaxTaskDisplayed(`${response.id}`);
      });
    });
    cy.get('#note').should('not.exist');
    cy.claimAirPaxTask();
    cy.get('.govuk-label').invoke('text').then(($text) => {
      expect($text).to.equal('Add a new note');
    });

    cy.contains('Issue target').click();
    cy.wait(2000);
    cy.get('#note').should('not.exist');
    cy.contains('Assessment complete').click();
    cy.wait(2000);
    cy.get('#note').should('not.exist');
    cy.contains('Cancel').click();
    cy.get('#note').should('exist');
    cy.contains('Dismiss').click();
    cy.wait(2000);
    cy.get('#note').should('not.exist');
    cy.contains('Cancel').click();
    cy.wait(2000);
    cy.get('#note').should('exist');
  });

  after(() => {
    cy.contains('Sign out').click();
    cy.url().should('include', Cypress.env('auth_realm'));
  });
});
