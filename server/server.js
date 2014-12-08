var express = require('express');

var app = express();

app.get('/', function(req, res) {
  'use strict';
  res.send('Hello world!');
});

var server = app.listen(3030, function() {
  'use strict';
  var host =  server.address().address;
  var port = server.address().port;
  console.log('http://%s:%s', host, port);
});
