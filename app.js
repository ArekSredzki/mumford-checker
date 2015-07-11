var Ping = require('./lib/ping'),
  http = require('http'),
  server,
  port = process.env.PORT || 3008,
  urls = [],
  monitors = [];

var monitor = new Ping({
  website: 'http://ckpk.streamon.fm/metadata/events/CKPK-48k.json',
  interval: '5' // seconds
});


server = http.createServer(function(req, res) {
  var data = "Monitoring for Mumford!";

  res.end(data);
});


server.listen(port);
console.log('Listening to port %s', port);
