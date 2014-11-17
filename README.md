Weather Alerts Parser
=====================

A streaming parser for National Weather Service alerts


Usage
=====

Pipe a stream of the NWS atom feed to `.stream()` to convert it into alert
objects.


For example, this will print alert objects to stdout:

    var es = require('event-stream');
    var parser = require('weather-alerts-parser');
    var request = require('request');

    request.get('http://alerts.weather.gov/cap/us.php?x=1')
      .pipe(parser.stream())
      .pipe(es.stringify())
      .pipe(process.stdout);


You can also stream them into other things, like files. See
[weather-alerts-geojson](https://github.com/TNRIS/weather-alerts-geojson) if you
want to convert these bad boys to geojson.
