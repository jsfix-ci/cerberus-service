describe('Targeter to see how long before departure check-in occurs So that Targeter can prioritise a task accordingly', () => {
  // COP-9849
  beforeEach(() => {
    cy.login(Cypress.env('userName'));
    // cy.acceptPNRTerms();
  });

  it('Should verify Difference between Checkin and departure date is a few seconds ago', () => {
    cy.fixture('RoRo-Unaccompanied-RBT-SBT.json').then((task) => {
      let date = new Date();
      let dateNowFormatted = Cypress.dayjs(date).format('DD-MM-YYYY');
      task.variables.rbtPayload.value.data.movement.serviceMovement.attributes.attrs.checkInDateTime = '2021-03-05T06:00:30';
      task.variables.rbtPayload.value.data.movement.organisations[0].attributes.attrs.CheckinDateTime = '2021-03-05T06:00:30';
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      cy.postTasks(task, `AUTOTEST-${dateNowFormatted}-RORO-UNACCOMPANIED-RBT-SBT`).then((response) => {
        cy.wait(4000);
        let businessKey = response.businessKey;
        cy.checkTaskDisplayed(businessKey);
      });
    });
    cy.verifyCheckInDateTime('5 Mar 2021 at 06:00, a few seconds ago');
  });

  it('Should verify Difference between Checkin and departure date is a minute ago', () => {
    cy.fixture('RoRo-Unaccompanied-RBT-SBT.json').then((task) => {
      let date = new Date();
      let dateNowFormatted = Cypress.dayjs(date).format('DD-MM-YYYY');
      task.variables.rbtPayload.value.data.movement.serviceMovement.attributes.attrs.checkInDateTime = '2021-03-05T06:00:46';
      task.variables.rbtPayload.value.data.movement.organisations[0].attributes.attrs.CheckinDateTime = '2021-03-05T06:00:46';
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      cy.postTasks(task, `AUTOTEST-${dateNowFormatted}-RORO-UNACCOMPANIED-RBT-SBT`).then((response) => {
        cy.wait(4000);
        let businessKey = response.businessKey;
        cy.checkTaskDisplayed(businessKey);
      });
    });
    cy.verifyCheckInDateTime('5 Mar 2021 at 06:00, a minute ago');
  });

  it('Should verify Difference between Checkin and departure date is 2 minutes ago', () => {
    cy.fixture('RoRo-Unaccompanied-RBT-SBT.json').then((task) => {
      let date = new Date();
      let dateNowFormatted = Cypress.dayjs(date).format('DD-MM-YYYY');
      task.variables.rbtPayload.value.data.movement.serviceMovement.attributes.attrs.checkInDateTime = '2021-03-05T06:01:31';
      task.variables.rbtPayload.value.data.movement.organisations[0].attributes.attrs.CheckinDateTime = '2021-03-05T06:01:31';
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      cy.postTasks(task, `AUTOTEST-${dateNowFormatted}-RORO-UNACCOMPANIED-RBT-SBT`).then((response) => {
        cy.wait(4000);
        let businessKey = response.businessKey;
        cy.checkTaskDisplayed(businessKey);
      });
    });
    cy.verifyCheckInDateTime('5 Mar 2021 at 06:01, 2 minutes ago');
  });

  it('Should verify Difference between Checkin and departure date is 44 minutes ago', () => {
    cy.fixture('RoRo-Unaccompanied-RBT-SBT.json').then((task) => {
      let date = new Date();
      let dateNowFormatted = Cypress.dayjs(date).format('DD-MM-YYYY');
      task.variables.rbtPayload.value.data.movement.serviceMovement.attributes.attrs.checkInDateTime = '2021-03-05T06:44:0';
      task.variables.rbtPayload.value.data.movement.organisations[0].attributes.attrs.CheckinDateTime = '2021-03-05T06:44:00';
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      cy.postTasks(task, `AUTOTEST-${dateNowFormatted}-RORO-UNACCOMPANIED-RBT-SBT`).then((response) => {
        cy.wait(4000);
        let businessKey = response.businessKey;
        cy.checkTaskDisplayed(businessKey);
      });
    });
    cy.verifyCheckInDateTime('5 Mar 2021 at 06:44, 44 minutes ago');
  });

  it('Should verify Difference between Checkin and departure date is an hour ago', () => {
    cy.fixture('RoRo-Unaccompanied-RBT-SBT.json').then((task) => {
      let date = new Date();
      let dateNowFormatted = Cypress.dayjs(date).format('DD-MM-YYYY');
      task.variables.rbtPayload.value.data.movement.serviceMovement.attributes.attrs.checkInDateTime = '2021-03-05T06:45:30';
      task.variables.rbtPayload.value.data.movement.organisations[0].attributes.attrs.CheckinDateTime = '2021-03-05T06:45:30';
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      cy.postTasks(task, `AUTOTEST-${dateNowFormatted}-RORO-UNACCOMPANIED-RBT-SBT`).then((response) => {
        cy.wait(4000);
        let businessKey = response.businessKey;
        cy.checkTaskDisplayed(businessKey);
      });
    });
    cy.verifyCheckInDateTime('5 Mar 2021 at 06:45, an hour ago');
  });

  it('Should verify Difference between Checkin and departure date is also an hour ago', () => {
    cy.fixture('RoRo-Unaccompanied-RBT-SBT.json').then((task) => {
      let date = new Date();
      let dateNowFormatted = Cypress.dayjs(date).format('DD-MM-YYYY');
      task.variables.rbtPayload.value.data.movement.serviceMovement.attributes.attrs.checkInDateTime = '2021-03-05T07:15:30';
      task.variables.rbtPayload.value.data.movement.organisations[0].attributes.attrs.CheckinDateTime = '2021-03-05T07:15:30';
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      cy.postTasks(task, `AUTOTEST-${dateNowFormatted}-RORO-UNACCOMPANIED-RBT-SBT`).then((response) => {
        cy.wait(4000);
        let businessKey = response.businessKey;
        cy.checkTaskDisplayed(businessKey);
      });
    });
    cy.verifyCheckInDateTime('5 Mar 2021 at 07:15, an hour ago');
  });

  it('Should verify Difference between Checkin and departure date is 2 hours ago', () => {
    cy.fixture('RoRo-Unaccompanied-RBT-SBT.json').then((task) => {
      let date = new Date();
      let dateNowFormatted = Cypress.dayjs(date).format('DD-MM-YYYY');
      task.variables.rbtPayload.value.data.movement.serviceMovement.attributes.attrs.checkInDateTime = '2021-03-05T07:30:00';
      task.variables.rbtPayload.value.data.movement.organisations[0].attributes.attrs.CheckinDateTime = '2021-03-05T07:30:00';
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      cy.postTasks(task, `AUTOTEST-${dateNowFormatted}-RORO-UNACCOMPANIED-RBT-SBT`).then((response) => {
        cy.wait(4000);
        let businessKey = response.businessKey;
        cy.checkTaskDisplayed(businessKey);
      });
    });
    cy.verifyCheckInDateTime('5 Mar 2021 at 07:30, 2 hours ago');
  });

  it('Should verify Difference between Checkin and departure date is 5 hours ago', () => {
    cy.fixture('RoRo-Unaccompanied-RBT-SBT.json').then((task) => {
      let date = new Date();
      let dateNowFormatted = Cypress.dayjs(date).format('DD-MM-YYYY');
      task.variables.rbtPayload.value.data.movement.serviceMovement.attributes.attrs.checkInDateTime = '2021-03-05T11:00:00';
      task.variables.rbtPayload.value.data.movement.organisations[0].attributes.attrs.CheckinDateTime = '2021-03-05T11:00:00';
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      cy.postTasks(task, `AUTOTEST-${dateNowFormatted}-RORO-UNACCOMPANIED-RBT-SBT`).then((response) => {
        cy.wait(4000);
        let businessKey = response.businessKey;
        cy.checkTaskDisplayed(businessKey);
      });
    });
    cy.verifyCheckInDateTime('5 Mar 2021 at 11:00, 5 hours ago');
  });

  it('Should verify Difference between Checkin and departure date is 20 hours ago', () => {
    cy.fixture('RoRo-Unaccompanied-RBT-SBT.json').then((task) => {
      let date = new Date();
      let dateNowFormatted = Cypress.dayjs(date).format('DD-MM-YYYY');
      task.variables.rbtPayload.value.data.movement.serviceMovement.attributes.attrs.checkInDateTime = '2021-03-06T02:00:00';
      task.variables.rbtPayload.value.data.movement.organisations[0].attributes.attrs.CheckinDateTime = '2021-03-06T02:00:00';
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      cy.postTasks(task, `AUTOTEST-${dateNowFormatted}-RORO-UNACCOMPANIED-RBT-SBT`).then((response) => {
        cy.wait(4000);
        let businessKey = response.businessKey;
        cy.checkTaskDisplayed(businessKey);
      });
    });
    cy.verifyCheckInDateTime('6 Mar 2021 at 02:00, 20 hours ago');
  });

  it('Should verify Difference between Checkin and departure date is a day ago', () => {
    cy.fixture('RoRo-Unaccompanied-RBT-SBT.json').then((task) => {
      let date = new Date();
      let dateNowFormatted = Cypress.dayjs(date).format('DD-MM-YYYY');
      task.variables.rbtPayload.value.data.movement.serviceMovement.attributes.attrs.checkInDateTime = '2021-03-06T04:30:00';
      task.variables.rbtPayload.value.data.movement.organisations[0].attributes.attrs.CheckinDateTime = '2021-03-06T04:30:00';
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      cy.postTasks(task, `AUTOTEST-${dateNowFormatted}-RORO-UNACCOMPANIED-RBT-SBT`).then((response) => {
        cy.wait(4000);
        let businessKey = response.businessKey;
        cy.checkTaskDisplayed(businessKey);
      });
    });
    cy.verifyCheckInDateTime('6 Mar 2021 at 04:30, a day ago');
  });

  it('Should verify Difference between Checkin and departure date is 25 days ago', () => {
    cy.fixture('RoRo-Unaccompanied-RBT-SBT.json').then((task) => {
      let date = new Date();
      let dateNowFormatted = Cypress.dayjs(date).format('DD-MM-YYYY');
      task.variables.rbtPayload.value.data.movement.serviceMovement.attributes.attrs.checkInDateTime = '2021-03-30T06:00:00';
      task.variables.rbtPayload.value.data.movement.organisations[0].attributes.attrs.CheckinDateTime = '2021-03-30T06:00:00';
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      cy.postTasks(task, `AUTOTEST-${dateNowFormatted}-RORO-UNACCOMPANIED-RBT-SBT`).then((response) => {
        cy.wait(4000);
        let businessKey = response.businessKey;
        cy.checkTaskDisplayed(businessKey);
      });
    });
    cy.verifyCheckInDateTime('30 Mar 2021 at 06:00, 25 days ago');
  });

  it('Should verify Difference between Checkin and departure date is a month ago', () => {
    cy.fixture('RoRo-Unaccompanied-RBT-SBT.json').then((task) => {
      let date = new Date();
      let dateNowFormatted = Cypress.dayjs(date).format('DD-MM-YYYY');
      task.variables.rbtPayload.value.data.movement.serviceMovement.attributes.attrs.checkInDateTime = '2021-04-06T06:00:00';
      task.variables.rbtPayload.value.data.movement.organisations[0].attributes.attrs.CheckinDateTime = '2021-04-06T06:00:00';
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      cy.postTasks(task, `AUTOTEST-${dateNowFormatted}-RORO-UNACCOMPANIED-RBT-SBT`).then((response) => {
        cy.wait(4000);
        let businessKey = response.businessKey;
        cy.checkTaskDisplayed(businessKey);
      });
    });
    cy.verifyCheckInDateTime('6 Apr 2021 at 06:00, a month ago');
  });

  it('Should verify Difference between Checkin and departure date is 10 months ago', () => {
    cy.fixture('RoRo-Unaccompanied-RBT-SBT.json').then((task) => {
      let date = new Date();
      let dateNowFormatted = Cypress.dayjs(date).format('DD-MM-YYYY');
      task.variables.rbtPayload.value.data.movement.serviceMovement.attributes.attrs.checkInDateTime = '2022-01-06T06:00:00';
      task.variables.rbtPayload.value.data.movement.organisations[0].attributes.attrs.CheckinDateTime = '2022-01-06T06:00:00';
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      cy.postTasks(task, `AUTOTEST-${dateNowFormatted}-RORO-UNACCOMPANIED-RBT-SBT`).then((response) => {
        cy.wait(4000);
        let businessKey = response.businessKey;
        cy.checkTaskDisplayed(businessKey);
      });
    });
    cy.verifyCheckInDateTime('6 Jan 2022 at 06:00, 10 months ago');
  });

  it('Should verify Difference between Checkin and departure date is also 10 months ago', () => {
    cy.fixture('RoRo-Unaccompanied-RBT-SBT.json').then((task) => {
      let date = new Date();
      let dateNowFormatted = Cypress.dayjs(date).format('DD-MM-YYYY');
      task.variables.rbtPayload.value.data.movement.serviceMovement.attributes.attrs.checkInDateTime = '2022-01-06T06:00:00';
      task.variables.rbtPayload.value.data.movement.organisations[0].attributes.attrs.CheckinDateTime = '2022-01-06T06:00:00';
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      cy.postTasks(task, `AUTOTEST-${dateNowFormatted}-RORO-UNACCOMPANIED-RBT-SBT`).then((response) => {
        cy.wait(4000);
        let businessKey = response.businessKey;
        cy.checkTaskDisplayed(businessKey);
      });
    });
    cy.verifyCheckInDateTime('6 Jan 2022 at 06:00, 10 months ago');
  });

  it('Should verify Difference between Checkin and departure date is a year ago', () => {
    cy.fixture('RoRo-Unaccompanied-RBT-SBT.json').then((task) => {
      let date = new Date();
      let dateNowFormatted = Cypress.dayjs(date).format('DD-MM-YYYY');
      task.variables.rbtPayload.value.data.movement.serviceMovement.attributes.attrs.checkInDateTime = '2022-02-06T06:00:00';
      task.variables.rbtPayload.value.data.movement.organisations[0].attributes.attrs.CheckinDateTime = '2022-02-06T06:00:00';
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      cy.postTasks(task, `AUTOTEST-${dateNowFormatted}-RORO-UNACCOMPANIED-RBT-SBT`).then((response) => {
        cy.wait(4000);
        let businessKey = response.businessKey;
        cy.checkTaskDisplayed(businessKey);
      });
    });
    cy.verifyCheckInDateTime('6 Feb 2022 at 06:00, a year ago');
  });

  it('Should verify Difference between Checkin and departure date is also a year ago', () => {
    cy.fixture('RoRo-Unaccompanied-RBT-SBT.json').then((task) => {
      let date = new Date();
      let dateNowFormatted = Cypress.dayjs(date).format('DD-MM-YYYY');
      task.variables.rbtPayload.value.data.movement.serviceMovement.attributes.attrs.checkInDateTime = '2022-07-06T06:00:00';
      task.variables.rbtPayload.value.data.movement.organisations[0].attributes.attrs.CheckinDateTime = '2022-07-06T06:00:00';
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      cy.postTasks(task, `AUTOTEST-${dateNowFormatted}-RORO-UNACCOMPANIED-RBT-SBT`).then((response) => {
        cy.wait(4000);
        let businessKey = response.businessKey;
        cy.checkTaskDisplayed(businessKey);
      });
    });
    cy.verifyCheckInDateTime('6 Jul 2022 at 06:00, a year ago');
  });

  it('Should verify Difference between Checkin and departure date is 2 years ago', () => {
    cy.fixture('RoRo-Unaccompanied-RBT-SBT.json').then((task) => {
      let date = new Date();
      let dateNowFormatted = Cypress.dayjs(date).format('DD-MM-YYYY');
      task.variables.rbtPayload.value.data.movement.serviceMovement.attributes.attrs.checkInDateTime = '2022-09-06T06:00:00';
      task.variables.rbtPayload.value.data.movement.organisations[0].attributes.attrs.CheckinDateTime = '2022-09-06T06:00:00';
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      cy.postTasks(task, `AUTOTEST-${dateNowFormatted}-RORO-UNACCOMPANIED-RBT-SBT`).then((response) => {
        cy.wait(4000);
        let businessKey = response.businessKey;
        cy.checkTaskDisplayed(businessKey);
      });
    });
    cy.verifyCheckInDateTime('6 Sep 2022 at 06:00, 2 years ago');
  });

  it('Should verify Difference between Checkin and departure date is also 2 years ago', () => {
    cy.fixture('RoRo-Unaccompanied-RBT-SBT.json').then((task) => {
      let date = new Date();
      let dateNowFormatted = Cypress.dayjs(date).format('DD-MM-YYYY');
      task.variables.rbtPayload.value.data.movement.serviceMovement.attributes.attrs.checkInDateTime = '2023-03-06T06:00:00';
      task.variables.rbtPayload.value.data.movement.organisations[0].attributes.attrs.CheckinDateTime = '2023-03-06T06:00:00';
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      cy.postTasks(task, `AUTOTEST-${dateNowFormatted}-RORO-UNACCOMPANIED-RBT-SBT`).then((response) => {
        cy.wait(4000);
        let businessKey = response.businessKey;
        cy.checkTaskDisplayed(businessKey);
      });
    });
    cy.verifyCheckInDateTime('6 Mar 2023 at 06:00, 2 years ago');
  });

  it('Should verify Difference between Checkin and departure date is 3 years ago', () => {
    cy.fixture('RoRo-Unaccompanied-RBT-SBT.json').then((task) => {
      let date = new Date();
      let dateNowFormatted = Cypress.dayjs(date).format('DD-MM-YYYY');
      task.variables.rbtPayload.value.data.movement.serviceMovement.attributes.attrs.checkInDateTime = '2023-09-06T06:00:00';
      task.variables.rbtPayload.value.data.movement.organisations[0].attributes.attrs.CheckinDateTime = '2023-09-06T06:00:00';
      task.variables.rbtPayload.value = JSON.stringify(task.variables.rbtPayload.value);
      cy.postTasks(task, `AUTOTEST-${dateNowFormatted}-RORO-UNACCOMPANIED-RBT-SBT`).then((response) => {
        cy.wait(4000);
        let businessKey = response.businessKey;
        cy.checkTaskDisplayed(businessKey);
      });
    });
    cy.verifyCheckInDateTime('6 Sep 2023 at 06:00, 3 years ago');
  });

  after(() => {
    cy.deleteAutomationTestData();
    cy.contains('Sign out').click();
    cy.url().should('include', Cypress.env('auth_realm'));
  });
});
