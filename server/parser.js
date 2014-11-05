'use strict';
var FeedParser = require('feedparser');


module.exports = {
  parse: function (readableStream, cb) {
    var alerts = [];

    var feedparser = new FeedParser();

    feedparser.on('end', function () {
      cb(alerts);
    });


    feedparser.on('error', function done(err) { 
      if (err) { 
        console.log(err, err.stack); 
      } 
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
