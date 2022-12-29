const { writeFile } = require('fs');
const { promisify } = require('util');
const dotenv = require('dotenv');

console.log(process.argv);

const scriptArgs = process.argv.slice(2);

var pathToEnv: string | null = null;
for (var i = 0; i < scriptArgs.length; i++) {
  const arg = scriptArgs[i];
  if (arg === '-f') {
    i++;
    pathToEnv = scriptArgs[i];
  }
}

if (pathToEnv === null) {
  console.info('Using Auth0 credentials from .env');
  dotenv.config();
} else {
  console.info(`Using Auth0 credentials from ${pathToEnv}.`);
  dotenv.config({
    path: pathToEnv,
  });
}

const writeFilePromisified = promisify(writeFile);

const targetPath = './src/environments/environment.ts';

const envConfigFile = `export const environment = {
  production: false,
  auth0: {
    domain: '${process.env['AUTH0_DOMAIN']}',
    clientId: '${process.env['AUTH0_CLIENT_ID']}',
    redirectUri: '${process.env['AUTH0_CALLBACK_URL']}',
  },
  api: {
    serverUrl: '${process.env['API_SERVER_URL']}',
  },
};
`;

(async () => {
  try {
    await writeFilePromisified(targetPath, envConfigFile);
  } catch (err) {
    console.error(err);
    throw err;
  }
})();
