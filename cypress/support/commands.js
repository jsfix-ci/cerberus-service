import 'cypress-keycloak-commands';

let token;

Cypress.Commands.add('login', (userName) => {
  cy.kcLogout();
  cy.kcLogin(userName).as('tokens');
  cy.log(`${Cypress.env('keycloakUrl')}/auth/realms/cop-dev/protocol/openid-connect/token`);
  cy.intercept('POST', `${Cypress.env('keycloakUrl')}/auth/realms/cop-dev/protocol/openid-connect/token`).as('token');
  cy.visit('/');

  cy.wait('@token').then(({ response }) => {
    token = response.body.access_token;
  });
});

Cypress.Commands.add('navigation', (option) => {
  cy.contains('a', option).click();
});

Cypress.Commands.add('waitForTaskManagementPageToLoad', () => {
  cy.intercept('POST', '/camunda/variable-instance?**').as('tasks');
  cy.navigation('Tasks');

  cy.wait('@tasks').then(({ response }) => {
    expect(response.statusCode).to.equal(200);
  });
});

Cypress.Commands.add('getTaskNotes', (taskId) => {
  const authorization = `bearer ${token}`;
  const options = {
    method: 'GET',
    url: `https://cerberus-service.dev.cerberus.cop.homeoffice.gov.uk/camunda/engine-rest/task/${taskId}/comment`,
    headers: {
      authorization,
    },
  };

  cy.request(options).then((response) => {
    return response.body[0].message;
  });
});

Cypress.Commands.add('getUnassignedTasks', () => {
  const authorization = `bearer ${token}`;
  const options = {
    method: 'GET',
    url: '/camunda/task?firstResult=0&maxResults=20',
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
    url: '/camunda/task?firstResult=0&maxResults=20',
    headers: {
      authorization,
    },
  };

  cy.request(options).then((response) => {
    return response.body.filter((item) => item.assignee !== 'acceptance-cerberus-user@system.local');
  });
});

Cypress.Commands.add('getTasksAssignedToMe', () => {
  const authorization = `bearer ${token}`;
  const options = {
    method: 'GET',
    url: '/camunda/task?firstResult=0&maxResults=20',
    headers: {
      authorization,
    },
  };

  cy.request(options).then((response) => {
    return response.body.filter((item) => item.assignee === 'acceptance-cerberus-user@system.local');
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