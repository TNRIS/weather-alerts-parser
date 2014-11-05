'use strict';

var test = require('tape');
var request = require('supertest');

var app = require('../.dist/server')({'NODE_ENV': 'test'}).app;

test('/', function (t) {

  t.test('GET should return "hi"', function (t2) {
    t2.plan(2);

    request(app)
      .get('/')
      .end(function (err, resp) {
        t2.equals(resp.status, 200);
        t2.equals(resp.text, "hi");
      });
  });
});
