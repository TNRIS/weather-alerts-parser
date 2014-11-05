'use strict';
var FeedParser = require('feedparser');


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
        alerts.push(item);
      }
    });

    readableStream.pipe(feedparser);
  }
};
