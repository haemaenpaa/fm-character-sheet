# FmCharacterSheet

FmCharacterSheet is an interactive character sheet for the Frostmark RPG. It is intended as a tool to smoothen the flow of play by automating the dice algebra.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.4.

## Development server

To start a development backend, run `npm run dev` in `server/`.

A dev frontend server will require an environments file that is not provided. To provide Auth0 credentials to the frontend, add a file `client/.env` with the contents

```
API_SERVER_URL=http://localhost:3000
AUTH0_DOMAIN=<YOUR_AUTH0_DOMAIN>
AUTH0_CLIENT_ID=<YOUR_AUTH0_CLIENT_ID>
AUTH0_CALLBACK_URL=http://localhost:4200/callback
```

You can then run `npm start` in `client/` to start a development frontend.

## Building

In order to build a production package, provide the file `client/.production-env` with the following configuration:

```
API_SERVER_URL=<the production server url>
AUTH0_DOMAIN=<Your auth0 production domain>
AUTH0_CLIENT_ID=<your auth0 production client id>
AUTH0_CALLBACK_URL=<the callback url in production>
```

Currently, variables from dev environment will be used if not set in production env.

Finally, run `npm run build` in the root folder to build the packages.

## Attribution

FmCharacterSheet was created by Heikki Mäenpää.

Frostmark was createdy by Rebecka Kjellin. The Frostmark content used in this project is from the [Frostmark RPG Wiki](https://frostmark-rpg.fandom.com/wiki/Frostmark_RPG_Wiki), under Creative Commons Attribution-Share Alike License 3.0.
