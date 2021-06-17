import 'cypress-keycloak-commands';

let token;

const cerberusServiceUrl = Cypress.env('cerberusServiceUrl');
const realm = Cypress.env('auth_realm');
const formioComponent = '.formio-component-';
const formioErrorText = '.govuk-error-message > div';
const displayDate24Format = 'DD-MM-YYYY HH:mm';

Cypress.Commands.add('login', (userName) => {
  cy.kcLogout();
  cy.kcLogin(userName).as('tokens');
  cy.intercept('POST', `/auth/realms/${realm}/protocol/openid-connect/token`).as('token');
  cy.visit('/');
  cy.wait('@token').then(({ response }) => {
    token = response.body.access_token;
  });
});

Cypress.Commands.add('navigation', (option) => {
  cy.contains('a', option).click();
});

Cypress.Commands.add('waitForTaskManagementPageToLoad', () => {
  cy.intercept('GET', '/camunda/variable-instance?variableName=taskSummary&processInstanceIdIn=**').as('tasks');

  cy.navigation('Tasks');

  cy.wait('@tasks').then(({ response }) => {
    expect(response.statusCode).to.equal(200);
  });
});

Cypress.Commands.add('getUnassignedTasks', () => {
  const authorization = `bearer ${token}`;

  const options = {
    method: 'GET',
    url: '/camunda/task?**',
    headers: {
      authorization,
    },
  };

  cy.request(options).then((response) => {
    console.log(response.body);
    return response.body.filter((item) => item.assignee === null);
  });
});

Cypress.Commands.add('getTasksAssignedToOtherUsers', () => {
  const authorization = `bearer ${token}`;
  const options = {
    method: 'GET',
    url: '/camunda/task?**',
    headers: {
      authorization,
    },
  };

  cy.request(options).then((response) => {
    return response.body.filter((item) => (item.assignee !== 'cypressuser-cerberus@lodev.xyz' && item.assignee !== null));
  });
});

Cypress.Commands.add('getTasksAssignedToMe', () => {
  const authorization = `bearer ${token}`;
  const options = {
    method: 'GET',
    url: '/camunda/task?**',
    headers: {
      authorization,
    },
  };

  cy.request(options).then((response) => {
    return response.body.filter((item) => item.assignee === 'cypressuser-cerberus@lodev.xyz');
  });
});

Cypress.Commands.add('navigateToTaskDetails', (processInstanceId, index) => {
  cy.get('a[href="#in-progress"]').click();

  cy.intercept('GET', `/camunda/task?processInstanceId=${processInstanceId[index]}`).as('tasksDetails');
  cy.visit(`/tasks/${processInstanceId[index]}`);
  cy.wait('@tasksDetails').then(({ response }) => {
    expect(response.statusCode).to.equal(200);
  });

  cy.wait(2000);
});

Cypress.Commands.add('claimTask', () => {
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

  cy.contains('Back to task list').click();
});

Cypress.Commands.add('selectCheckBox', (elementName, value) => {
  if (value !== undefined && value !== '') {
    cy.get(`${formioComponent}${elementName}`)
      .should('be.visible')
      .contains(new RegExp(`^${value}$`, 'g'))
      .closest('div')
      .find('input')
      .click();
  }
});

Cypress.Commands.add('clickNext', () => {
  cy.get('button[ref$="next"]').should('be.enabled');
  cy.wait(1000);
  cy.get('button[ref$="next"]').click();
});

Cypress.Commands.add('typeValueInTextArea', (elementName, value) => {
  if (value !== undefined && value !== '') {
    cy.get(`${formioComponent}${elementName} textarea`)
      .should('be.visible')
      .type(value, { force: true });
  }
});

Cypress.Commands.add('clickSubmit', () => {
  cy.get('button[ref$="submit"]').should('be.enabled');
  cy.wait(1000);
  cy.get('button[ref$="submit"]').click();
});

Cypress.Commands.add('verifySuccessfulSubmissionHeader', (value) => {
  cy.get('.govuk-panel--confirmation h1')
    .should('be.visible')
    .and('have.text', value);
});

function findItem(taskName, action) {
  function findInPage(count) {
    let found = false;

    cy.get('.pagination').invoke('attr', 'aria-label').as('pages');

    cy.get('@pages').then((pages) => {
      let page = pages.match(/\d/g).join('');
      if (count >= page) {
        return false;
      }
      if (count > 0) {
        cy.contains('Next').click();
        cy.wait(1000);
      }
      cy.get('.govuk-link--no-visited-state').each((item) => {
        if (action === null) {
          cy.wrap(item).invoke('text').then((text) => {
            cy.log('task text', text);
            if (taskName === text) {
              found = true;
            }
          });
        } else {
          cy.wrap(item).invoke('text').then((text) => {
            if (taskName === text) {
              cy.wait(2000);
              cy.contains(action).click();
              found = true;
            }
          });
        }
      }).then(() => {
        if (!found) {
          findInPage(count += 1);
        } else {
          return found;
        }
      });
    });
  }
  findInPage(0);
}

