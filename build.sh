#!/usr/bin/env bash

cd client/
npm install
npm run-script build
cd ../server
npm install
npm run-script start2
