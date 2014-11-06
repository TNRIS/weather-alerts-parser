'use strict';
var FeedParser = require('feedparser');


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
  parse: function (readableStream, cb) {
    var alerts = [];

    var feedparser = new FeedParser();

    feedparser.on('end', function () {
      cb(null, alerts);
    });


    feedparser.on('error', function done(err) {
      cb(err);
    });

    feedparser.on('readable', function() {
      var stream = this,
          item;

      while (item = stream.read()) {
        var obj = parseItem(item);
        alerts.push(obj);
      }
    });

    readableStream.pipe(feedparser);
  }
};
