'use strict';
var path = require('path');

var nconf = require('nconf');

module.exports = function (options) {
  var conf = new nconf.Provider();

  conf.overrides(options);

  conf.env(['debug', 'NODE_ENV']);

  process.env.NODE_ENV = conf.get('NODE_ENV') || 'production';

  conf.file('secrets', {
    type: 'file',
    file: path.join(__dirname, 'secrets',  process.env.NODE_ENV + '.json')
  });

  conf.file('default', {
    type: 'file',
    file: path.join(__dirname, 'defaults.json')
  });

  return conf;
};