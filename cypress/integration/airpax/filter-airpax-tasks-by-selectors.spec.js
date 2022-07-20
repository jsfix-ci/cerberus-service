/// <reference types="Cypress"/>
/// <reference path="../support/index.d.ts" />

describe('Filter airpax tasks by Selectors on task management Page', () => {
  const filterOptions = [
    'NOT_PRESENT',
    'PRESENT',
    'ANY',
  ];

  beforeEach(() => {
    cy.login(Cypress.env('userName'));
    cy.acceptPNRTerms();
    cy.visit('/airpax/tasks');
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
    // COP-10849 Verify selectors filter are available
    cy.get('.cop-filters-container').within(() => {
      cy.get('h2.govuk-heading-s').should('have.text', 'Filters');
      cy.get('.cop-filters-header .govuk-link').should('have.text', 'Clear all filters');
      cy.get('.govuk-radios__item [name="selectors"]').next().each((element) => {
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

    cy.get('.govuk-radios__item [value=\'ANY\']').should('be.checked');

    // COP-10849 Apply each selectors filter, compare the expected number of targets
    filterOptions.forEach((selector, index) => {
      cy.applySelectorFilter(selector, 'new').then((actualTargets) => {
        cy.log('actual targets', actualTargets);
        if (selector !== 'ANY') {
          actualTotalTargets += actualTargets;
        }
        cy.getAirPaxTaskCount(null, selector, 'NEW').then((numberOfTasks) => {
          cy.get('.govuk-radios__label').eq(index).invoke('text').then((selectorTargets) => {
            let targets = parseInt(selectorTargets.match(/\d+/)[0], 10);
            expect(targets).be.equal(numberOfTasks.new);
          });
          expect(numberOfTasks.new).be.equal(actualTargets);
        });
      });
    });

    // clear the filter
    cy.contains('Clear all filters').click();

    cy.wait(2000);

    cy.get('.govuk-radios__item [value=\'ANY\']').should('be.checked');

    // compare total number of expected and actual targets
    cy.get('a[href="#new"]').invoke('text').then((totalTargets) => {
      totalTargets = parseInt(totalTargets.match(/\d+/)[0], 10);
      expect(totalTargets).be.equal(actualTotalTargets);
    });
  });

  it('Should apply filter tasks by selectors on In Progress tasks', () => {
    let actualTotalTargets = 0;

    cy.get('a[href="#inProgress"]').click();

    cy.get('.govuk-radios__item [value=\'ANY\']').should('be.checked');
    filterOptions.forEach((selector, index) => {
      cy.applySelectorFilter(selector, 'inProgress').then((actualTargets) => {
        cy.log('actual targets', actualTargets);
        if (selector !== 'ANY') {
          actualTotalTargets += actualTargets;
        }
        cy.getAirPaxTaskCount(null, selector, 'IN_PROGRESS').then((numberOfTasks) => {
          cy.get('.govuk-radios__label').eq(index).invoke('text').then((selectorTargets) => {
            let targets = parseInt(selectorTargets.match(/\d+/)[0], 10);
            expect(targets).be.equal(numberOfTasks.inProgress);
          });
          expect(numberOfTasks.inProgress).be.equal(actualTargets);
        });
      });
    });

    // clear the filter
    cy.contains('Clear all filters').click();

    cy.wait(2000);

    cy.get('.govuk-radios__item [value=\'ANY\']').should('be.checked');

    // compare total number of expected and actual targets
    cy.get('a[href="#inProgress"]').invoke('text').then((totalTargets) => {
      totalTargets = parseInt(totalTargets.match(/\d+/)[0], 10);
      expect(totalTargets).be.equal(actualTotalTargets);
    });
  });

  it('Should apply filter tasks by selectors on Issued tasks', () => {
    let actualTotalTargets = 0;

    cy.get('a[href="#issued"]').click();

    cy.get('.govuk-radios__item [value=\'ANY\']').should('be.checked');
    filterOptions.forEach((selector, index) => {
      cy.applySelectorFilter(selector, 'issued').then((actualTargets) => {
        cy.log('actual targets', actualTargets);
        if (selector !== 'any') {
          actualTotalTargets += actualTargets;
        }
        cy.getAirPaxTaskCount(null, selector, 'ISSUED').then((numberOfTasks) => {
          cy.get('.govuk-radios__label').eq(index).invoke('text').then((selectorTargets) => {
            let targets = parseInt(selectorTargets.match(/\d+/)[0], 10);
            expect(targets).be.equal(numberOfTasks.issued);
          });
          expect(numberOfTasks.issued).be.equal(actualTargets);
        });
      });
    });

    // clear the filter
    cy.contains('Clear all filters').click();

    cy.wait(2000);

    cy.get('.govuk-radios__item [value=\'ANY\']').should('be.checked');

    // compare total number of expected and actual targets
    cy.get('a[href="#issued"]').invoke('text').then((totalTargets) => {
      totalTargets = parseInt(totalTargets.match(/\d+/)[0], 10);
      expect(totalTargets).be.equal(actualTotalTargets);
    });
  });

  it('Should apply filter tasks by selectors on Completed tasks', () => {
    let actualTotalTargets = 0;

    cy.get('a[href="#complete"]').click();

    cy.get('.govuk-radios__item [value=\'ANY\']').should('be.checked');
    filterOptions.forEach((selector, index) => {
      cy.applySelectorFilter(selector, 'complete').then((actualTargets) => {
        cy.log('actual targets', actualTargets);
        if (selector !== 'ANY') {
          actualTotalTargets += actualTargets;
        }
        cy.getAirPaxTaskCount(null, selector, 'COMPLETE').then((numberOfTasks) => {
          cy.get('.govuk-radios__label').eq(index).invoke('text').then((selectorTargets) => {
            let targets = parseInt(selectorTargets.match(/\d+/)[0], 10);
            expect(targets).be.equal(numberOfTasks.complete);
          });
          expect(numberOfTasks.complete).be.equal(actualTargets);
        });
      });
    });

    // clear the filter
    cy.contains('Clear all filters').click();

    cy.wait(2000);

    cy.get('.govuk-radios__item [value=\'ANY\']').should('be.checked');

    // compare total number of expected and actual targets
    cy.get('a[href="#complete"]').invoke('text').then((totalTargets) => {
      totalTargets = parseInt(totalTargets.match(/\d+/)[0], 10);
      expect(totalTargets).be.equal(actualTotalTargets);
    });
  });

  it('Should retain applied filter after page reload & navigating between pages', () => {
    filterOptions.forEach((selector) => {
      cy.applySelectorFilter(selector, 'new').then((actualTargets) => {
        cy.getAirPaxTaskCount(null, selector, 'NEW').then((numberOfTasks) => {
          expect(numberOfTasks.new).be.equal(actualTargets);
        });
        cy.get('a[href="#complete"]').click();
        cy.get('a[href="#new"]').click();
        cy.getAirPaxTaskCount(null, selector, 'NEW').then((numberOfTasks) => {
          expect(numberOfTasks.new).be.equal(actualTargets);
        });
      });
    });
    filterOptions.forEach((selector) => {
      cy.applySelectorFilter(selector, 'new').then((actualTargets) => {
        cy.getAirPaxTaskCount(null, selector, 'NEW').then((numberOfTasks) => {
          expect(numberOfTasks.new).be.equal(actualTargets);
        });
        cy.reload();
        cy.wait(2000);
        cy.getAirPaxTaskCount(null, selector, 'NEW').then((numberOfTasks) => {
          expect(numberOfTasks.new).be.equal(actualTargets);
        });
      });
    });
  });

  after(() => {
    cy.contains('Sign out').click();
    cy.url().should('include', Cypress.env('auth_realm'));
  });
});
