'use strict';

var util = require('util');
var PassThrough = require('stream').PassThrough;

var StreamCombiner = function() {
  this.streams = Array.prototype.slice.apply(arguments);

  this.on('pipe', function(source) {
    source.unpipe(this);
    this.streams.forEach(function (stream) {
      source = source.pipe(stream);
    });
    this.transformStream = source;
  });
};

util.inherits(StreamCombiner, PassThrough);

StreamCombiner.prototype.pipe = function(dest, options) {
  return this.transformStream.pipe(dest, options);
};


module.exports = StreamCombiner;
