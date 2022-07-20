describe('Filter tasks by pre-arrival mode on task management Page', () => {
  const filterOptions = [
    'RORO_UNACCOMPANIED_FREIGHT',
    'RORO_ACCOMPANIED_FREIGHT',
    'RORO_TOURIST',
  ];
  beforeEach(() => {
    cy.login(Cypress.env('userName'));
    //cy.acceptPNRTerms();
    cy.navigation('Tasks');
  });

  it.skip('Should verify filter by mode and Link to AirPax is displayed', () => {
    cy.get('.govuk-heading-xl').invoke('text').then((Heading) => {
      expect(Heading).to.contain('RoRo');
    });
    cy.get('#mode').should('be.visible');
    cy.get('.airpax-task-link')
      .should('have.attr', 'href').and('include', 'airpax/task').then((href) => {
        cy.intercept('POST', 'v2/targeting-tasks/pages').as('airpaxTaskList');
        cy.visit(href);
        cy.wait('@airpaxTaskList').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
          cy.get('.govuk-heading-xl').invoke('text').then((Heading) => {
            expect(Heading).to.contain('AirPax');
          });
        });
      });
  });

  it('Should view filter tasks by pre-arrival modes', () => {
    cy.wait(2000);
    let filterNames = ['',
      'RoRo unaccompanied freight',
      'RoRo accompanied freight',
      'RoRo Tourist',
    ];
    let expectedFilterNames = [];
    cy.get('a[href="#new"]').invoke('text').as('total-tasks').then((totalTargets) => {
      cy.log('Total number of Targets', parseInt(totalTargets.match(/\d+/)[0], 10));
    });

    cy.get('.cop-filters-container').within(() => {
      cy.get('h2.govuk-heading-s').should('have.text', 'Filters');
      cy.get('.cop-filters-header .govuk-link').should('have.text', 'Clear all filters');

      cy.get('.govuk-select option').each((element) => {
        cy.wrap(element).invoke('text').then((value) => {
          expectedFilterNames.push(value.substring(0, value.indexOf('(')).trim());
        });
      }).then(() => {
        expect(expectedFilterNames).to.deep.equal(filterNames);
      });
    });
  });

  it('Should apply filter tasks by pre-arrival modes on newly created tasks', () => {
    cy.wait(2000);
    let actualTotalTargets = 0;
    // COP-5715 Apply each pre-arrival filter, compare the expected number of targets
    filterOptions.forEach((mode) => {
      cy.applyModesFilter(mode, 'new').then((actualTargets) => {
        cy.log('actual targets', actualTargets);
        actualTotalTargets += actualTargets;
        cy.getTaskCount(mode, null, 'NEW').then((taskResponse) => {
          expect(taskResponse.new).be.equal(actualTargets);
        });
        cy.contains('Clear all filters').click();
        cy.wait(2000);
      });
    });

    // clear the filter
    cy.contains('Clear all filters').click();

    cy.wait(2000);

    // compare total number of expected and actual targets
    cy.get('a[href="#new"]').invoke('text').then((totalTargets) => {
      totalTargets = parseInt(totalTargets.match(/\d+/)[0], 10);
      expect(totalTargets).be.equal(actualTotalTargets);
    });
  });

  it('Should apply filter tasks by pre-arrival modes on In Progress tasks', () => {
    let actualTotalTargets = 0;
    cy.intercept('POST', '/camunda/v1/targeting-tasks/pages').as('pages');
    cy.get('a[href="#inProgress"]').click();
    cy.wait('@pages').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
      // COP-5715 Apply each pre-arrival filter, compare the expected number of targets
      filterOptions.forEach((mode) => {
        cy.applyModesFilter(mode, 'inProgress').then((actualTargets) => {
          cy.log('actual targets', actualTargets);
          actualTotalTargets += actualTargets;
          cy.getTaskCount(mode, null, 'IN_PROGRESS').then((taskResponse) => {
            expect(taskResponse.inProgress).be.equal(actualTargets);
          });
          cy.contains('Clear all filters').click();
          cy.wait(2000);
        });
      });

      // clear the filter
      cy.contains('Clear all filters').click();

      cy.wait(2000);

      // compare total number of expected and actual targets
      cy.get('a[href="#inProgress"]').invoke('text').then((totalTargets) => {
        totalTargets = parseInt(totalTargets.match(/\d+/)[0], 10);
        expect(totalTargets).be.equal(actualTotalTargets);
      });
    });
  });

  it('Should apply filter tasks by pre-arrival modes on Issued tasks', () => {
    let actualTotalTargets = 0;
    cy.intercept('POST', '/camunda/v1/targeting-tasks/pages').as('pages');

    cy.get('a[href="#issued"]').click();
    cy.wait('@pages').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
      cy.wait(2000);
      // COP-5715 Apply each pre-arrival filter, compare the expected number of targets
      filterOptions.forEach((mode) => {
        cy.applyModesFilter(mode, 'issued').then((actualTargets) => {
          cy.log('actual targets', actualTargets);
          actualTotalTargets += actualTargets;
          cy.getTaskCount(mode, null, 'ISSUED').then((taskResponse) => {
            expect(taskResponse.issued).be.equal(actualTargets);
          });
          cy.contains('Clear all filters').click();
          cy.wait(2000);
        });
      });

      // clear the filter
      cy.contains('Clear all filters').click();

      cy.wait(2000);

      // compare total number of expected and actual targets
      cy.get('a[href="#issued"]').invoke('text').then((totalTargets) => {
        totalTargets = parseInt(totalTargets.match(/\d+/)[0], 10);
        expect(totalTargets).be.equal(actualTotalTargets);
      });
    });
  });

  it('Should apply filter tasks by pre-arrival modes on Completed tasks', () => {
    let actualTotalTargets = 0;
    cy.intercept('POST', '/camunda/v1/targeting-tasks/pages').as('pages');
    cy.get('a[href="#complete"]').click();
    cy.wait('@pages').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
      // COP-5715 Apply each pre-arrival filter, compare the expected number of targets
      filterOptions.forEach((mode) => {
        cy.applyModesFilter(mode, 'complete').then((actualTargets) => {
          cy.log('actual targets', actualTargets);
          actualTotalTargets += actualTargets;
          cy.getTaskCount(mode, null, 'COMPLETE').then((taskResponse) => {
            expect(taskResponse.complete).be.equal(actualTargets);
          });
          cy.contains('Clear all filters').click();
          cy.wait(2000);
        });
      });

      // clear the filter
      cy.contains('Clear all filters').click();

      cy.wait(2000);

      // compare total number of expected and actual targets
      cy.get('a[href="#complete"]').invoke('text').then((totalTargets) => {
        totalTargets = parseInt(totalTargets.match(/\d+/)[0], 10);
        expect(totalTargets).be.equal(actualTotalTargets);
      });
    });
  });

  it('Should retain applied filter after page reload & navigating between pages', () => {
    // COP-5715 switch between the tabs, filter should be retained
    cy.wait(2000);
    filterOptions.forEach((mode) => {
      cy.applyModesFilter(mode, 'new').then((actualTargets) => {
        cy.getTaskCount(mode, null, 'NEW').then((response) => {
          expect(response.new).be.equal(actualTargets);
        });
        cy.contains('Clear all filters').click();
        cy.get('a[href="#complete"]').click();
        cy.get('a[href="#new"]').click();
        cy.getTaskCount(mode, null, 'NEW').then((response) => {
          expect(response.new).be.equal(actualTargets);
        });
        cy.contains('Clear all filters').click();
        cy.wait(2000);
      });
    });

    // COP-5715 reload the page after filter applied on the page, filter should be retained
    filterOptions.forEach((mode) => {
      cy.applyModesFilter(mode, 'new').then((actualTargets) => {
        cy.getTaskCount(mode, null, 'NEW').then((response) => {
          expect(response.new).be.equal(actualTargets);
        });
        cy.contains('Clear all filters').click();
        cy.reload();
        cy.wait(2000);
        cy.getTaskCount(mode, null, 'NEW').then((response) => {
          expect(response.new).be.equal(actualTargets);
        });
        cy.contains('Clear all filters').click();
        cy.wait(2000);
      });
    });

    // COP-9661 Multi-select modes persist selection on page refresh
    filterOptions.forEach((mode) => {
      cy.applyModesFilter(mode, 'new').then((actualTargets) => {
        cy.getTaskCount(mode, null, 'NEW').then((response) => {
          expect(response.new).be.equal(actualTargets);
        });
        cy.reload();
        cy.contains('Clear all filters').click();
        cy.wait(2000);
        cy.getTaskCount(mode, null, 'NEW').then((response) => {
          expect(response.new).be.equal(actualTargets);
        });
        cy.contains('Clear all filters').click();
        cy.wait(2000);
      });
    });
  });

  it('Should apply filter tasks by roro-unaccompanied mode & has selectors on New tasks', () => {
    let expectedTargets;
    cy.getTaskCount(null, 'both', 'NEW').then((numberOfTasks) => {
      expectedTargets = numberOfTasks.new;
    });

    // COP-9191 Apply each pre-arrival filter, compare the expected number of targets
    cy.wait(2000);
    cy.applyModesFilter('RORO_UNACCOMPANIED_FREIGHT', 'new').then(() => {
      cy.applySelectorFilter('true', 'new').then((actualTargets) => {
        cy.getTaskCount('RORO_UNACCOMPANIED_FREIGHT', 'true', 'NEW').then((FilterExpectedTargets) => {
          expect(FilterExpectedTargets.new).be.equal(actualTargets);
        });
      });
    });

    // clear the filter
    cy.contains('Clear all filters').click({ force: true });

    cy.wait(2000);

    // compare total number of expected and actual targets
    cy.get('a[href="#new"]').invoke('text').then((totalTargets) => {
      totalTargets = parseInt(totalTargets.match(/\d+/)[0], 10);
      expect(expectedTargets).be.equal(totalTargets);
    });
  });

  it('Should apply filter tasks by roro-accompanied mode & has no selectors on In Progress tasks', () => {
    let expectedTargets;
    cy.get('a[href="#inProgress"]').click();

    cy.getTaskCount(null, 'both', 'IN_PROGRESS').then((numberOfTasks) => {
      expectedTargets = numberOfTasks.inProgress;
    });

    // COP-9191 Apply each pre-arrival filter, compare the expected number of targets
    cy.wait(2000);
    cy.applyModesFilter('RORO_UNACCOMPANIED_FREIGHT', 'inProgress').then(() => {
      cy.applySelectorFilter('false', 'inProgress').then((actualTargets) => {
        cy.getTaskCount('RORO_UNACCOMPANIED_FREIGHT', 'false', 'IN_PROGRESS').then((FilterExpectedTargets) => {
          expect(FilterExpectedTargets.inProgress).be.equal(actualTargets);
        });
      });
    });

    // clear the filter
    cy.contains('Clear all filters').click({ force: true });

    cy.wait(2000);

    // compare total number of expected and actual targets
    cy.get('a[href="#inProgress"]').invoke('text').then((totalTargets) => {
      totalTargets = parseInt(totalTargets.match(/\d+/)[0], 10);
      expect(expectedTargets).be.equal(totalTargets);
    });
  });

  it.skip('Should select pre-arrival filter modes but not apply on newly created tasks', () => {
    let actualTotalTargets = 0;

    cy.getTaskCount(null, 'both', 'NEW').then((numberOfTasks) => {
      actualTotalTargets = numberOfTasks.new;
    });

    // COP-9210 select pre-arrival filter modes, but don't click on apply
    cy.get('.cop-filters-container').within(() => {
      cy.get('.govuk-select option').each((element) => {
        cy.wrap(element).click();
      });
    });
    // compare total number of expected and actual targets
    cy.get('a[href="#new"]').invoke('text').then((totalTargets) => {
      totalTargets = parseInt(totalTargets.match(/\d+/)[0], 10);
      expect(totalTargets).be.equal(actualTotalTargets);
    });
  });

  after(() => {
    cy.deleteAutomationTestData();
    cy.contains('Sign out').click();
    cy.url().should('include', Cypress.env('auth_realm'));
  });
});
