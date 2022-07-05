describe('Filter airpax tasks by Selectors on task management Page', () => {
  beforeEach(() => {
    cy.login(Cypress.env('userName'));
    cy.acceptPNRTerms();
  });

  it('Should apply filter tasks by different rule ID on newly created tasks', () => {
    cy.intercept('POST', '/v2/targeting-tasks/pages').as('airpaxTask');
    cy.intercept('POST', '/v2/targeting-tasks/status-counts').as('statusCount');
    cy.intercept('GET', '/v2/filters/rules').as('ruleFilters');
    const taskName = 'AUTOTEST';
    cy.fixture('airpax/task-airpax-rules-with-diff-rule-id.json').then((task) => {
      let ruleNames = [];
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}`;
      task.data.matchedRules.forEach((rule) => {
        const randomNumber = Math.floor((Math.random() * 1000000) + 1);
        rule.ruleId = randomNumber;
        rule.ruleName = `${rule.ruleName}_${randomNumber}`;
        ruleNames.push(rule.ruleName);
      });
      cy.createTargetingApiTask(task).then((response) => {
        expect(response.movement.id).to.contain(taskName);
        cy.wait(4000);
        cy.checkAirPaxTaskDisplayed(`${response.id}`);

        cy.contains('Back to task list').click();

        cy.waitForAirPaxTaks();

        cy.wait('@ruleFilters').then((filterResponse) => {
          const rules = filterResponse.response.body.map(((filterId) => filterId.id));
          const hasDuplicates = (ruleIds) => ruleIds.length !== new Set(ruleIds).size;
          expect(hasDuplicates(rules).valueOf()).to.be.equal(false);
        });

        cy.get('div[id="rules"] .hods-multi-select-autocomplete__placeholder').type(ruleNames[0]);
        cy.get(`input[value="${ruleNames[0]}"]`).type('{enter}');
        cy.contains('Apply').click();
        cy.waitForStatusCounts();
        cy.get('.govuk-task-list-card').should('have.length', 1);

        cy.wait(2000);
        cy.get('div[id="rules"] .hods-multi-select-autocomplete__input').type(ruleNames[1]);
        cy.get(`input[value="${ruleNames[1]}"]`).type('{enter}');
        cy.contains('Apply').click();
        cy.waitForStatusCounts();
        cy.get('.govuk-task-list-card').should('have.length', 1);
      });
    });
  });

  it('Should apply filter tasks by same rule ID on newly created tasks', () => {
    cy.intercept('POST', '/v2/targeting-tasks/pages').as('airpaxTask');
    cy.intercept('POST', '/v2/targeting-tasks/status-counts').as('statusCount');
    const taskName = 'AUTOTEST';
    let task1RuleNames = [];
    let task2RuleNames = [];
    cy.fixture('airpax/task-airpax-rules-with-diff-rule-id.json').then((task) => {
      const randomNumber = Math.floor((Math.random() * 1000000) + 1);
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}`;
      task.data.matchedRules.forEach((rule) => {
        rule.ruleId = randomNumber;
        rule.ruleName = `Auto-test_${randomNumber}`;
        task1RuleNames.push(rule.ruleName);
      });
      cy.createTargetingApiTask(task).then((task1Response) => {
        expect(task1Response.movement.id).to.contain(taskName);
        cy.wait(4000);
      });
    });
    cy.fixture('airpax/task-airpax-rules-with-diff-rule-id.json').then((task) => {
      const randomNumber = Math.floor((Math.random() * 1000000) + 1);
      task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}`;
      task.data.matchedRules.forEach((rule) => {
        rule.ruleId = randomNumber;
        rule.ruleName = `Auto-test_${randomNumber}`;
        task2RuleNames.push(rule.ruleName);
      });
      cy.createTargetingApiTask(task).then((task2Response) => {
        expect(task2Response.movement.id).to.contain(taskName);
        cy.wait(4000);

        cy.checkAirPaxTaskDisplayed(`${task2Response.id}`);
      });
      cy.contains('Back to task list').click();

      cy.waitForAirPaxTaks();

      cy.get('div[id="rules"] .hods-multi-select-autocomplete__placeholder').type(task1RuleNames[0]);
      cy.get(`input[value="${task1RuleNames[0]}"]`).type('{enter}');
      cy.contains('Apply').click();

      cy.waitForStatusCounts();
      cy.get('.govuk-task-list-card').should('have.length', 1);

      cy.wait(2000);
      cy.get('div[id="rules"] .hods-multi-select-autocomplete__input').type(task2RuleNames[0]);
      cy.get(`input[value="${task2RuleNames[0]}"]`).type('{enter}');
      cy.contains('Apply').click();

      cy.waitForStatusCounts();

      cy.get('.govuk-task-list-card').should('have.length', 2);
    });
  });
});
