'use strict';

var request = require('request');
var es = require('event-stream');
var parser = require('../lib/index.js');

request.get('http://alerts.weather.gov/cap/us.php?x=1')
  .pipe(parser.stream())
  .pipe(es.stringify())
  .pipe(process.stdout);
