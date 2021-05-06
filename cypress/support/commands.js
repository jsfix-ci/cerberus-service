import 'cypress-keycloak-commands';

let token;

const cerberusServiceUrl = Cypress.env('cerberusServiceUrl');
const realm = Cypress.env('auth_realm');

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
  cy.intercept('GET', '/camunda/variable-instance?deserializeValues=false&variableName=taskSummary&processInstanceIdIn=**').as('tasks');
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
    return response.body.filter((item) => item.assignee !== 'cypressuser-cerberus@lodev.xyz');
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

Cypress.Commands.add('selectCheckBox', (elementName, value) => {
  if (value !== undefined && value !== '') {
    cy.get(`.formio-component-${elementName}`)
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
    cy.get(`.formio-component-${elementName} textarea`)
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

function findItem(value) {
  function findInPage(index) {
    let found = false;

    cy.get('li a[data-test*="page-number"]').as('pages');

    cy.get('@pages').its(length).then((len) => {
      if (index > len) {
        return false;
      }
      cy.get('@pages').eq(index).click();
      cy.get('.govuk-link--no-visited-state').each((item) => {
        cy.wrap(item).invoke('attr', 'href').then((href) => {
          if (href === value) {
            found = true;
            cy.get(`.govuk-grid-row a[href="${value}"]`)
              .parentsUntil('.task-list--item').within(() => {
                cy.get('button.link-button')
                  .should('have.text', 'Unclaim')
                  .click();
              });
          }
        });
      }).then(() => {
        if (!found) {
          findInPage(index += 1);
        }
      });
    });
  }
  findInPage(0);
}

Cypress.Commands.add('unClaimTaskFromListPage', (value) => {
  findItem(value);
});

Cypress.Commands.add('postTasks', (name) => {
  const businessKey = `${name}-${Math.floor((Math.random() * 1000000) + 1)}`;

  cy.fixture('tasks.json').then((task) => {
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
      expect(response.status).to.eq(200);
      expect(response.body.businessKey).to.eq(task.businessKey);
    });
  });
});
