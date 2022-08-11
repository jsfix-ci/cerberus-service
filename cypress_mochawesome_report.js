const { merge } = require('mochawesome-merge');
const marge = require('mochawesome-report-generator');
const rm = require('rimraf');
const ls = require('ls');

const reportDir = 'cypress/report-json';
const reportFiles = `${reportDir}/*.json`;
const reporterOptions = {
  files: [
    reportFiles,
  ],
  reportTitle: 'cerberus-tests',
};
// list all of existing report files
ls(reportFiles, { recurse: true }, (file) => console.log(`removing ${file.full}`));

merge(reporterOptions).then((report) => {
  marge.create(report, reporterOptions);
});
