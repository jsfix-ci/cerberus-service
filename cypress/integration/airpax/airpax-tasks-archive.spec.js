describe('Airpax tasks archive functionality', () => {
    beforeEach(() => {
        cy.login(Cypress.env('userName'));
    });

    it('Should verify airpax tasks older than 6 months are archived', () => {
        cy.acceptPNRTerms();
        const taskName = 'AUTO_TEST';
        cy.fixture('airpax/dismiss-task-airpax.json').as('dismissPayload');
        let pastTime = Cypress.dayjs().utc().subtract(7, 'month');
        let present = Cypress.dayjs().utc();

        let diff = (pastTime.diff(present))/1000;
        cy.log(diff);
        cy.setTimeOffset(diff);

        cy.fixture('airpax/task-airpax.json').then((task) => {
            task.data.movementId = `${taskName}_${Math.floor((Math.random() * 1000000) + 1)}:CMID=TEST`;
            cy.createAirPaxTask(task).then((response) => {
                expect(response.movement.id).to.contain(taskName);
                cy.wait(4000);
                cy.checkAirPaxTaskDisplayed(`${response.id}`);

            cy.claimAirPaxTask();

            cy.get('@dismissPayload').then((payload) => {
                payload.userId = Cypress.env('userName');
                cy.dismissAirPaxTask(payload, response.id).then((dismissTaskResponse) => {
                    expect(dismissTaskResponse.id).to.equals(response.id);
                    expect(dismissTaskResponse.status).to.equals('COMPLETE');
                });
            });

           cy.reSetTimeOffset();

            cy.archiveTasks();

            cy.wait(2000);

            cy.getArchivedTasks().then((archivedTasks) => {
               console.log(archivedTasks);
            });
        });
        });
    });
});