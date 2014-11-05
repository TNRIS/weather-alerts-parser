'use strict';
var test = require('tape');
var fs = require('fs');

var parser = require('../server/parser');

test('parser', function (t) {

  t.plan(1);

  var readable = fs.createReadStream('files/example.xml');

  parser.parse(readable, function (parsed) {
    t.equals(parsed.length, 39);
  });
});
