#!/bin/bash
npm install --no-fund --no-audit;

CONNECTION_STRING="sqlite:fm-charcter-sheet.db" node index.js;
