'use strict';

var request = require('request');
var es = require('event-stream');
var parser = require('../lib/index.js');

request.get({
  url: 'https://alerts.weather.gov/cap/us.php?x=1',
  headers: {
    // The request will fail with a 403 Forbidden status code if User-Agent is
    // empty, so we need to set one. Anything works.
    'User-Agent': 'lol',
  }
})
  .pipe(parser.stream())
  .pipe(es.stringify())
  .pipe(process.stdout);
