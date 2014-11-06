'use strict';
var fs = require('fs');
var path = require('path');
var test = require('tape');

var parser = require('../index.js');

test('count matches', function (t) {
  t.plan(1);

  var filepath = path.join(__dirname, 'files/example.xml');
  var readable = fs.createReadStream(filepath);

  parser.parse(readable, function (error, parsed) {
    t.equals(parsed.length, 39);
  });
});


test('errors propogates to callback function', function (t) {
  t.plan(1);

  var filepath = path.join(__dirname, 'files/erroneous.xml');
  var readable = fs.createReadStream(filepath);

  parser.parse(readable, function (error, parsed) {
    if (error) {
      t.equals(error.message, 'Not a feed');
    }
  });
});
