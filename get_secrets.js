const fs = require('fs');

const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require('@aws-sdk/client-secrets-manager');

const env = process.env;

const cerberusUser = 'cypressuser-cerberus@lodev.xyz';

if (!('AWS_ACCESS_KEY_ID' in env)) {
  console.log("You must set: 'AWS_ACCESS_KEY_ID'");
  process.exit(1);
}

if (!('AWS_SECRET_ACCESS_KEY' in env)) {
  console.log("You must set: 'AWS_SECRET_ACCESS_KEY'");
  process.exit(1);
}

if (!('AWS_REGION' in env)) {
  env.AWS_REGION = 'eu-west-2';
}

if (!('TEST_SECRET_NAME' in env)) {
  env.TEST_SECRET_NAME = '/test/local';
}

async function getSecret() {
  const client = new SecretsManagerClient({
    region: 'eu-west-2',
  });

  const getSecretValueResponse = await client.send(
    new GetSecretValueCommand({ SecretId: env.TEST_SECRET_NAME }),
  );

  const secret = 'SecretString' in getSecretValueResponse ? getSecretValueResponse.SecretString : Buffer.from(getSecretValueResponse.SecretBinary, 'base64');

  return JSON.parse(secret);
}

getSecret().then((secret) => {
  if (secret.users) {
    const testUser = secret.users.find((user) => user.username === cerberusUser);

    fs.writeFileSync(
      `${__dirname}/cypress/fixtures/users/${testUser.username}.json`,
      JSON.stringify(testUser),
      { flag: 'w' },
    );
  }
});
