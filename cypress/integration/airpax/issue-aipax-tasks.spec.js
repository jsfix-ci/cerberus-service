describe('Create AirPax task and issue target', () => {
  beforeEach(() => {
    cy.login(Cypress.env('userName'));
    cy.acceptPNRTerms();
  });

  it('Should verify filter targets by Assignee', () => {
    const userId = Cypress.env('userName');
    const taskName = 'AIRPAX';
    cy.fixture('airpax/task-airpax.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      cy.createTargetingApiTask(task).then((taskResponse) => {
        cy.wait(3000);
        let businessKey = taskResponse.id;
        let movementId = taskResponse.movement.id;
        cy.claimAirPaxTaskWithUserId(`${taskResponse.id}`, userId);
        cy.wait(2000);
        cy.fixture('airpax/issue-task-airpax.json').then((issueTask) => {
          issueTask.id = businessKey;
          issueTask.movement.id = movementId;
          issueTask.form.submittedBy = userId;
          cy.issueTarget(issueTask).then((issueTaskResponse) => {
            expect(issueTaskResponse.informationSheet.id).to.equals(businessKey);
            expect(issueTaskResponse.informationSheet.movement.id).to.equals(movementId);
            cy.wait(2000);
            cy.acknowledgeTarget(userId, businessKey);
            cy.wait(2000);
            cy.claimTarget(userId, businessKey);
            cy.fixture('airpax/filterTargetPage.json').then((filter) => {
              filter.filterParams.assignees[0] = userId;
              cy.filterPageByAssignee(filter).then((filterResponse) => {
                expect(filterResponse[0].assignee).to.eql(userId);
              });
            });
          });
        });
      });
    });
  });

  it('Should verify filter target journeys by Assignee', () => {
    const userId = Cypress.env('userName');
    const taskName = 'AIRPAX';
    cy.fixture('airpax/task-airpax.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      cy.createTargetingApiTask(task).then((taskResponse) => {
        cy.wait(3000);
        let businessKey = taskResponse.id;
        let movementId = taskResponse.movement.id;
        cy.claimAirPaxTaskWithUserId(`${taskResponse.id}`, userId);
        cy.wait(2000);
        cy.fixture('airpax/issue-task-airpax.json').then((issueTask) => {
          issueTask.id = businessKey;
          issueTask.movement.id = movementId;
          issueTask.form.submittedBy = userId;
          cy.issueTarget(issueTask).then((issueTaskResponse) => {
            expect(issueTaskResponse.informationSheet.id).to.equals(businessKey);
            expect(issueTaskResponse.informationSheet.movement.id).to.equals(movementId);
            cy.wait(2000);
            cy.acknowledgeTarget(userId, businessKey);
            cy.wait(2000);
            cy.claimTarget(userId, businessKey);
            cy.fixture('airpax/filterTargetPage.json').then((filter) => {
              filter.filterParams.assignees[0] = userId;
              cy.filterJourneysByAssignee(filter).then((filterResponse) => {
                expect(filterResponse[0].targets[0].assignee).to.eql(userId);
              });
            });
          });
        });
      });
    });
  });

  it('Should submit a target successfully from a AirPax task', () => {
    const taskName = 'AIRPAX';
    cy.fixture('airpax/task-airpax.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      cy.createTargetingApiTask(task).then((response) => {
        cy.wait(3000);
        cy.checkAirPaxTaskDisplayed(`${response.id}`);
        cy.claimAirPaxTask();
        cy.contains('Issue target').click();
        cy.wait(2000);
        cy.fixture('airpax/issue-task-airpax.json').then((targetData) => {
          // Update Issuing Hub details
          cy.clickChangeInTIS('Issuing hub');
          cy.get('#issuingHub').type(targetData.issuingHub.name);
          cy.get('#issuingHub__option--0').contains(targetData.issuingHub.name).click();
          cy.get('#eventPort').type(targetData.eventPort.name);
          cy.get('#eventPort__option--0').contains((targetData.eventPort.name)).click();
          cy.contains('Continue').click();
          // Update Co-traveller details
          cy.get('.govuk-summary-list__row').should('have.class', 'govuk-summary-list__title').next().contains('Given name')
            .siblings('.govuk-summary-list__actions')
            .within(() => {
              cy.get('.govuk-link').contains('Change').click();
              cy.wait(2000);
            });
          cy.get('input[name="seatNumber"]').type('34B');
          cy.get('#bagCount').type('1');
          cy.get('#weight').type(targetData.movement.baggage.weight);
          cy.get('#tags').type(targetData.movement.baggage.tags);
          cy.contains('Continue').click();

          // Add Selection Details
          cy.clickChangeInTIS('Targeting indicators');
          cy.get('.hods-multi-select-autocomplete__placeholder').type('Paid by cash');
          cy.get('.hods-multi-select-autocomplete__menu').contains('Paid by cash').click();
          cy.get('#category').type(targetData.risks.selector.category);
          cy.contains('Continue').click();

          // Add Nominal Details
          cy.clickChangeInTIS('Nominal type');
          cy.get('.hods-autocomplete__input').type(targetData.nominalChecks[0].type);
          cy.get('.hods-autocomplete__option').contains('Account').click();
          cy.get('.hods-multi-select-autocomplete__placeholder').type(targetData.nominalChecks[0].checks[0].name);
          cy.get('.hods-multi-select-autocomplete__menu').contains(targetData.nominalChecks[0].checks[0].name).click();
          cy.contains('Continue').click();

          // Select team to receive target
          cy.clickChangeInTIS('Select the team that should receive the target');
          cy.get('.hods-autocomplete__input').type(targetData.teamToReceiveTheTarget.displayname);
          cy.get('.hods-autocomplete__option').contains(targetData.teamToReceiveTheTarget.displayname).click();
          cy.contains('Continue').click();
          cy.contains('Accept and send').click();
          cy.contains('Finish').click();
        });
      });
    });
  });

  it('Should not be able to submit a target successfully from a AirPax task due to mandatory field error validation', () => {
    let errorNames = [
      'Issuing hub is required',
      'Port is required',
      'Seat number is required',
      'Number of bags is required',
      'Baggage weight (kg) is required',
      'Tag details is required',
      'Targeting indicators is required',
      'Nominal type is required',
      'System checks completed is required',
      'Select the team that should receive the target is required'
    ];
    let expectedErrorNames = [];
    const taskName = 'AIRPAX';
    cy.fixture('airpax/task-airpax.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      cy.createTargetingApiTask(task).then((response) => {
        cy.wait(3000);
        cy.checkAirPaxTaskDisplayed(`${response.id}`);
        cy.claimAirPaxTask();
        cy.contains('Issue target').click();
        cy.wait(2000);
        cy.contains('Accept and send').click();
        cy.get('.govuk-error-summary').should('be.visible').within(() => {
          cy.get('.govuk-error-summary__title').should('have.text', 'There is a problem');
          cy.get('.govuk-error-summary__list li a').each((element) => {
            cy.wrap(element).invoke('text').then((value) => {
              expectedErrorNames.push(value);
            });
          }).then(() => {
            expect(expectedErrorNames).to.deep.equal(errorNames);
          });
        })
      });
    });
  });

  after(() => {
    cy.contains('Sign out').click();
    cy.url().should('include', Cypress.env('auth_realm'));
  });
});
