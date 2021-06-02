#!/usr/bin/env bash

runTestsAndGenerateReport()
{
    echo "== Starting cypress tests =="
    npm run cypress:test:report -- -b electron -c ${CERBERUS_WORKFLOW_SERVICE_URL} -e dev
    TEST_RUN_STATUS=$?
     echo "######## TEST RUN STATUS : TEST_RUN_STATUS #######"
}

getSecrets()
{
    mkdir -p cypress/fixtures/users
    node get_secrets.js
}

setVariables()
{
    REPORT_DATE=$(date +%Y%m%d)
    REPORT_TIME=$(date +%H%M%S)
    S3_BUCKET_LOCATION="s3://${S3_BUCKET_NAME}/test-reports"
    S3_TEST_REPORT="${AUTH_REALM}/cerberus-tests/${REPORT_DATE}/${JOB_NAME}/${REPORT_TIME}"
}

uploadReport()
{
    s3cmd --region=eu-west-2 --access_key=${S3_ACCESS_KEY} --secret_key=${S3_SECRET_KEY} put --recursive mochawesome-report/ ${S3_BUCKET_LOCATION}/${S3_TEST_REPORT}/ --no-mime-magic --guess-mime-type

    REPORT_UPLOAD_STATUS=$?

    echo "######## REPORT UPLOAD STATUS : $REPORT_UPLOAD_STATUS #######"
}

createReportUrl()
{
    REPORT_FULL_URL="${REPORT_BASE_URL}/${S3_TEST_REPORT}/mochawesome.html"
    echo "######## REPORT FULL URL : $REPORT_FULL_URL #######"
}

createSlackMessage()
{
    if [[ ${TEST_RUN_STATUS} == 0 ]] && [[ ${REPORT_UPLOAD_STATUS} == 0 ]]; then
        SLACK_TEST_STATUS=" Test Execution *Successful*"
        SLACK_COLOR="good"
    else
        SLACK_TEST_STATUS=" Test Execution *Failed*"
        SLACK_COLOR="danger"
    fi

    SLACK_FALLBACK="${SLACK_TEST_STATUS} on ${AUTH_REALM}\nTest Execution Report URL - ${REPORT_FULL_URL}"
    SLACK_TEXT="${SLACK_TEST_STATUS} on ${AUTH_REALM}"

    if [[ ! -z "$DRONE_BUILD_NUMBER" ]]; then
        SLACK_TEXT+="\nBuild number *${DRONE_BUILD_NUMBER}*"
    fi

    echo "###### Slack Message :: ${SLACK_FALLBACK}"
}

sendSlackMessage()
{
    curl -X POST --data-urlencode \
    "payload={
           \"channel\": \"#cop-test-report\",
           \"username\": \"Cerberus Tests\",
           \"attachments\":
                [
					{
						\"fallback\": \"${SLACK_FALLBACK}\",
						\"text\": \"${SLACK_TEXT}\",
						\"color\": \"${SLACK_COLOR}\",
						\"title\": \"Cerberus Test Report\",
						\"title_link\": \"${REPORT_FULL_URL}\",
						\"mrkdwn_in\": [\"text\", \"pretext\"]
					}
				]
        }" ${SLACK_WEB_HOOK}
}

checkFailTest(){
    if [[ ${TEST_RUN_STATUS} != 0 ]]; then
        exit 1
    fi
}

getSecrets
setVariables
runTestsAndGenerateReport
uploadReport
createReportUrl
createSlackMessage
sendSlackMessage
checkFailTest