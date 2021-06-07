describe('Render tasks from Camunda and manage them on task details Page', () => {
  before(() => {
    cy.login(Cypress.env('userName'));
    cy.fixture('tasks.json').then((task) => {
      cy.postTasks(task, 'CERB-AUTOTEST');
    });
  });

  beforeEach(() => {
    cy.login(Cypress.env('userName'));
  });

  it('Should navigate to task details page', () => {
    cy.get('.task-heading a').eq(1).invoke('text').then((text) => {
      cy.contains(text).click();
      cy.get('.govuk-caption-xl').should('have.text', text);
    });
  });

  it('Should add notes for the selected tasks', () => {
    const taskNotes = 'Add notes for testing & check it stored';
    cy.intercept('POST', '/camunda/process-definition/key/noteSubmissionWrapper/submit-form').as('notes');
    cy.get('.govuk-grid-row').eq(0).within(() => {
      cy.intercept('GET', '/camunda/task?processInstanceId=*').as('tasksDetails');
      cy.get('a').invoke('text').as('taskName');
      cy.get('a').click();
      cy.wait('@tasksDetails').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
    });

    cy.intercept('POST', '/camunda/task/*/claim').as('claim');
    cy.get('p.govuk-body').eq(0).should('contain.text', 'Unassigned');

    cy.get('button.link-button').should('be.visible').and('have.text', 'Claim').click();

    cy.wait('@claim').then(({ response }) => {
      expect(response.statusCode).to.equal(204);
    });

    cy.wait(2000);

    cy.get('.formio-component-note textarea')
      .should('be.visible')
      .type(taskNotes, { force: true });

    cy.get('.formio-component-submit button').click('top');

    cy.wait('@notes').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });

    cy.reload();

    cy.get('.govuk-grid-column-one-third').within(() => {
      cy.get('.govuk-body-s a').first().should('have.text', 'cypressuser-cerberus@lodev.xyz');
      cy.get('p.govuk-body').first().should('have.text', taskNotes);
    });

    cy.get('button.link-button').should('be.visible').and('have.text', 'Unclaim').click();

    cy.wait(2000);
  });

  it('Should hide Notes Textarea for the tasks assigned to others', () => {
    cy.getTasksAssignedToOtherUsers().then((tasks) => {
      const processInstanceId = tasks.map((item) => item.processInstanceId);
      expect(processInstanceId.length).to.not.equal(0);
      cy.intercept('GET', `/camunda/task?processInstanceId=${processInstanceId[0]}`).as('tasksDetails');
      cy.visit(`/tasks/${processInstanceId[0]}`);
      cy.wait('@tasksDetails').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
    });

    cy.get('.govuk-heading-xl').should('have.text', 'Task details');

    cy.get('.formio-component-note textarea').should('not.exist');
  });

  it('Should hide Claim/UnClaim button for the tasks assigned to others', () => {
    cy.get('a[href="#in-progress"]').click();

    cy.getTasksAssignedToOtherUsers().then((tasks) => {
      const processInstanceId = tasks.map((item) => item.processInstanceId);
      expect(processInstanceId.length).to.not.equal(0);
      let index = 0;
      cy.navigateToTaskDetails(processInstanceId, index);
    });

    cy.get('button.link-button').should('not.exist');
  });

  it('Should Claim a task Successfully from task details page', () => {
    const actionItems = [
      'Issue target',
      'Assessment complete',
      'Dismiss',
    ];

    cy.intercept('POST', '/camunda/task/*/claim').as('claim');

    cy.get('.govuk-grid-row').eq(0).within(() => {
      cy.get('a').invoke('text').as('taskName');
      cy.get('a').click();
    });
    cy.get('p.govuk-body').eq(0).should('contain.text', 'Unassigned');

    cy.get('button.link-button').should('be.visible').and('have.text', 'Claim').click();

    cy.wait('@claim').then(({ response }) => {
      expect(response.statusCode).to.equal(204);
    });

    cy.wait(2000);

    cy.get('.task-actions--buttons button').each(($items, index) => {
      expect($items.text()).to.equal(actionItems[index]);
    });

    cy.contains('Back to task list').click();

    cy.get('a[href="#in-progress"]').click();

    cy.waitForTaskManagementPageToLoad();

    cy.get('@taskName').then((value) => {
      cy.findTaskInAllThePages(value, null).then((taskFound) => {
        expect(taskFound).to.equal(true);
      });
    });
  });

  it('Should verify all the action buttons available when task loaded from In Progress', () => {
    const actionItems = [
      'Issue target',
      'Assessment complete',
      'Dismiss',
    ];

    cy.claimTask().then(() => {
      cy.getTasksAssignedToMe().then((tasks) => {
        const processInstanceId = tasks.map((item) => item.processInstanceId);
        expect(processInstanceId.length).to.not.equal(0);
        let index = 0;
        cy.navigateToTaskDetails(processInstanceId, index);
      });

      cy.get('.task-actions--buttons button').each(($items, index) => {
        expect($items.text()).to.equal(actionItems[index]);
      });
    });
  });

  it('Should verify all the action buttons not available for non-task owner', () => {
    cy.getTasksAssignedToOtherUsers().then((tasks) => {
      const processInstanceId = tasks.map(((item) => item.processInstanceId));
      expect(processInstanceId.length).to.not.equal(0);
      cy.intercept('GET', `/camunda/task?processInstanceId=${processInstanceId[0]}`).as('tasksDetails');
      cy.visit(`/tasks/${processInstanceId[0]}`);
      cy.wait('@tasksDetails').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
    });

    cy.get('.task-actions--buttons button').should('not.exist');
  });

  it('Should Unclaim a task Successfully from task details page', () => {
    cy.intercept('POST', '/camunda/task/*/unclaim').as('unclaim');

    cy.getTasksAssignedToMe().then((tasks) => {
      const processInstanceId = tasks.map((item) => item.processInstanceId);
      expect(processInstanceId.length).to.not.equal(0);
      let index = 0;
      cy.navigateToTaskDetails(processInstanceId, index);
    });

    cy.get('button.link-button').should('be.visible').and('have.text', 'Unclaim').click();

    cy.wait('@unclaim').then(({ response }) => {
      expect(response.statusCode).to.equal(204);
    });

    cy.wait(2000);
  });

  it('Should complete assessment of a task with a reason as take no further action', () => {
    const reasons = [
      'Credibility checks carried out - no target required',
      'Vessel arrived',
      'False BSM or selector match',
      'Other',
    ];

    cy.get('.govuk-grid-row').eq(0).within(() => {
      cy.intercept('GET', '/camunda/task?processInstanceId=*').as('tasksDetails');
      cy.get('a').invoke('text').as('taskName');
      cy.get('a').click();
      cy.wait('@tasksDetails').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
    });

    cy.wait(2000);

    cy.get('button.link-button').should('be.visible').and('have.text', 'Claim').click();

    cy.contains('Assessment complete').click();

    cy.clickNext();

    cy.verifyMandatoryErrorMessage('reason', 'You must indicate at least one reason for completing your assessment');

    cy.selectCheckBox('reason', 'No further action');

    cy.clickNext();

    cy.get('.formio-component-nfaReason .govuk-checkboxes__item label').each((reason, index) => {
      cy.wrap(reason)
        .should('contain.text', reasons[index]).and('be.visible');
    });

    cy.selectCheckBox('nfaReason', 'Vessel arrived');

    cy.clickNext();

    cy.typeValueInTextArea('addANote', 'This is for testing');

    cy.clickSubmit();

    cy.verifySuccessfulSubmissionHeader('Task has been completed');
  });

  it('Should dismiss a task with a reason', () => {
    const reasons = [
      'Vessel arrived',
      'False rule match',
      'Resource redirected',
      'Other (please specify)',
    ];

    cy.get('.govuk-grid-row').eq(0).within(() => {
      cy.intercept('GET', '/camunda/task?processInstanceId=*').as('tasksDetails');
      cy.get('a').invoke('text').as('taskName');
      cy.get('a').click();
      cy.wait('@tasksDetails').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
    });

    cy.intercept('POST', '/camunda/task/*/claim').as('claim');
    cy.get('p.govuk-body').eq(0).should('contain.text', 'Unassigned');

    cy.get('button.link-button').should('be.visible').and('have.text', 'Claim').click();

    cy.wait('@claim').then(({ response }) => {
      expect(response.statusCode).to.equal(204);
    });

    cy.wait(2000);

    cy.contains('Dismiss').click();

    cy.get('.formio-component-reason .govuk-radios__label').each((reason, index) => {
      cy.wrap(reason)
        .should('contain.text', reasons[index]).and('be.visible');
    });

    cy.clickNext();

    cy.verifyMandatoryErrorMessage('reason', 'You must indicate at least one reason for dismissing the task');

    cy.selectRadioButton('reason', 'Other (please specify)');

    cy.typeValueInTextField('otherReason', 'other reason for testing');

    cy.clickNext();

    cy.waitForNoErrors();

    cy.typeValueInTextArea('addANote', 'This is for testing');

    cy.clickSubmit();

    cy.verifySuccessfulSubmissionHeader('Task has been dismissed');
  });

  it('Should verify all the action buttons not available when task loaded from Complete tab', () => {
    cy.get('a[href="#complete"]').click();

    cy.get('.govuk-grid-row').eq(0).within(() => {
      cy.get('a').click();
    });

    cy.get('.task-actions--buttons button').should('not.exist');

    cy.get('button.link-button').should('not.exist');

    cy.get('.formio-component-note textarea').should('not.exist');
  });

  it('Should Unclaim a task Successfully from at the end of pages In Progress tab & verify it moved to New tab', () => {
    cy.clock();
    cy.intercept('POST', '/camunda/task/*/unclaim').as('unclaim');

    cy.getTasksAssignedToMe().then((tasks) => {
      const processInstanceId = tasks.map((item) => item.processInstanceId);
      expect(processInstanceId.length).to.not.equal(0);
      let index = processInstanceId.length - 1;
      cy.navigateToTaskDetails(processInstanceId, index);
    });

    cy.get('.govuk-caption-xl').invoke('text').as('taskName');

    cy.get('button.link-button').should('be.visible').and('have.text', 'Unclaim').click();

    cy.wait('@unclaim').then(({ response }) => {
      expect(response.statusCode).to.equal(204);
    });

    cy.wait(2000);

    cy.url().should('contain', '/tasks?tab=new');

    cy.tick(60000);

    cy.get('@taskName').then((text) => {
      cy.findTaskInAllThePages(text, null).then((taskFound) => {
        expect(taskFound).to.equal(true);
      });
    });
  });

  it('Should Unclaim a task Successfully from In Progress tab & verify it moved to New tab', () => {
    cy.intercept('POST', '/camunda/task/*/unclaim').as('unclaim');

    cy.getTasksAssignedToMe().then((tasks) => {
      const processInstanceId = tasks.map((item) => item.processInstanceId);
      expect(processInstanceId.length).to.not.equal(0);
      let index = 0;
      cy.navigateToTaskDetails(processInstanceId, index);
    });

    cy.get('.govuk-caption-xl').invoke('text').as('taskName');

    cy.get('button.link-button').should('be.visible').and('have.text', 'Unclaim').click();

    cy.wait('@unclaim').then(({ response }) => {
      expect(response.statusCode).to.equal(204);
    });

    cy.wait(2000);

    cy.url().should('contain', '/tasks?tab=new');

    cy.get('@taskName').then((text) => {
      cy.findTaskInAllThePages(text, null).then((taskFound) => {
        expect(taskFound).to.equal(true);
      });
    });
  });

  after(() => {
    cy.contains('Sign out').click();
    cy.get('#kc-page-title').should('contain.text', 'Log In');
  });
});
