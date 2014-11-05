Weather Alerts
==============

A web app that serves alerts from the National Weather Service as geojson


Requirements
------------

- nodejs


Setup
-----

First, run `npm install` to get the requisite node modules.


Usage
-----

Get cooking with these `npm run` tasks:

`npm run watch` will start building a development distribution and keep it up to
date when files are edited. This should be run in one terminal, then in a
seperate terminal run `npm run start` or `npm run debug`.

`npm run start` will start run the app server in dev mode, reachable at
[http://localhost:8000](http://localhost:8000).
Any changes to server code the will automatically restart the app.

`npm run debug` similar to `npm run start`, but runs the app in debug mode. This
is intended to be used with
[node-inspector](https://github.com/node-inspector/node-inspector) also running
so app can be inspected via breakpoints and **debugger** statements.

`npm run production-dist` will make a distribution suitable for deploying to
production environments. A self-contained build of the appplication will be
created and placed in `.dist/`

`npm run test` will run the test suite.
