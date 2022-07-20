const cypress = require('cypress');
const yargs = require('yargs');
const { merge } = require('mochawesome-merge');
const marge = require('mochawesome-report-generator');
const rm = require('rimraf');
const ls = require('ls');
const cypressConfig = require('./cypress.json');

const argv = yargs.options({
  browser: {
    alias: 'b',
    describe: 'choose browser that you wanna run tests on',
    default: 'chrome',
    choices: ['chrome', 'electron', 'firefox'],
  },
  spec: {
    alias: 's',
    describe: 'run test with specific spec file',
    default: 'cypress/integration/cerberus/*.js',
  },
  cerberusServiceUrl: {
    alias: 'c',
    describe: 'Cerberus Service URL',
  },
  formApiUrl: {
    alias: 'f',
    describe: 'Form API URL',
  },

}).help()
  .argv;

const reportDir = cypressConfig.reporterOptions.reportDir;

const reportFiles = `${reportDir}/*.json`;
// list all of existing report files
ls(reportFiles, { recurse: true }, (file) => console.log(`removing ${file.full}`));

// delete all existing report files
rm(reportFiles, (error) => {
  if (error) {
    console.error(`Error while removing existing report files: ${error}`);
    process.exit(1);
  }
  console.log('Removing all existing report files successfully!');
});

function generateReport(options, results) {
  return merge(options).then((report) => {
    marge.create(report, options).then(() => {
      if (results.totalFailed !== 0) {
        process.exit(1);
      } else {
        process.exit(0);
      }
    });
  });
}

cypress.run({
  browser: argv.browser,
  spec: argv.spec,
  env: {
    cerberusServiceUrl: argv.cerberusServiceUrl,
    formApiUrl: argv.formApiUrl,
  },
}).then((results) => {
  const reporterOptions = {
    files: [
      `${results.config.reporterOptions.reportDir}/*.json`,
    ],
    reportTitle: 'cerberus-tests',
  };
  generateReport(reporterOptions, results);
}).catch((error) => {
  console.error('errors: ', error);
  process.exit(1);
});
