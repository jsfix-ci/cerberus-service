/// <reference types="Cypress"/>
/// <reference path="../support/index.d.ts" />

describe('Filter tasks by Selectors on task management Page', () => {
  const filterOptions = [
    'true',
    'false',
    'any',
  ];

  beforeEach(() => {
    cy.login(Cypress.env('userName'));
    cy.navigation('Tasks');
  });

  it('Should view filter tasks by selectors', () => {
    const filterNames = [
      'Not present',
      'Present',
      'Any',
    ];

    cy.get('a[href="#new"]').invoke('text').as('total-tasks').then((totalTargets) => {
      cy.log('Total number of Targets', parseInt(totalTargets.match(/\d+/)[0], 10));
    });

    cy.get('.cop-filters-container').within(() => {
      cy.get('h2.govuk-heading-s').should('have.text', 'Filters');
      cy.get('.cop-filters-header .govuk-link').should('have.text', 'Clear all filters');
      cy.get('.govuk-radios__item [name="hasSelectors"]').next().each((element) => {
        cy.wrap(element).invoke('text').then((value) => {
          expect(filterNames).to.include(value);
        });
      });
    });
  });

  it('Should apply filter tasks by selectors on newly created tasks', () => {
    let actualTotalTargets = 0;

    // COP-9191 Apply each selectors filter, compare the expected number of targets
    filterOptions.forEach((selector) => {
      cy.applySelectorFilter(selector, 'new').then((actualTargets) => {
        cy.log('actual targets', actualTargets);
        if (selector !== 'any') {
          actualTotalTargets += actualTargets;
        }
        cy.getTaskCount(null, selector).then((numberOfTasks) => {
          expect(numberOfTasks.new).be.equal(actualTargets);
        });
      });
    });

    // clear the filter
    cy.contains('Clear all filters').click();

    cy.wait(1000);

    // compare total number of expected and actual targets
    cy.get('a[href="#new"]').invoke('text').then((totalTargets) => {
      totalTargets = parseInt(totalTargets.match(/\d+/)[0], 10);
      expect(totalTargets).be.equal(actualTotalTargets);
    });
  });

  it('Should apply filter tasks by selectors on In Progress tasks', () => {
    let actualTotalTargets = 0;

    cy.get('a[href="#inProgress"]').click();

    // COP-9191 Apply each selectors filter, compare the expected number of targets
    filterOptions.forEach((selector) => {
      cy.applySelectorFilter(selector, 'inProgress').then((actualTargets) => {
        cy.log('actual targets', actualTargets);
        if (selector !== 'any') {
          actualTotalTargets += actualTargets;
        }
        cy.getTaskCount(null, selector).then((numberOfTasks) => {
          expect(numberOfTasks.inProgress).be.equal(actualTargets);
        });
      });
    });

    // clear the filter
    cy.contains('Clear all filters').click();

    cy.wait(1000);

    // compare total number of expected and actual targets
    cy.get('a[href="#inProgress"]').invoke('text').then((totalTargets) => {
      totalTargets = parseInt(totalTargets.match(/\d+/)[0], 10);
      expect(totalTargets).be.equal(actualTotalTargets);
    });
  });

  it('Should apply filter tasks by selectors on Issued tasks', () => {
    let actualTotalTargets = 0;

    cy.get('a[href="#issued"]').click();

    // COP-9191 Apply each selectors filter, compare the expected number of targets
    filterOptions.forEach((selector) => {
      cy.applySelectorFilter(selector, 'issued').then((actualTargets) => {
        cy.log('actual targets', actualTargets);
        if (selector !== 'any') {
          actualTotalTargets += actualTargets;
        }
        cy.getTaskCount(null, selector).then((numberOfTasks) => {
          expect(numberOfTasks.issued).be.equal(actualTargets);
        });
      });
    });

    // clear the filter
    cy.contains('Clear all filters').click();

    cy.wait(1000);

    // compare total number of expected and actual targets
    cy.get('a[href="#issued"]').invoke('text').then((totalTargets) => {
      totalTargets = parseInt(totalTargets.match(/\d+/)[0], 10);
      expect(totalTargets).be.equal(actualTotalTargets);
    });
  });

  it('Should apply filter tasks by selectors on Completed tasks', () => {
    let actualTotalTargets = 0;

    cy.get('a[href="#complete"]').click();

    // COP-9191 Apply each pre-arrival filter, compare the expected number of targets
    filterOptions.forEach((selector) => {
      cy.applySelectorFilter(selector, 'complete').then((actualTargets) => {
        cy.log('actual targets', actualTargets);
        if (selector !== 'any') {
          actualTotalTargets += actualTargets;
        }
        cy.getTaskCount(null, selector).then((numberOfTasks) => {
          expect(numberOfTasks.complete).be.equal(actualTargets);
        });
      });
    });

    // clear the filter
    cy.contains('Clear all filters').click();

    cy.wait(1000);

    // compare total number of expected and actual targets
    cy.get('a[href="#complete"]').invoke('text').then((totalTargets) => {
      totalTargets = parseInt(totalTargets.match(/\d+/)[0], 10);
      expect(totalTargets).be.equal(actualTotalTargets);
    });
  });

  it('Should retain applied filter after page reload & navigating between pages', () => {
    // COP-9191 switch between the tabs, filter should be retained
    filterOptions.forEach((selector) => {
      cy.applySelectorFilter(selector, 'new').then((actualTargets) => {
        cy.getTaskCount(null, selector).then((numberOfTasks) => {
          expect(numberOfTasks.new).be.equal(actualTargets);
        });
        cy.get('a[href="#complete"]').click();
        cy.get('a[href="#new"]').click();
        cy.getTaskCount(null, selector).then((numberOfTasks) => {
          expect(numberOfTasks.new).be.equal(actualTargets);
        });
      });
    });

    // COP-9191 reload the page after filter applied on the page, filter should be retained
    filterOptions.forEach((selector) => {
      cy.applySelectorFilter(selector, 'new').then((actualTargets) => {
        cy.getTaskCount(null, selector).then((numberOfTasks) => {
          expect(numberOfTasks.new).be.equal(actualTargets);
        });
        cy.reload();
        cy.wait(2000);
        cy.getTaskCount(null, selector).then((numberOfTasks) => {
          expect(numberOfTasks.new).be.equal(actualTargets);
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
