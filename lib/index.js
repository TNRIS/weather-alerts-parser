'use strict';
var es = require('event-stream');
var FeedParser = require('feedparser');
var through = require('through');

var StreamCombiner = require('stream-combiner');

function nestedProperty(obj, keys) {
  if (obj === undefined || keys.length === 0) {
    return obj;
  }
  return nestedProperty(obj[keys[0]], keys.slice(1));
}

function parseItem(item) {
  var obj = {
    url: item.link
  };

  var properties = [
    'atom:published',
    'atom:summary',
    'atom:title',
    'atom:updated',
    'cap:areaDesc',
    'cap:category',
    'cap:certainty',
    'cap:effective',
    'cap:event',
    'cap:expires',
    'cap:msgType',
    'cap:polygon',
    'cap:severity',
    'cap:status',
    'cap:urgency'
  ];

  properties.forEach(function (property) {
    var type = property.split(':')[0];
    var name = property.split(':')[1];
    var feedProperty = type + ':' + name.toLowerCase();
    obj[name] = nestedProperty(item, [feedProperty, '#']);
  });

  if (obj.polygon === undefined) {
    delete obj.polygon;
  }

  var multiValueProperties = [
    'cap:geocode',
    'cap:parameter'
  ];

  multiValueProperties.forEach(function(multiValueProperty) {
    var valuesObj = {};

    var type = multiValueProperty.split(':')[0];
    var name = multiValueProperty.split(':')[1];
    var feedProperty = type + ':' + name.toLowerCase();

    var values = nestedProperty(item, [feedProperty, 'value']);
    var valueNames = nestedProperty(item, [feedProperty, 'valuename']);

    if (!Array.isArray(values)) {
      values = [values];
    }
    if (!Array.isArray(valueNames)) {
      valueNames = [valueNames];
    }

    valueNames.forEach(function (valueName, i) {
      var value = values[i];
      if (value !== undefined) {
        valuesObj[valueName['#']] = value['#'];
      }
    });

    if (Object.keys(valuesObj).length > 0) {
      obj[name] = valuesObj;
    }
  });

  return obj;
}

module.exports = {
  stream: function () {
    var feedparser = new FeedParser();

    var parseStream = through(function(item) {
      this.queue(parseItem(item));
    });

    var s = StreamCombiner(feedparser, parseStream);

    return s;
  },

  parse: function (readableStream, cb) {
    var stream = this.stream();

    var fullStream = readableStream
      .on('error', cb)
      .pipe(stream)
      .on('error', cb)
      .pipe(es.writeArray(cb))
      .on('error', cb);
  }
};
