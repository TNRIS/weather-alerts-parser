'use strict';
var test = require('tape');
var fs = require('fs');

var parser = require('../server/parser');

test('count matches', function (t) {
  t.plan(1);

  var readable = fs.createReadStream('files/example.xml');

  parser.parse(readable, function (error, parsed) {
    t.equals(parsed.length, 39);
  });
});


test('errors propogates to callback function', function (t) {
  t.plan(1);

  var readable = fs.createReadStream('files/erroneous.xml');

  parser.parse(readable, function (error, parsed) {
    if (error) {
      t.equals(error.message, 'Not a feed');
    }
  });
});
