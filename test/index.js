'use strict';
var fs = require('fs');
var path = require('path');
var test = require('tape');
var through = require('through');

var parser = require('../lib/index.js');

test('count matches', function (t) {
  t.plan(1);

  var filepath = path.join(__dirname, 'files/multiple.xml');
  var readable = fs.createReadStream(filepath);

  parser.parse(readable, function (error, parsed) {
    t.equals(parsed.length, 39);
  });
});

test('stream interface', function (t) {
  t.plan(1);

  var filepath = path.join(__dirname, 'files/multiple.xml');
  var readable = fs.createReadStream(filepath);

  var parseStream = parser.stream();

  var count = 0;
  var countStream = through(function(item) {
    count++;
    this.queue(item);
  });

  readable.pipe(parseStream).pipe(countStream).on('end', function () {
    t.equals(count, 39);
  });
});


test('parse alert', function (t) {
  var filepath = path.join(__dirname, 'files/single.xml');
  var readable = fs.createReadStream(filepath);

  parser.parse(readable, function (error, parsed) {
    var single = parsed[0];

    t.test('areaDesc is correctly assigned', function (t2) {
      t2.plan(1);
      t2.equals(single.areaDesc, 'Cape Decision to Salisbury Sound Coastal Area; Inner Channels from Kupreanof Island to Etolin Island');
    });

    t.test('category is correctly assigned', function (t2) {
      t2.plan(1);
      t2.equals(single.category, 'Met');
    });

    t.test('certainty is correctly assigned', function (t2) {
      t2.plan(1);
      t2.equals(single.certainty, 'Likely');
    });

    t.test('effective is correctly assigned', function (t2) {
      t2.plan(1);
      t2.equals(single.effective, '2014-11-05T05:25:00-09:00');
    });

    t.test('event is correctly assigned', function (t2) {
      t2.plan(1);
      t2.equals(single.event, 'High Wind Warning');
    });

    t.test('expires is correctly assigned', function (t2) {
      t2.plan(1);
      t2.equals(single.expires, '2014-11-06T00:00:00-09:00');
    });

    t.test('geocode.FIPS6 is correctly assigned', function (t2) {
      t2.plan(1);
      t2.equals(single.geocode.FIPS6, '002105 002195 002198 002220 002275');
    });

    t.test('geocode.UGC is correctly assigned', function (t2) {
      t2.plan(1);
      t2.equals(single.geocode.UGC, 'AKZ023 AKZ026');
    });

    t.test('msgType is correctly assigned', function (t2) {
      t2.plan(1);
      t2.equals(single.msgType, 'Alert');
    });

    t.test('polygon is correctly assigned', function (t2) {
      t2.plan(1);
      t2.equals(single.polygon, '29.75,-101.76 29.82,-101.76 29.82,-101.46 29.62,-101.22 29.54,-101.28 29.73,-101.47 29.75,-101.76');
    });

    t.test('parameter.VTEC is correctly assigned', function (t2) {
      t2.plan(1);
      t2.equals(single.parameter.VTEC, '/X.CON.PAJK.HW.W.0011.141106T0000Z-141106T0900Z/');
    });

    t.test('published is correctly assigned', function (t2) {
      t2.plan(1);
      t2.equals(single.published, '2014-11-05T05:25:00-09:00');
    });

    t.test('severity is correctly assigned', function (t2) {
      t2.plan(1);
      t2.equals(single.severity, 'Severe');
    });

    t.test('summary is correctly assigned', function (t2) {
      t2.plan(1);
      t2.equals(single.summary, '...HIGH WIND WARNING REMAINS IN EFFECT FROM 3 PM THIS AFTERNOON TO MIDNIGHT AKST TONIGHT... * LOCATION...PORTIONS OF THE THE SOUTHERN PANHANDLE INCLUDING SOUTHERN BARANOF ISLAND...KUIU ISLAND...SOUTHERN KUPREANOF ISLAND...ETOLIN ISLAND AND ZAREMBO ISLAND. * WIND...25 TO 40 MPH WITH GUSTS TO AROUND 60 MPH. STRONGEST WINDS IN');
    });

    t.test('status is correctly assigned', function (t2) {
      t2.plan(1);
      t2.equals(single.status, 'Actual');
    });

    t.test('title is correctly assigned', function (t2) {
      t2.plan(1);
      t2.equals(single.title, 'High Wind Warning issued November 05 at 5:25AM AKST until November 06 at 12:00AM AKST by NWS');
    });

    t.test('updated is correctly assigned', function (t2) {
      t2.plan(1);
      t2.equals(single.updated, '2014-11-05T06:25:00-09:00');
    });

    t.test('urgency is correctly assigned', function (t2) {
      t2.plan(1);
      t2.equals(single.urgency, 'Expected');
    });

    t.test('link is correctly assigned', function (t2) {
      t2.plan(1);
      t2.equals(single.link, 'http://alerts.weather.gov/cap/wwacapget.php?x=AK1251776ADAE4.HighWindWarning.125177795010AK.AJKNPWAJK.0b2fbe9c62ef103901a2841f43c56168');
    });
  });
});


test('parse alert with empty polygon', function (t) {
  var filepath = path.join(__dirname, 'files/single-empty-polygon.xml');
  var readable = fs.createReadStream(filepath);

  parser.parse(readable, function (error, parsed) {
    var single = parsed[0];

    t.test('polygon is not assigned', function (t2) {
      t2.plan(2);
      t2.equals(single.polygon, undefined);
      t2.equals(Object.hasOwnProperty(single, 'polygon'), false);
    });
  });
});


test('parse alert with empty geocode and parameters', function (t) {
  var filepath = path.join(__dirname, 'files/single-empty-geocode-and-parameter.xml');
  var readable = fs.createReadStream(filepath);

  parser.parse(readable, function (error, parsed) {
    var single = parsed[0];

    t.test('geocode is not assigned', function (t2) {
      t2.plan(2);
      t2.equals(single.geocode, undefined);
      t2.equals(Object.hasOwnProperty(single, 'geocode'), false);
    });

    t.test('parameter is not assigned', function (t2) {
      t2.plan(2);
      t2.equals(single.parameter, undefined);
      t2.equals(Object.hasOwnProperty(single, 'parameter'), false);
    });
  });
});


test('errors propogates to callback function', function (t) {
  t.plan(1);

  var filepath = path.join(__dirname, 'files/erroneous.xml');
  var readable = fs.createReadStream(filepath);

  parser.parse(readable, function (error, parsed) {
    if (error) {
      t.equals(error.message, 'Not a feed');
    }
  });
});
