import { find } from "lodash";

describe('Airpax task list page', () => {
  before(() => {
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

  it('Should verify /v2/targeting-tasks/pages returns with status code 200', () => {
    cy.visit('/airpax/tasks');
    cy.intercept('POST', '/v2/targeting-tasks/pages').as('taskList');
    cy.wait('@taskList').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
      cy.get('.card-container').should('be.visible');
    });
  });

  it('Should display departure status in task list page', () => {
    const statusInitials = ['CI', 'BP', 'DC', 'DE'];
    const status = ['CHECKED_IN', 'BOOKED_PASSENGER', 'DEPARTURE_CONFIRMED', 'DEPARTURE_EXCEPTION'];
    statusInitials.forEach(function (statusInitials, i) {
      cy.intercept('POST', '/v2/targeting-tasks/pages').as('taskList');
      const taskName = 'AIRPAX';
      cy.fixture('airpax/task-airpax.json').then((task) => {
        task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
        task.data.movement.serviceMovement.features.feats['STANDARDISED:lastReportedStatus'].value = statusInitials; 
        console.log(task);
          cy.createAirPaxTask(task).then((response) => {
            expect(response.movement.id).to.contain('AIRPAX');
           expect(response.movement.flight.departureStatus).to.contain(status[i]);
            console.log(response);
            let businessKey = response.id;
            cy.visit('/airpax/tasks');
            cy.wait(3000);
            cy.wait('@taskList').then(({ response }) => {
              expect(response.statusCode).to.equal(200);
            });
            cy.get('.govuk-task-list-card').each((item) => {
              cy.wrap(item).find('h4.task-heading').invoke('text').then((text) => {
                cy.log('task text', text);
                if (text.includes(businessKey)) {
                  cy.wrap(item).find('.hods-tag').invoke('text').then((text) => {
                    expect(text).to.equal(statusInitials)
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
      cy.createAirPaxTask(task).then((response) => {
        expect(response.movement.id).to.contain('AIRPAX');
        expect(response.movement.flight.departureStatus).to.eql(null);
        console.log(response);
        let businessKey = response.id;
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



  after(() => {
    cy.contains('Sign out').click();
    cy.url().should('include', Cypress.env('auth_realm'));
  });
});
