Weather Alerts Parser
=====================

A streaming parser for National Weather Service alerts.

Usage
=====

Pipe a stream of the NWS atom feed to `.stream()` to convert it into alert
objects.


For example, this will print alert objects to stdout:

```node
var es = require('event-stream');
var fs = require('fs');
var parser = require('weather-alerts-parser');
var request = require('request');

request.get('http://alerts.weather.gov/cap/us.php?x=1')
  .pipe(parser.stream())
  .pipe(es.stringify())
  .pipe(process.stdout);
```

You can also stream them into other things, like files. See
[weather-alerts-geojson](https://github.com/TNRIS/weather-alerts-geojson) if you
want to convert these bad boys to geojson.


Attributes
==========

Most of the attributes are self-explanatory, but you may want to review the
official information on how to interpret alert attributes, from the [CAP v1.1
specification](https://www.oasis-open.org/committees/download.php/14759/emergency-CAPv1.1.pdf).
