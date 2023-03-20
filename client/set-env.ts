const { writeFile } = require('fs');
const { promisify } = require('util');
const dotenv = require('dotenv');

(async () => {
  try {
    dotenv.config();
    const writeFilePromisified = promisify(writeFile);

    const envPath = './src/environments/environment.ts';
    const prodEnvPath = './src/environments/environment.prod.ts';

    var envConfigFile = `export const environment = {
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
    await writeFilePromisified(envPath, envConfigFile);

    dotenv.config({ path: '.production-env', override: true });
    envConfigFile = `export const environment = {
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
    await writeFilePromisified(prodEnvPath, envConfigFile);
  } catch (err) {
    console.error(err);
    throw err;
  }
})();