Cypress.Commands.add('findTaskInAllThePages', (taskName, action) => {
  return findItem(taskName, action);
});

Cypress.Commands.add('verifyMandatoryErrorMessage', (element, errorText) => {
  cy.get(`${formioComponent}${element} ${formioErrorText}`)
    .should('be.visible')
    .contains(errorText);
});

Cypress.Commands.add('postTasks', (task, name) => {
  const businessKey = `${name}-${Math.floor((Math.random() * 1000000) + 1)}`;

  task.variables.rbtPayload.value = JSON.parse(task.variables.rbtPayload.value);

  task.businessKey = businessKey;

  task.variables.rbtPayload.value.data.movementId = businessKey;

  task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);

  cy.request({
    method: 'POST',
    url: `https://${cerberusServiceUrl}/camunda/engine-rest/process-definition/key/raiseMovement/start`,
    headers: { Authorization: `Bearer ${token}` },
    body: task,
  }).then((response) => {
    console.log('response', response);
    expect(response.status).to.eq(200);
    expect(response.body.businessKey).to.eq(task.businessKey);
    return response.body;
  });
});

Cypress.Commands.add('selectDropDownValue', (elementName, value) => {
  cy.get(`${formioComponent}${elementName}${formioComponent}select div.form-control`)
    .should('be.visible')
    .click();
  cy.get(`${formioComponent}${elementName} div[role="listbox"]`)
    .contains(value)
    .click({ force: true });
});

Cypress.Commands.add('typeTodaysDateTime', (elementName) => {
  let dateNow = new Date();
  let dateNowFormatted = Cypress.moment(dateNow).format(displayDate24Format);

  let dateTime = Cypress.moment(dateNowFormatted, displayDate24Format);

  cy.get(`${formioComponent}${elementName}`)
    .should('be.visible')
    .within(() => {
      cy.get(`#${elementName}-day`).clear().type(dateTime.format('D'));
      cy.get(`#${elementName}-month`).clear().type(dateTime.format('MM'));
      cy.get(`#${elementName}-year`).clear().type(dateTime.format('YYYY'));
      cy.get(`#${elementName}-hour`).clear().type(dateTime.format('HH'));
      cy.get(`#${elementName}-minute`).clear().type(dateTime.format('mm'));
    });
});

Cypress.Commands.add('selectRadioButton', (elementName, value) => {
  cy.get(`${formioComponent}${elementName} .govuk-radios`)
    .contains(value)
    .closest('div')
    .find('input')
    .click({ force: true });
});

Cypress.Commands.add('getProcessInstanceId', (businessKey) => {
  cy.request({
    method: 'GET',
    url: `https://${cerberusServiceUrl}/camunda/engine-rest/task?processInstanceBusinessKey=${businessKey}`,
    headers: { Authorization: `Bearer ${token}` },
  }).then((response) => {
    expect(response.status).to.eq(200);
    return response.body[0].processInstanceId;
  });
});

Cypress.Commands.add('checkTaskDisplayed', (processInstanceId, businessKey) => {
  cy.visit(`/tasks/${processInstanceId}`);
  cy.get('.govuk-caption-xl').should('have.text', businessKey);
});

Cypress.Commands.add('waitForNoErrors', () => {
  cy.get(formioErrorText).should('not.exist');
});

Cypress.Commands.add('typeValueInTextField', (elementName, value) => {
  cy.get(`${formioComponent}textfield${formioComponent}${elementName} input`)

    .should('be.visible')
    .clear()
    .type(value);
});

Cypress.Commands.add('findTaskInSinglePage', (taskName, action) => {
  let found = false;
  cy.get('.govuk-link--no-visited-state').each((item) => {
    if (action === null) {
      cy.wrap(item).invoke('text').then((text) => {
        cy.log('task text', text);
        if (taskName === text) {
          found = true;
        }
      });
    } else {
      cy.wrap(item).invoke('text').then((text) => {
        if (taskName === text) {
          cy.wait(2000);
          cy.contains(action).click();
          found = true;
        }
      });
    }
  }).then(() => {
    return found;
  });
});
