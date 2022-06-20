describe('Airpax task list page', () => {
  beforeEach(() => {
    cy.login(Cypress.env('userName'));
    cy.acceptPNRTerms();
  });
  it('Should verify task container list for airpax/tasks', () => {
    cy.visit('/airpax/tasks');
    const taskNavigationItems = [
      'New',
      'In progress',
      'Issued',
      'Complete'];
    cy.get('.govuk-heading-xl').invoke('text').then((Heading) => {
      expect(Heading).to.equal('Task management');
    });
    cy.get('.govuk-tabs__list li a').each((navigationItem, index) => {
      cy.wrap(navigationItem).click()
        .should('contain.text', taskNavigationItems[index]).and('be.visible');
    });
  });

  it('Should verify filter by mode and Link to Roro is displayed', () => {
    const airpaxModes = 'AIR_PASSENGER';
    cy.intercept('POST', '/v2/targeting-tasks/pages').as('airpaxTaskList');
    cy.visit('/airpax/tasks');
    cy.wait('@airpaxTaskList').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
      cy.get('.govuk-heading-xl').invoke('text').then((Heading) => {
        expect(Heading).to.contain('AirPax');
      });
      cy.get('#mode').should('be.visible')
        .select([0])
        .invoke('val')
        .should('deep.equal', airpaxModes);
      cy.get('.roro-task-link')
        .should('have.attr', 'href').and('include', 'task').then((href) => {
          cy.intercept('POST', 'camunda/v1/targeting-tasks/pages').as('roroTaskList');
          cy.visit(href);
          cy.wait('@roroTaskList').then(({ roroResponse }) => {
            expect(roroResponse.statusCode).to.equal(200);
            cy.get('.govuk-heading-xl').invoke('text').then((Heading) => {
              expect(Heading).to.contain('RoRo');
            });
          });
        });
    });
  });

  it('Should verify /v2/targeting-tasks/pages returns with status code 200', () => {
    cy.intercept('POST', '/v2/targeting-tasks/pages').as('taskList');
    cy.visit('/airpax/tasks');
    cy.wait('@taskList').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
      cy.get('.card-container').should('be.visible');
    });
  });

  it('Should display departure status in task list page', () => {
    const statusInitials = ['CI', 'BP', 'DC'];
    const status = ['CHECKED_IN', 'BOOKED_PASSENGER', 'DEPARTURE_CONFIRMED'];
    statusInitials.forEach((statusInitial, i) => {
      cy.intercept('POST', '/v2/targeting-tasks/pages').as('taskList');
      const taskName = 'AIRPAX';
      cy.fixture('airpax/task-airpax.json').then((task) => {
        task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
        task.data.movement.serviceMovement.features.feats['STANDARDISED:lastReportedStatus'].value = statusInitial;
        console.log(task);
        cy.createAirPaxTask(task).then((taskResponse) => {
          expect(taskResponse.movement.id).to.contain('AIRPAX');
          expect(taskResponse.movement.flight.departureStatus).to.contain(status[i]);
          console.log(taskResponse);
          let businessKey = taskResponse.id;
          cy.visit('/airpax/tasks');
          cy.wait(3000);
          cy.wait('@taskList').then(({ response }) => {
            expect(response.statusCode).to.equal(200);
          });
          cy.get('.govuk-task-list-card').each((item) => {
            cy.wrap(item).find('h4.task-heading').invoke('text').then((text) => {
              cy.log('task text', text);
              if (text.includes(businessKey)) {
                cy.wrap(item).find('.hods-tag').invoke('text').then((statusText) => {
                  expect(statusText).to.equal(statusInitial);
                });
              }
            });
          });
        });
      });
    });
  });

  it('Should not display departure status in task list page if departure status is null', () => {
    cy.intercept('POST', '/v2/targeting-tasks/pages').as('taskList');
    const taskName = 'AIRPAX';
    cy.fixture('airpax/task-airpax.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      task.data.movement.serviceMovement.features.feats['STANDARDISED:lastReportedStatus'].value = null;
      console.log(task);
      cy.createAirPaxTask(task).then((taskResponse) => {
        expect(taskResponse.movement.id).to.contain('AIRPAX');
        expect(taskResponse.movement.flight.departureStatus).to.eql(null);
        console.log(taskResponse);
        let businessKey = taskResponse.id;
        cy.visit('/airpax/tasks');
        cy.wait(3000);
        cy.wait('@taskList').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.get('.govuk-task-list-card').each((item) => {
          cy.wrap(item).find('h4.task-heading').invoke('text').then((text) => {
            cy.log('task text', text);
            if (text.includes(businessKey)) {
              cy.wrap(item).find('.hods-tag').should('not.exist');
            }
          });
        });
      });
    });
  });

  it('Should display task Id on each task card', () => {
    cy.intercept('POST', '/v2/targeting-tasks/pages').as('taskList');
    const taskName = 'AIRPAX';
    cy.fixture('airpax/task-airpax.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      cy.createAirPaxTask(task).then((taskResponse) => {
        expect(taskResponse.movement.id).to.contain('AIRPAX');
        let businessKey = taskResponse.id;
        cy.wait(3000);
        cy.visit('/airpax/tasks');
        cy.wait('@taskList').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.get('.govuk-task-list-card').find('h4.task-heading')
          .should('be.visible')
          .invoke('text')
          .then((text) => {
            expect(text).to.include(businessKey);
          });
      });
    });
  });

  it('Should not display UPDATED label on a new task, but display UPDATED after a task has been updated with new details', () => {
    cy.intercept('POST', '/v2/targeting-tasks/pages').as('taskList');
    const taskName = 'AIRPAX';
    cy.fixture('airpax/task-airpax-no-selectors.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      cy.createAirPaxTask(task).then((taskResponse) => {
        expect(taskResponse.movement.id).to.contain('AIRPAX');
        console.log(taskResponse);
        let businessKey = taskResponse.id;
        let movementId = taskResponse.movement.id;
        cy.wait(3000);
        cy.visit('/airpax/tasks');
        cy.wait('@taskList').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.get('.govuk-task-list-card').then(($taskListCard) => {
          if ($taskListCard.text().includes(businessKey)) {
            cy.get('.govuk-task-list-card').contains(businessKey).parents('.card-container').within(() => {
              cy.get('p.govuk-tag--updatedTarget').should('not.exist');
            });
          }
        });
        cy.fixture('airpax/task-airpax.json').then((updateTask) => {
          updateTask.data.movementId = movementId;
          cy.createAirPaxTask(updateTask).then((updateResponse) => {
            expect(updateResponse.movement.id).to.contain(movementId);
            expect(updateResponse.id).to.equal(businessKey);
            cy.reload();
            cy.wait('@taskList').then(({ response }) => {
              expect(response.statusCode).to.equal(200);
            });
            cy.get('.govuk-task-list-card').then(($taskListCard) => {
              if ($taskListCard.text().includes(businessKey)) {
                cy.get('.govuk-task-list-card').contains(businessKey).parents('.card-container').within(() => {
                  cy.get('p.govuk-tag--updatedTarget').invoke('text').then((text) => {
                    expect(text).to.equal('Updated');
                  });
                });
              }
            });
          });
        });
      });
    });
  });

  it('Should not display RELISTED label on a new task, but display RELISTED after a task has been relisted with new details', () => {
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
              cy.get('p.govuk-tag--relistedTarget').should('not.exist');
            });
          }
        });
        cy.checkAirPaxTaskDisplayed(businessKey);
        cy.claimAirPaxTask();
        cy.wait(2000);
        cy.contains('Dismiss').click();
        cy.get('#reasonForDismissing-3').click();
        cy.get('#otherReasonToDismiss').type('None');
        cy.contains('Next').click();
        cy.contains('Submit form').click();
        cy.contains('Finish').click();
        cy.fixture('airpax/task-airpax-same-group-reference-selectors.json').then((updateTask) => {
          updateTask.data.movementId = movementId;
          cy.createAirPaxTask(updateTask).then((updateResponse) => {
            expect(updateResponse.movement.id).to.contain(movementId);
            expect(updateResponse.id).to.equal(businessKey);
            cy.wait(2000);
            cy.fixture('airpax/task-airpax-latest.json').then((relistedTask) => {
              relistedTask.data.movementId = movementId;
              cy.createAirPaxTask(relistedTask).then((relistedResponse) => {
                expect(relistedResponse.movement.id).to.contain(movementId);
                expect(relistedResponse.id).to.equal(businessKey);
                cy.visit('/airpax/tasks');
                cy.wait(3000);
                cy.wait('@taskList').then(({ response }) => {
                  expect(response.statusCode).to.equal(200);
                });
                cy.get('.govuk-task-list-card').then(($taskListCard) => {
                  if ($taskListCard.text().includes(businessKey)) {
                    cy.get('.govuk-task-list-card').contains(businessKey).parents('.card-container').within(() => {
                      cy.get('p.govuk-tag--relistedTarget').invoke('text').then((text) => {
                        expect(text).to.equal('Relisted');
                      });
                    });
                  }
                });
              });
            });
          });
        });
      });
    });
  });

  afterEach(() => {
    cy.contains('Sign out').click();
    cy.url().should('include', Cypress.env('auth_realm'));
  });
});
