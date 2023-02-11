FROSTMARK CHARACTER SHEET

This provides a server for an online character sheet for the Frostmark RPG.

Running the server:

In order to run the server, you will need Node.js. You can download it from https://nodejs.org/en/

After installing, run either run-server.bat (on Windows) or run-server.sh (on Linux and maybe Mac). This will install the dependencies that could not be bundled, then run the server.

By default, the server uses sqlite for the database, which will be stored in the filefm-charcter-sheet.db. The server uses sequelize to interface with the database, and reads the connection string from 
the CONNECTION_STRING environment variable. Providing a different connection string and installing the appropriate node module should support most other databases.

License:

This software is provided under the Attribution-ShareAlike 4.0 International license.