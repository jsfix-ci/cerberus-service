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

          // Update Movement Details
          cy.clickChangeInTIS('Inbound or outbound');
          cy.get('input[value="OUTBOUND"]').check();
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
          cy.get('input[class="hods-multi-select-autocomplete__input"]').type('Paid by cash');
          cy.get('.hods-multi-select-autocomplete__menu').contains('Paid by cash').click();
          cy.get('#category').type(targetData.risks.selector.category);
          cy.contains('Continue').click();

          // Add Nominal Details
          cy.contains('h2', 'Checks completed on nominals').next().within(() => {
            cy.get('dt.govuk-summary-list__key').invoke('text').then((text) => {
              expect(text).to.equal('Nothing entered (optional)');
            });
            cy.get('dd.govuk-summary-list__actions').within(() => {
              cy.get('.govuk-link').contains('Change').click();
              cy.wait(2000);
            });
          });
          cy.contains('Add another nominal').should('be.visible').click();
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
      'Select the team that should receive the target is required'];

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
        });
      });
    });
  });

  it('Should verify target indicator details are displayed correctly when auto-populated', () => {
    const taskName = 'AIRPAX';
    cy.fixture('airpax/task-airpax.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      cy.createTargetingApiTask(task).then((response) => {
        cy.wait(3000);
        cy.checkAirPaxTaskDisplayed(`${response.id}`);
        cy.claimAirPaxTask();
        cy.contains('Issue target').click();
        cy.wait(3000);
        cy.fixture('airpax/airpax-TIS-details.json').then((expectedDetails) => {
          let targetIndicator = expectedDetails.SelectionDetails[1]['Targeting indicators'];
          cy.contains('h2', 'Selection details').next().within((elements) => {
            cy.getairPaxTISDetails(elements).then((actualMovementDetails) => {
              expect(actualMovementDetails).to.deep.equal(expectedDetails.SelectionDetails);
            });
          });
          cy.clickChangeInTIS('Targeting indicators');
          cy.get('.govuk-form-group').within(() => {
            cy.get('.hods-multi-select-autocomplete__value-container .hods-multi-select-autocomplete__multi-value__label')
              .should('have.text', targetIndicator);
            cy.get('.hods-multi-select-autocomplete__input').type('Paid by cash');
            cy.get('.hods-multi-select-autocomplete__menu').contains('Paid by cash').click();
            cy.get('.hods-multi-select-autocomplete__value-container .hods-multi-select-autocomplete__multi-value__label')
              .should('include.text', 'Paid by cash');
          });
        });
        cy.contains('Continue').click();
        cy.wait(2000);
        cy.get('.govuk-summary-list__row')
          .contains('Targeting indicators')
          .siblings('.govuk-summary-list__value')
          .should('include.text', 'Paid by cash');
      });
    });
  });

  it.only('Should verify capability to Add or Remove items from collections', () => {
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
          cy.get('.govuk-summary-list__row').should('have.class', 'govuk-summary-list__title').next().contains('Given name')
            .siblings('.govuk-summary-list__actions')
            .within(() => {
              cy.get('.govuk-link').contains('Change').click();
              cy.wait(2000);
            });
          cy.contains('Add another passenger').should('be.visible');
          cy.contains('Remove').should('be.visible').click({ force: true });
          cy.contains('Continue').click();

          cy.contains('h2', 'Other passenger details').next().within(() => {
            cy.get('dt.govuk-summary-list__key').invoke('text').then((text) => {
              expect(text).to.equal('Nothing entered (optional)');
            });
            cy.get('dd.govuk-summary-list__actions').within(() => {
              cy.get('.govuk-link').contains('Change').click();
              cy.wait(2000);
            });
          });
          // Add Co-Passenger Details
          cy.contains('Add another passenger').click();
          cy.get('input[name="first"]').type(targetData.movement.otherPersons[0].name.first);
          cy.get('input[name="last"]').type(targetData.movement.otherPersons[0].name.last);
          cy.get('input[aria-owns="otherPersons[0].nationality__listbox"]').type(targetData.movement.otherPersons[0].nationality.nationality);
          cy.get('.hods-autocomplete__option').contains(targetData.movement.otherPersons[0].nationality.nationality).click();
          cy.get('input[aria-owns="otherPersons[0].sex__listbox"]').type(targetData.movement.otherPersons[0].gender.name);
          cy.get('.hods-autocomplete__option').contains(targetData.movement.otherPersons[0].gender.name).click();
          cy.get('#type').type(targetData.movement.otherPersons[0].document.type.shortdescription);
          cy.get('.hods-autocomplete__option').contains(targetData.movement.otherPersons[0].document.type.shortdescription).click();
          cy.get('input[name="seatNumber"]').type('34B');
          cy.get('#bagCount').type('1');
          cy.get('#weight').type(targetData.movement.baggage.weight);
          cy.get('#tags').type(targetData.movement.baggage.tags);
          let sliceDob = targetData.movement.otherPersons[0].dateOfBirth.slice(0, 10);
          let coPassengerDOB = sliceDob.replace(/(^|-)0+/g, '$1').split('-');
          console.log(coPassengerDOB[0], coPassengerDOB[1], coPassengerDOB[2]);
          cy.get('input[name="dateOfBirth-day"]').type(coPassengerDOB[2]).should('have.value', coPassengerDOB[2]);
          cy.get('input[name="dateOfBirth-month"]').type(coPassengerDOB[1]).should('have.value', coPassengerDOB[1]);
          cy.get('input[name="dateOfBirth-year"]').type(coPassengerDOB[0]).should('have.value', coPassengerDOB[0]);
          cy.contains('Continue').click();

          cy.fixture('airpax/airpax-TIS-details.json').then((expectedDetails) => {
            cy.contains('h2', 'Other passenger details').next().within((elements) => {
              cy.getOtherPassengersTISDetails(elements).then((actualMovementDetails) => {
                expect(actualMovementDetails).to.deep.equal(expectedDetails.RefilledPassenger2Details);
              });
            });
          });

          cy.wait(2000);
        });
      });
    });
  });

  after(() => {
    cy.contains('Sign out').click();
    cy.url().should('include', Cypress.env('auth_realm'));
  });
});
