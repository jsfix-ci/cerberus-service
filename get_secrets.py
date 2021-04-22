#!/usr/bin/env python
import boto3
import base64
import json
import os
import subprocess
from botocore.exceptions import ClientError
from flatten_dict import flatten

# Import environment settings
env = os.environ.copy()

## Check Environment is setup
if not 'AWS_ACCESS_KEY_ID' in env:
    print("You must set: 'AWS_ACCESS_KEY_ID'")
    exit(1)

if not 'AWS_SECRET_ACCESS_KEY' in env:
    print("You must set: 'AWS_SECRET_ACCESS_KEY'")
    exit(1)

if not 'AWS_REGION' in env:
    env['AWS_REGION'] = "eu-west-2"

if not 'TEST_SECRET_NAME' in env:
    env['TEST_SECRET_NAME'] = "/test/local"


def get_secret():
    # Create a Secrets Manager client
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=env['AWS_REGION']
    )
    # In this sample we only handle the specific exceptions for the 'GetSecretValue' API.
    # See https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    # We rethrow the exception by default.
    try:
        get_secret_value_response = client.get_secret_value(
            SecretId=env['TEST_SECRET_NAME']
        )
    except ClientError as e:
        if e.response['Error']['Code'] == 'DecryptionFailureException':
            # Secrets Manager can't decrypt the protected secret text using the provided KMS key.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response['Error']['Code'] == 'InternalServiceErrorException':
            # An error occurred on the server side.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response['Error']['Code'] == 'InvalidParameterException':
            # You provided an invalid value for a parameter.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response['Error']['Code'] == 'InvalidRequestException':
            # You provided a parameter value that is not valid for the current state of the resource.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response['Error']['Code'] == 'ResourceNotFoundException':
            # We can't find the resource that you asked for.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response['Error']['Code'] == 'ExpiredTokenException':
            # AWS Assume role token expired
            raise e
        elif e.response['Error']['Code'] == 'InvalidSignatureException':
            # AWS Assume role mismatch on session token
            raise e
        else:
            raise e

    if 'SecretString' in get_secret_value_response:
        secret = get_secret_value_response['SecretString']
    else:
        secret = base64.b64decode(get_secret_value_response['SecretBinary'])

    return json.loads(secret)


for key, value in get_secret().items():
    if key == 'users':
        for user in value:
            if user['username'] == 'cypressuser-cerberus@lodev.xyz':
                with open('cypress/fixtures/users/' + user['username'] + '.json', 'w+') as json_file:
                    json.dump(user, json_file)
    else:
        for k2, v2 in flatten(value, reducer='underscore').items():
            env[k2.upper()] = v2


