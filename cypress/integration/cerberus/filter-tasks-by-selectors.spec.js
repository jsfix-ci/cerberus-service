describe('Filter tasks by Selectors on task management Page', () => {
  const filterOptions = [
    'false',
    'true',
    'both',
  ];

  const statusTab = {
    'new': 'NEW',
    'inProgress': 'IN_PROGRESS',
    'issued': 'ISSUED',
    'complete': 'COMPLETE',
  };

  beforeEach(() => {
    cy.login(Cypress.env('userName'));
    // cy.acceptPNRTerms();
    cy.navigation('Tasks');
  });

  it('Should view filter tasks by selectors', () => {
    const filterNames = [
      'Has no selector',
      'Has selector',
      'Both',
    ];
    let expectedFilterNames = [];
    cy.get('a[href="#new"]').invoke('text').as('total-tasks').then((totalTargets) => {
      cy.log('Total number of Targets', parseInt(totalTargets.match(/\d+/)[0], 10));
    });
    cy.wait(3000);
    cy.get('select').select('RORO_ACCOMPANIED_FREIGHT').should('have.value', 'RORO_ACCOMPANIED_FREIGHT');
    cy.get('.cop-filters-container').within(() => {
      cy.get('h2.govuk-heading-s').should('have.text', 'Filters');
      cy.get('.cop-filters-header .govuk-link').should('have.text', 'Clear all filters');
      cy.get('.govuk-radios__item [name="hasSelectors"]').next().each((element) => {
        cy.wrap(element).invoke('text').then((value) => {
          expectedFilterNames.push(value.substring(0, value.indexOf('(')).trim());
        });
      }).then(() => {
        expect(expectedFilterNames).to.deep.equal(filterNames);
      });
    });
  });

  it('Should apply filter tasks by selectors on newly created tasks', () => {
    let actualTotalTargets = 0;
    cy.wait(3000);
    cy.get('select').select('RORO_ACCOMPANIED_FREIGHT');
    cy.contains('Apply').click();
    cy.wait(3000);
    cy.get('.govuk-radios__item [value=\'both\']').should('be.checked');

    // COP-9191 Apply each selectors filter, compare the expected number of targets
    filterOptions.forEach((selector, index) => {
      cy.applySelectorFilter(selector, 'new').then((actualTargets) => {
        cy.log('actual targets', actualTargets);
        if (selector !== 'both') {
          actualTotalTargets += actualTargets;
        }
        cy.getTaskCount('RORO_ACCOMPANIED_FREIGHT', selector, 'NEW').then((numberOfTasks) => {
          // COP-9367 Number of tasks per selector filter (logic needs to be changed when COP-9796 implemented)
          cy.get('.govuk-radios__item label').eq(index).invoke('text').then((selectorTargets) => {
            let targets = parseInt(selectorTargets.match(/\d+/)[0], 10);
            expect(targets).be.equal(numberOfTasks.new);
          });
          expect(numberOfTasks.new).be.equal(actualTargets);
        });
      });
    });

    // clear the filter
    cy.contains('Clear all filters').click();

    cy.wait(3000);
    cy.get('select').select('RORO_ACCOMPANIED_FREIGHT');
    cy.contains('Apply').click();
    cy.wait(3000);
    cy.get('.govuk-radios__item [value=\'both\']').should('be.checked');

    // compare total number of expected and actual targets
    cy.get('a[href="#new"]').invoke('text').then((totalTargets) => {
      totalTargets = parseInt(totalTargets.match(/\d+/)[0], 10);
      expect(totalTargets).be.equal(actualTotalTargets);
    });
  });

  it('Should apply filter tasks by selectors on In Progress tasks', () => {
    let actualTotalTargets = 0;

    cy.get('a[href="#inProgress"]').click();
    cy.wait(3000);
    cy.get('select').select('RORO_ACCOMPANIED_FREIGHT');
    cy.contains('Apply').click();
    cy.wait(3000);
    cy.get('.govuk-radios__item [value=\'both\']').should('be.checked');

    // COP-9191 Apply each selectors filter, compare the expected number of targets
    filterOptions.forEach((selector, index) => {
      cy.applySelectorFilter(selector, 'inProgress').then((actualTargets) => {
        cy.log('actual targets', actualTargets);
        if (selector !== 'both') {
          actualTotalTargets += actualTargets;
        }
        cy.getTaskCount('RORO_ACCOMPANIED_FREIGHT', selector, 'IN_PROGRESS').then((numberOfTasks) => {
          // COP-9367 Number of tasks per selector filter (logic needs to be changed when COP-9796 implemented)
          cy.get('.govuk-radios__item label').eq(index).invoke('text').then((selectorTargets) => {
            let targets = parseInt(selectorTargets.match(/\d+/)[0], 10);
            expect(targets).be.equal(numberOfTasks.total);
          });
          expect(numberOfTasks.inProgress).be.equal(actualTargets);
        });
      });
    });

    // clear the filter
    cy.contains('Clear all filters').click();

    cy.wait(3000);
    cy.get('select').select('RORO_ACCOMPANIED_FREIGHT');
    cy.contains('Apply').click();
    cy.wait(3000);
    cy.get('.govuk-radios__item [value=\'both\']').should('be.checked');

    // compare total number of expected and actual targets
    cy.get('a[href="#inProgress"]').invoke('text').then((totalTargets) => {
      totalTargets = parseInt(totalTargets.match(/\d+/)[0], 10);
      expect(totalTargets).be.equal(actualTotalTargets);
    });
  });

  it('Should apply filter tasks by selectors on Issued tasks', () => {
    let actualTotalTargets = 0;

    cy.get('a[href="#issued"]').click();
    cy.wait(3000);
    cy.get('select').select('RORO_ACCOMPANIED_FREIGHT');
    cy.contains('Apply').click();
    cy.wait(3000);
    cy.get('.govuk-radios__item [value=\'both\']').should('be.checked');

    // COP-9191 Apply each selectors filter, compare the expected number of targets
    filterOptions.forEach((selector, index) => {
      cy.applySelectorFilter(selector, 'issued').then((actualTargets) => {
        cy.log('actual targets', actualTargets);
        if (selector !== 'both') {
          actualTotalTargets += actualTargets;
        }
        cy.getTaskCount('RORO_ACCOMPANIED_FREIGHT', selector, 'ISSUED').then((numberOfTasks) => {
          // COP-9367 Number of tasks per selector filter (logic needs to be changed when COP-9796 implemented)
          cy.get('.govuk-radios__item label').eq(index).invoke('text').then((selectorTargets) => {
            let targets = parseInt(selectorTargets.match(/\d+/)[0], 10);
            expect(targets).be.equal(numberOfTasks.total);
          });
          expect(numberOfTasks.issued).be.equal(actualTargets);
        });
      });
    });

    // clear the filter
    cy.contains('Clear all filters').click();

    cy.wait(3000);
    cy.get('select').select('RORO_ACCOMPANIED_FREIGHT');
    cy.contains('Apply').click();
    cy.wait(3000);
    cy.get('.govuk-radios__item [value=\'both\']').should('be.checked');

    // compare total number of expected and actual targets
    cy.get('a[href="#issued"]').invoke('text').then((totalTargets) => {
      totalTargets = parseInt(totalTargets.match(/\d+/)[0], 10);
      expect(totalTargets).be.equal(actualTotalTargets);
    });
  });

  it('Should apply filter tasks by selectors on Completed tasks', () => {
    let actualTotalTargets = 0;

    cy.get('a[href="#complete"]').click();
    cy.wait(3000);
    cy.get('select').select('RORO_ACCOMPANIED_FREIGHT');
    cy.contains('Apply').click();
    cy.wait(3000);

    cy.get('.govuk-radios__item [value=\'both\']').should('be.checked');

    // COP-9191 Apply each pre-arrival filter, compare the expected number of targets
    filterOptions.forEach((selector, index) => {
      cy.applySelectorFilter(selector, 'complete').then((actualTargets) => {
        cy.log('actual targets', actualTargets);
        if (selector !== 'both') {
          actualTotalTargets += actualTargets;
        }
        cy.getTaskCount('RORO_ACCOMPANIED_FREIGHT', selector, 'COMPLETE').then((numberOfTasks) => {
          // COP-9367 Number of tasks per selector filter (logic needs to be changed when COP-9796 implemented)
          cy.get('.govuk-radios__item label').eq(index).invoke('text').then((selectorTargets) => {
            let targets = parseInt(selectorTargets.match(/\d+/)[0], 10);
            expect(targets).be.equal(numberOfTasks.total);
          });
          expect(numberOfTasks.complete).be.equal(actualTargets);
        });
      });
    });

    // clear the filter
    cy.contains('Clear all filters').click();

    cy.wait(3000);
    cy.get('select').select('RORO_ACCOMPANIED_FREIGHT');
    cy.contains('Apply').click();
    cy.wait(3000);
    cy.get('.govuk-radios__item [value=\'both\']').should('be.checked');

    // compare total number of expected and actual targets
    cy.get('a[href="#complete"]').invoke('text').then((totalTargets) => {
      totalTargets = parseInt(totalTargets.match(/\d+/)[0], 10);
      expect(totalTargets).be.equal(actualTotalTargets);
    });
  });

  it('Should retain applied filter after page reload & navigating between pages', () => {
    // COP-9191 switch between the tabs, filter should be retained
    cy.wait(3000);
    cy.get('select').select('RORO_ACCOMPANIED_FREIGHT');
    cy.contains('Apply').click();
    cy.wait(3000);
    filterOptions.forEach((selector) => {
      cy.applySelectorFilter(selector, 'new').then((actualTargets) => {
        cy.getTaskCount('RORO_ACCOMPANIED_FREIGHT', selector, 'NEW').then((numberOfTasks) => {
          expect(numberOfTasks.new).be.equal(actualTargets);
        });
        cy.get('a[href="#complete"]').click();
        cy.get('a[href="#new"]').click();
        cy.getTaskCount('RORO_ACCOMPANIED_FREIGHT', selector, 'NEW').then((numberOfTasks) => {
          expect(numberOfTasks.new).be.equal(actualTargets);
        });
      });
    });

    // COP-9191 reload the page after filter applied on the page, filter should be retained
    filterOptions.forEach((selector) => {
      cy.applySelectorFilter(selector, 'new').then((actualTargets) => {
        cy.getTaskCount('RORO_ACCOMPANIED_FREIGHT', selector, 'NEW').then((numberOfTasks) => {
          expect(numberOfTasks.new).be.equal(actualTargets);
        });
        cy.reload();
        cy.wait(3000);
        cy.getTaskCount('RORO_ACCOMPANIED_FREIGHT', selector, 'NEW').then((numberOfTasks) => {
          expect(numberOfTasks.new).be.equal(actualTargets);
        });
      });
    });
  });

  it('Should apply filter tasks by selectors present and check count on each of the tab', () => {
    // COP-9796 Apply selectors Present filter, compare the Count next to the Filter & count on the status Tab
    cy.wait(3000);
    cy.get('select').select('RORO_ACCOMPANIED_FREIGHT');
    cy.contains('Apply').click();
    cy.wait(3000);
    cy.applySelectorFilter('true', 'new').then(() => {
      Object.keys(statusTab).forEach((key) => {
        cy.get(`a[href="#${key}"]`).click();
        cy.getTaskCount('RORO_ACCOMPANIED_FREIGHT', 'true', statusTab[key]).then((numberOfTasks) => {
          // COP-9796 Number of tasks per selector filter on each of the status tab
          cy.wait(1000);
          cy.get('.govuk-radios__item label').eq(1).invoke('text').then((selectorTargets) => {
            let targets = parseInt(selectorTargets.match(/\d+/)[0], 10);
            expect(targets).be.equal(numberOfTasks[key]);
            cy.get(`a[href="#${key}"]`).invoke('text').then((totalTargets) => {
              totalTargets = parseInt(totalTargets.match(/\d+/)[0], 10);
              expect(totalTargets).be.equal(targets);
            });
          });
        });
      });
    });
  });

  it('Should apply filter tasks by selectors Not Present and check count on each of the tab', () => {
    // COP-9796 Apply selectors Not Present filter, compare the Count next to the Filter & count on the status Tab
    cy.wait(3000);
    cy.get('select').select('RORO_ACCOMPANIED_FREIGHT');
    cy.contains('Apply').click();
    cy.wait(3000);
    cy.applySelectorFilter('false', 'new').then(() => {
      Object.keys(statusTab).forEach((key) => {
        cy.get(`a[href="#${key}"]`).click();
        cy.getTaskCount('RORO_ACCOMPANIED_FREIGHT', 'false', statusTab[key]).then((numberOfTasks) => {
          // COP-9796 Number of tasks per selector filter on each of the status tab
          cy.wait(1000);
          cy.get('.govuk-radios__item label').eq(0).invoke('text').then((selectorTargets) => {
            let targets = parseInt(selectorTargets.match(/\d+/)[0], 10);
            expect(targets).be.equal(numberOfTasks[key]);
            cy.get(`a[href="#${key}"]`).invoke('text').then((totalTargets) => {
              totalTargets = parseInt(totalTargets.match(/\d+/)[0], 10);
              expect(totalTargets).be.equal(targets);
            });
          });
        });
      });
    });
  });

  it('Should apply filter tasks by selectors Any and check count on each of the tab', () => {
    // COP-9796 Apply selectors Not Present filter, compare the Count next to the Filter & count on the status Tab
    cy.wait(3000);
    cy.get('select').select('RORO_ACCOMPANIED_FREIGHT');
    cy.contains('Apply').click();
    cy.wait(3000);
    cy.applySelectorFilter('both', 'new').then(() => {
      Object.keys(statusTab).forEach((key) => {
        cy.get(`a[href="#${key}"]`).click();
        cy.wait(2000);
        cy.getTaskCount('RORO_ACCOMPANIED_FREIGHT', 'both', statusTab[key]).then((numberOfTasks) => {
          // COP-9796 Number of tasks per selector filter on each of the status tab
          cy.wait(2000);
          cy.get('.govuk-radios__item label').eq(2).invoke('text').then((selectorTargets) => {
            let targets = parseInt(selectorTargets.match(/\d+/)[0], 10);
            expect(targets).be.equal(numberOfTasks[key]);
            cy.get(`a[href="#${key}"]`).invoke('text').then((totalTargets) => {
              totalTargets = parseInt(totalTargets.match(/\d+/)[0], 10);
              expect(totalTargets).be.equal(targets);
            });
          });
        });
      });
    });
  });

  after(() => {
    cy.deleteAutomationTestData();
    cy.contains('Sign out').click();
    cy.url().should('include', Cypress.env('auth_realm'));
  });
});
