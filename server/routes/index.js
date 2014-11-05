'use strict';
var express = require('express');

module.exports = function (staticDir) {
  var router = express.Router();

  router.use(express.static(staticDir));

  router.get('/', function(req, res) {
    res.send('hi');
  });

  return router;
};