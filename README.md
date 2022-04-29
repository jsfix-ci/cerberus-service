# cerberus-service
Cerberus frontend service for cerberus-api

## Requirements
* npm 6.14.15
* node v14.18.1

## Index
- [cerberus-service](#cerberus-service)
  - [Requirements](#requirements)
  - [Index](#index)
  - [Terminology](#terminology)
  - [Getting started](#getting-started)
    - [Native development](#native-development)
    - [Development with docker](#development-with-docker)
  - [Tests in native development](#tests-in-native-development)
  - [Linter in native development](#linter-in-native-development)
  - [E2E tests in native development](#e2e-tests-in-native-development)
      - [Setup Environment to run the tests against different environment from local machine](#setup-environment-to-run-the-tests-against-different-environment-from-local-machine)
      - [Running cypress test runner](#running-cypress-test-runner)
      - [Running cypress tests using the command line](#running-cypress-tests-using-the-command-line)
  - [Branching Strategy](#branching-strategy)

----

## Terminology
Terms used in relation to "tasks"
* businessKey - the unique ID for a "Target Task provided to a Targeter/FLO member of staff"
* processInstance - common information returned from Camunda about a process, related to a businessKey
* target - data related to a processInstance
* version - a version of the target data, originating from Cerberus, related to a processInstance

Terms used for variables that contain results of GET requests from Camunda
* GET /task -> taskResponse : common Camunda information e.g. assignee
* GET /history/variable-instance -> variableInstanceResponse : target specific information, including versions
* GET /history/user-operation -> operationsHistoryResponse : activity related to a process instance e.g. claim/unclaim
* GET /history/task -> taskHistoryResponse : activity on a processInstance, e.g. start time, assignee added

----

## Getting started

**1. Clone this repo**

### Native development
**2. Install dependencies**
```sh
npm install
```
**3. Build development bundle** *(optional)*
```sh
npm run build:dev
```
**4. Start the application** *(optional)*
To run locally pointing at the dev environment you will need the following:

```sh
nvm use 14.18.1
```

Assuming you have nvm installed to manage your node versions of course!

```sh
  \
  REACT_APP_AUTH_CLIENT_ID=your-client-id \
  FORM_API_URL=https://form-api.example.com/ \
  REFDATA_API_URL=https://refdata-api.example.com/ \
  KEYCLOAK_AUTH_URL=https://your.sso.com/auth \
  KEYCLOAK_CLIENT_ID=your-client-id \
  KEYCLOAK_REALM=realm \
  CERBERUS_API_URL=https://cerberus-api.example.com/ \
  npm run start
```

All the variables above need to be replaced with the actual value. The leading slash
is important, for some reason if it is not included you will be told you are not authorized to
view any tasks when you log into the running UI!

### Development with docker
**2. Build the application Docker container**
```sh
docker build -t cerberus-service .
```
**3. Run the resulting Docker container**
```sh
docker run --name cerberus-service -p 8080:8080 \
  --env KEYCLOAK_AUTH_URL=https://sso-dev.notprod.homeoffice.gov.uk/auth \
  --env KEYCLOAK_CLIENT_ID=cerberus \
  --env KEYCLOAK_REALM=cop-local \
  --env FORM_API_URL=https://form-api-server.dev.cop.homeoffice.gov.uk \
  --env REFDATA_API_URL=https://api.dev.refdata.homeoffice.gov.uk \
  --env CERBERUS_API_URL=https://workflow-service.dev.cerberus.cop.homeoffice.gov.uk/camunda/ \
  cerberus-service
```

## Tests in native development

Setup your environment as described in [Native development](#native-development)

**4. Running jest tests**
```sh
npm test
```

## Linter in native development

Setup your environment as described in [Native development](#native-development)

**5. Running linter**
```sh
npm run lint -- <directory>
```

## E2E tests in native development

Set up your environment as described in [Native development](#native-development)

run script ./scripts/env-setup.sh to generate users credentials

There are two ways to run cypress tests, using the cypress test runner or running cypress tests using the command line.

By default, tests run against local environment.

**NOTE:** You will need, the [cerberus-service](https://github.com/UKHomeOffice/cerberus-service) application, to be running before triggering Cypress.

#### Setup Environment to run the tests against different environment from local machine
```sh
./scripts/env-setup.sh {dev, sit , staging}
```

#### Running cypress test runner
Running all tests
```sh
npm run cypress:runner
```

Running all tests using environment settings from a configuration file
```sh
npm run cypress:runner
```
Once TestRunner launched, click on the interested spec inside folder cypress/integration/cerberus

#### Running cypress tests using the command line

Running all tests on local Environment, (It executes tests headless mode on Electron Browser)
```sh
source .env
npm run cypress:test:local
```

Running all tests on Development Environment, (It executes tests headless mode on Electron Browser)
```sh
npm run cypress:test:dev
```

Running a specific test
```sh
npm run cypress:test:local -- --spec cypress/integration/cerberus/tasks.spec.js
```

Running specific test with chrome browser
```sh
npm run cypress:test:local -- --browser chrome --spec cypress/integration/cerberus/task-management.spec.js
```

Running All tests and generating mochawesome html report with screenshots
run the command for specific environment to get the required baseUrl & keycloak authentication 
```sh
./scripts/env-setup.sh {dev, sit , staging}
```
```sh
npm run cypress:test:report -- -b chrome -c ${CERBERUS_WORKFLOW_SERVICE_URL} -f ${FORM_API_URL}
```

Running specific test and generating mochawesome html report with screenshots
```sh
npm run cypress:test:report -- -b chrome -s cypress/integration/cerberus/login.spec.js
```

Running all tests and generating mochawesome html report with screenshots using script
export CERBERUS_WORKFLOW_SERVICE_URL=xxxxx
export FORM_API_URL=xxxx
export TEST_ENV= dev / sit / staging
```sh
./scripts/run_tests.sh
```

## Branching Strategy

1. Any story worked on is worked on a feature branch with the prefix of the JIRA ticket number e.g. `COP-1234`.
2. When each story is completed, a PR is raised, it gets reviewed and once approved, it is then merged into the `develop` branch.
3. Any push to the `develop` branch would then automatically get deployed into the `dev` environment so it can be tested.
4. Over the course of a sprint, the `develop` branch will have all the tickets intended for an upcoming release merged into it.
5. At the end of the sprint, the `develop` branch will then be merged into the `main` branch.

    a. At this point, stories for the next sprint can start going into the `develop` branch.

    b. If we have any bug fixes for a release that is currently in testing, a PR can be raised against the `main` branch.

    c. Once the PR for a bug fix has been approved and merged into the `main` branch, the `develop` should be rebased to ensure it also gets the bug fix.

6. Once testing is completed and signed off, the `main` branch will be tagged with the release number.
7. The release can then be performed from the `main` branch (or the `tag`).
