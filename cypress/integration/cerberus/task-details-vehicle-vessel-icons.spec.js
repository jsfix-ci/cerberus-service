describe('Vehicle and Vessel Icons in Task List and Task Summary', () => {
  beforeEach(() => {
    cy.login(Cypress.env('userName'));
    // cy.acceptPNRTerms();
  });

  it('Display Vehicle and Vessel Icons for Accompanied-Freight task', () => {
    cy.createCerberusTask('tasks-hazardous-cargo.json', 'HAZARDOUS').then(() => {
      cy.get('span.govuk-caption-xl').invoke('text').then((businessKey) => {
        cy.visit('/tasks');
        cy.wait(3000);
        cy.get('select').select('RORO_ACCOMPANIED_FREIGHT');
        cy.get('.govuk-radios__item [value=\'true\']').check();
        cy.contains('Apply').click();

        cy.wait(2000);

        cy.verifyIcons(businessKey, 'van', 'ship');
      });
    });
  });

  it('Display Vehicle and Vessel Icons for multiple passengers task', () => {
    cy.visit('/tasks');
    cy.wait(3000);
    cy.get('select').select('RORO_TOURIST');
    cy.get('.govuk-radios__item [value=\'false\']').check();
    cy.contains('Apply').click();

    cy.wait(2000);
    cy.getBusinessKey('MULTIPLE-PASSENGERS').then((businessKeys) => {
      expect(businessKeys.length).to.not.equal(0);
      cy.verifyIcons(businessKeys[0], 'group', 'ship');
    });
  });

  it('Display Vehicle and Vessel Icons for Tourist task with No vehicle task', () => {
    cy.visit('/tasks');
    cy.wait(3000);
    cy.get('select').select('RORO_TOURIST');
    cy.get('.govuk-radios__item [value=\'true\']').check();
    cy.contains('Apply').click();

    cy.wait(2000);
    cy.getBusinessKey('TOURIST-NO-VEHICLE').then((businessKeys) => {
      expect(businessKeys.length).to.not.equal(0);
      cy.verifyIcons(businessKeys[0], 'group', 'ship');
    });
  });

  it.skip('Display Vehicle and Vessel Icons for Tourist task with Passengers task', () => {
    cy.visit('/tasks');
    cy.wait(2000);
    cy.get('select').select('RORO_TOURIST');

    cy.contains('Apply').click();

    cy.wait(2000);
    cy.getBusinessKey('TOURIST-WITH-PASSENGERS').then((businessKeys) => {
      expect(businessKeys.length).to.not.equal(0);
      cy.verifyIcons(businessKeys[0], 'car', 'ship');
    });
  });

  it('Display Vehicle and Vessel Icons for Unaccompanied task', () => {
    cy.visit('/tasks');
    cy.wait(3000);
    cy.get('select').select('RORO_UNACCOMPANIED_FREIGHT');
    cy.get('.govuk-radios__item [value=\'true\']').check();
    cy.contains('Apply').click();

    cy.wait(2000);
    cy.getBusinessKey('RoRo-UNACC-RBT-SBT').then((businessKeys) => {
      expect(businessKeys.length).to.not.equal(0);
      cy.verifyIcons(businessKeys[0], 'hgv', 'ship');
    });
  });

  it('Display Vehicle and Vessel Icons for Unaccompanied with trailer task', () => {
    cy.visit('/tasks');
    cy.wait(3000);
    cy.get('select').select('RORO_UNACCOMPANIED_FREIGHT');
    cy.get('.govuk-radios__item [value=\'true\']').check();

    cy.contains('Apply').click();

    cy.wait(2000);
    cy.getBusinessKey('RoRo-UNACC-SBT').then((businessKeys) => {
      expect(businessKeys.length).to.not.equal(0);
      cy.verifyIcons(businessKeys[0], 'trailer', 'ship');
    });
  });

  after(() => {
    cy.deleteAutomationTestData();
    cy.contains('Sign out').click();
    cy.url().should('include', Cypress.env('auth_realm'));
  });
});
