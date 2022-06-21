describe('Verify AirPax task details of different sections', () => {
  beforeEach(() => {
    cy.login(Cypress.env('userName'));
  });

  it('Should check document section of the airPax task', () => {
    cy.acceptPNRTerms();
    const taskName = 'AIRPAX';
    cy.fixture('airpax/task-airpax.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      cy.createAirPaxTask(task).then((response) => {
        expect(response.movement.id).to.contain('AIRPAX');
        cy.wait(4000);
        cy.checkAirPaxTaskDisplayed(`${response.id}`);
        cy.fixture('airpax/airpax-task-expected-details.json').then((expectedResponse) => {
          cy.contains('h3', 'Document').nextAll().within((elements) => {
            cy.getairPaxTaskDetail(elements).then((details) => {
              expect(details).to.deep.equal(expectedResponse.Document);
            });
          });
        });
      });
    });
  });

  it('Should check airPax task not visible if User not agreed for PNR terms', () => {
    cy.intercept('POST', '/v2/targeting-tasks/pages').as('airpaxTask');
    cy.visit('/airpax/tasks');
    cy.doNotAcceptPNRTerms();
    cy.wait('@airpaxTask').then(({ response }) => {
      expect(response.statusCode).to.be.equal(403);
    });
  });

  it('Should check airPax task not visible if User not in the authorised location', () => {
    cy.intercept('POST', '/v2/targeting-tasks/pages').as('airpaxTask');
    cy.visit('/airpax/tasks');
    cy.userNotInApprovedLocation();
    cy.wait('@airpaxTask').then(({ response }) => {
      expect(response.statusCode).to.be.equal(403);
    });
  });

  it('Should check Add a new note input box is visible in task details page when a task is claimed', () => {
    const textNote = 'This is a test note';
    cy.acceptPNRTerms();
    const taskName = 'AIRPAX';
    cy.fixture('airpax/task-airpax.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      cy.createAirPaxTask(task).then((response) => {
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
    cy.get('#note').should('be.visible').type(textNote);
    cy.get('.hods-button').click();
    cy.wait(3000);
    cy.get('p[class="govuk-body"]').invoke('text').as('taskActivity');
    cy.get('@taskActivity').then(($activityText) => {
      expect($activityText).includes(textNote);
    });
    cy.get('.govuk-caption-xl').invoke('text').as('taskId');
    cy.unClaimAirPaxTask();
    cy.get('@taskId').then((businessKey) => {
      cy.visit(`/airpax/tasks/${businessKey}`);
      cy.wait(3000);
      cy.get('#note').should('not.exist');
    });
  });

  it('Should see all the action buttons if task claimed by the same user', () => {
    const actionItems = [
      'Issue target',
      'Assessment complete',
      'Dismiss',
    ];

    cy.acceptPNRTerms();
    const taskName = 'AIRPAX';
    cy.fixture('airpax/task-airpax.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      cy.createAirPaxTask(task).then((response) => {
        expect(response.movement.id).to.contain('AIRPAX');
        cy.wait(4000);
        cy.checkAirPaxTaskDisplayed(`${response.id}`);
      });
    });
    cy.claimAirPaxTask();

    cy.get('.task-actions--buttons button').each(($items, index) => {
      expect($items.text()).to.equal(actionItems[index]);
    });
  });

  it('Should verify all the action buttons not available for non-task owner', () => {
    cy.acceptPNRTerms();
    const taskName = 'AIRPAX';
    cy.fixture('airpax/task-airpax.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      cy.createAirPaxTask(task).then((response) => {
        expect(response.movement.id).to.contain('AIRPAX');
        cy.wait(4000);
        cy.claimAirPaxTaskWithUserId(response.id);
        cy.checkAirPaxTaskDisplayed(`${response.id}`);
      });
    });

    cy.get('.task-actions--buttons button').should('not.exist');
  });

  it('Should verify Baggage details of an AirPax task with Single Passenger on task details page', () => {
    cy.acceptPNRTerms();
    const taskName = 'AIRPAX';
    cy.fixture('airpax/task-airpax.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      cy.createAirPaxTask(task).then((response) => {
        cy.wait(4000);
        cy.checkAirPaxTaskDisplayed(`${response.id}`);
        cy.fixture('airpax/airpax-task-expected-details.json').then((expectedResponse) => {
          cy.contains('h3', 'Baggage').nextAll().within((elements) => {
            cy.getairPaxTaskDetail(elements).then((details) => {
              expect(details).to.deep.equal(expectedResponse.Baggage);
            });
          });
        });
      });
    });
  });

  it('Should verify Baggage details of an AirPax task with Multiple Passenger on task details page', () => {
    cy.acceptPNRTerms();
    const taskName = 'AIRPAX';
    cy.fixture('airpax/task-airpax-multiple-passengers.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      cy.createAirPaxTask(task).then((response) => {
        cy.wait(4000);
        cy.checkAirPaxTaskDisplayed(`${response.id}`);
        cy.fixture('airpax/airpax-task-baggage-expected-multiple-passengers.json').then((expectedResponse) => {
          cy.contains('h3', 'Baggage').nextAll().within((elements) => {
            cy.contains('This booking is for multiple travellers. Check the travellers list for baggage allocations.');
            cy.getairPaxTaskDetail(elements).then((details) => {
              expect(details).to.deep.equal(expectedResponse.Baggage);
            });
          });
        });
      });
    });
  });

  it('Should verify Booking details of an AirPax task on task details page', () => {
    cy.acceptPNRTerms();
    const taskName = 'AIRPAX';
    cy.fixture('airpax/task-airpax.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      cy.createAirPaxTask(task).then((response) => {
        cy.wait(4000);
        cy.checkAirPaxTaskDisplayed(`${response.id}`);
        cy.fixture('airpax/airpax-task-expected-details.json').then((expectedDetails) => {
          cy.contains('h3', 'Booking').next().within((elements) => {
            cy.getairPaxTaskDetail(elements).then((actualBookingDetails) => {
              expect(actualBookingDetails).to.deep.equal(expectedDetails.Booking);
            });
          });
          cy.contains('Payments').parent().nextAll().within((elements) => {
            cy.getairPaxPaymentAndAgencyDetails(elements).then((actualBookingDetails) => {
              expect(actualBookingDetails).to.deep.equal(expectedDetails.Payments);
            });
          });
        });
      });
    });
  });

  it('Should verify No selectors & rules on task details page', () => {
    cy.acceptPNRTerms();
    const taskName = 'AIRPAX';
    cy.fixture('airpax/task-airpax-no-rules-selectors.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      cy.createAirPaxTask(task).then((response) => {
        cy.wait(4000);
        cy.checkAirPaxTaskDisplayed(`${response.id}`);
        cy.get('.task-versions .task-versions--right').should('contain.text', 'No rule matches');
        cy.get('h2.govuk-heading-m').should('contain.text', '0 selector matches');
      });
    });
  });

  it('Should verify the selector matches with same & different group reference on 2 different version of a task', () => {
    cy.acceptPNRTerms();
    const movementID = `APIPNR:CMID=15148b83b4fbba770dad11348d1c9b13_${Math.floor((Math.random() * 1000000) + 1)}`;
    cy.fixture('airpax/task-airpax-same-group-reference-selectors.json').then((task) => {
      task.data.movementId = movementID;
      cy.createAirPaxTask(task).then(() => {
        cy.wait(4000);
      });
    });

    cy.fixture('airpax/task-airpax-different-group-reference-selectors.json').then((task) => {
      task.data.movementId = movementID;
      cy.createAirPaxTask(task).then((response) => {
        cy.wait(4000);
        cy.checkAirPaxTaskDisplayed(`${response.id}`);
      });
    });

    cy.expandTaskDetails(0);

    cy.get('[id$=-content-1]').within(() => {
      cy.contains('h4', 'SR-218').nextAll().within((elements) => {
        cy.fixture('airpax/selectors-group-versions-expected.json').then((expectedDetails) => {
          cy.getSelectorGroupInformation(elements).then((actualGroupDetails) => {
            expect(expectedDetails['Selectors-version-2'][0]).to.deep.equal(actualGroupDetails);
          });
        });
      });

      cy.contains('h4', 'SR-217').nextAll().within((elements) => {
        cy.fixture('airpax/selectors-group-versions-expected.json').then((expectedDetails) => {
          cy.getSelectorGroupInformation(elements).then((actualGroupDetails) => {
            expect(expectedDetails['Selectors-version-2'][1]).to.deep.equal(actualGroupDetails);
          });
        });
      });

      cy.contains('h4', 'SR-227').nextAll().within((elements) => {
        cy.fixture('airpax/selectors-group-versions-expected.json').then((expectedDetails) => {
          cy.getSelectorGroupInformation(elements).then((actualGroupDetails) => {
            expect(expectedDetails['Selectors-version-2'][2]).to.deep.equal(actualGroupDetails);
          });
        });
      });

      cy.contains('h4', 'SR-216').nextAll().within((elements) => {
        cy.fixture('airpax/selectors-group-versions-expected.json').then((expectedDetails) => {
          cy.getSelectorGroupInformation(elements).then((actualGroupDetails) => {
            expect(expectedDetails['Selectors-version-2'][3]).to.deep.equal(actualGroupDetails);
          });
        });
      });

      cy.contains('h4', 'SR-215').nextAll().within((elements) => {
        cy.fixture('airpax/selectors-group-versions-expected.json').then((expectedDetails) => {
          cy.getSelectorGroupInformation(elements).then((actualGroupDetails) => {
            expect(expectedDetails['Selectors-version-2'][4]).to.deep.equal(actualGroupDetails);
          });
        });
      });
    });

    cy.expandTaskDetails(1);

    cy.get('[id$=-content-2]').within(() => {
      cy.contains('h4', 'SR-215').nextAll().within((elements) => {
        cy.fixture('airpax/selectors-group-versions-expected.json').then((expectedDetails) => {
          cy.getSelectorGroupInformation(elements).then((actualGroupDetails) => {
            expect(expectedDetails['Selectors-version-1'][0]).to.deep.equal(actualGroupDetails);
          });
        });
      });
    });
  });

  it('Should check rule matches details on task details page', () => {
    cy.fixture('airpax/expected-risk-indicators.json').as('expectedRiskIndicatorMatches');

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

        cy.get('table:not(.co-travellers-table)').each((table, index) => {
          cy.wrap(table).getTable().then((tableData) => {
            cy.log(tableData);
            cy.get('@expectedRiskIndicatorMatches').then((expectedData) => {
              console.log(expectedData.riskIdicators[`risk-${index}`]);
              cy.log(tableData);
              expectedData.riskIdicators[`risk-${index}`].forEach((taskItem) => expect(tableData).to.deep.include(taskItem));
            });
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
              risk: 'Alcohol and 2 other rules',
              riskTier: 'Tier 1',
            }).then((taskFound) => {
              expect(taskFound).to.equal(true);
            });
          } else {
            cy.findTaskInSinglePage(`${businessKey}`, null, {
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

  it('Should check  rule matches details for more than one version on task management page', () => {
    cy.acceptPNRTerms();
    const movementID = `AUTO-TEST:CMID=15148b83b4fbba770dad11348d1c9b13_${Math.floor((Math.random() * 1000000) + 1)}`;
    const nextPage = 'a[data-test="next"]';
    let businessKey;
    cy.intercept('POST', '/v2/targeting-tasks/pages').as('airpaxTask');

    cy.fixture('airpax/task-airpax-rules-with-diff-threat.json').then((task) => {
      task.data.movementId = movementID;
      cy.createAirPaxTask(task).then(() => {
        cy.wait(4000);
      });
    });

    cy.fixture('airpax/task-airpax-rules-v2.json').then((task) => {
      task.data.movementId = movementID;
      cy.createAirPaxTask(task).then((response) => {
        cy.wait(4000);
        businessKey = response.id;
        cy.visit('/airpax/tasks');
        cy.wait('@airpaxTask').then(({ taskResponse }) => {
          expect(taskResponse.statusCode).to.be.equal(200);
        });
        cy.checkAirPaxTaskDisplayed(businessKey);

        cy.wait(3000);

        cy.get('.govuk-caption-xl').invoke('text').as('taskName');

        cy.contains('Back to task list').click();

        cy.reload();

        cy.wait('@airpaxTask').then(({ taskResponse }) => {
          expect(taskResponse.statusCode).to.equal(200);
        });

        cy.get('body').then(($el) => {
          if ($el.find(nextPage).length > 0) {
            cy.findTaskInAllThePages(`${businessKey}`, null, {
              risk: 'Alcohol and 1 other rule',
              riskTier: 'Tier 1',
            }).then((taskFound) => {
              expect(taskFound).to.equal(true);
            });
          } else {
            cy.findTaskInSinglePage(`${businessKey}`, null, {
              risk: 'Alcohol and 1 other rule',
              riskTier: 'Tier 1',
            }).then((taskFound) => {
              expect(taskFound).to.equal(true);
            });
          }
        });
      });
    });
  });

  it('Should verify Passenger details of an AirPax task on task details page', () => {
    cy.acceptPNRTerms();
    const taskName = 'AIRPAX';
    cy.fixture('airpax/task-airpax.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      cy.createAirPaxTask(task).then((response) => {
        cy.wait(4000);
        cy.checkAirPaxTaskDisplayed(`${response.id}`);
        cy.fixture('airpax/airpax-task-expected-details.json').then((expectedDetails) => {
          cy.contains('h3', 'Passenger').next().within((elements) => {
            cy.getairPaxTaskDetail(elements).then((actualPassengerDetails) => {
              expect(actualPassengerDetails).to.deep.equal(expectedDetails.Passenger);
            });
          });
        });
      });
    });
  });

    it('Should verify Voyage details of an AirPax task on task details page', () => {
    cy.acceptPNRTerms();
    const taskName = 'AIRPAX';
    cy.fixture('airpax/task-airpax.json').then((task) => {
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
      cy.createAirPaxTask(task).then((response) => {
        cy.wait(4000);
        cy.checkAirPaxTaskDisplayed(`${response.id}`);
        cy.fixture('airpax/airpax-task-expected-details.json').then((expectedDetails) => {
          cy.contains('h3', 'Voyage').next().within((elements) => {
            cy.getairPaxTaskDetail(elements).then((actualVoyageDetails) => {
              console.log(actualVoyageDetails);
              console.log(expectedDetails.Voyage);
              expect(actualVoyageDetails).to.deep.equal(expectedDetails.Voyage);
            });
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
