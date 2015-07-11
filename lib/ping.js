var request = require('request'),
  statusCodes = require('http').STATUS_CODES;

var countryCode = '+1',
  mobileNumbers = ['6047632217', '9022971793'],
  message = 'Mumford and Sons is playing!';

/*
    Ping Constructor
*/
function Ping(opts) {
  // holds website to be monitored
  this.website = '';

  // ping intervals in s
  this.interval = 5000;

  // interval handler
  this.handle = null;

  // initialize the app
  this.init(opts)
}

/*
    Methods
*/

Ping.prototype = {

  init: function(opts) {
    var self = this;

    self.website = opts.website;

    self.interval = (opts.interval * 1000);

    // start monitoring
    self.start();
  },

  start: function() {
    var self = this,
      time = Date.now();

    console.log("\nLoading... " + self.website + "\nTime: " + self.getFormatedDate(time) + "\n");

    // create an interval for pings
    self.handle = setInterval(function() {
      self.ping();
    }, self.interval);
  },

  stop: function() {
    clearInterval(this.handle);
    this.handle = null;
  },

  ping: function() {
    var self = this,
      currentTime = Date.now();

    try {
      // send request
      request(self.website, function(err, res, body) {
        // Website is up
        if (!err && res.statusCode === 200) {
          var data = JSON.parse(body);
          console.log(data);
          if (('TPE1' in data && data.TPE1.indexOf('a') > -1) ||
            ('TXXX_next_song' in data && data.TXXX_next_song.indexOf('a') > -1)) {
            console.log('Mumford Detected!');
            for (var i = 0; i < mobileNumbers.length; i++) {
              request.post({
                headers: {
                  'content-type': 'application/x-www-form-urlencoded',
                  'Accepts': 'application/json'
                },
                url: process.env.BLOWERIO_URL + '/messages',
                form: {
                  to: countryCode + mobileNumbers[i],
                  message: message
                }
              }, function(err, res, body) {
                if (!err && res.statusCode == 201) {
                  console.log('Message sent!')
                } else if (err) {
                  console.log(err);
                } else {
                  var apiResult = JSON.parse(body)
                  console.log('Error was: ' + apiResult.message)
                }
              })
            }
          }
        }
      });
    } catch (err) {
      console.log(err);
    }
  },

  getFormatedDate: function(time) {
    var currentDate = new Date(time);

    currentDate = currentDate.toISOString();
    currentDate = currentDate.replace(/T/, ' ');
    currentDate = currentDate.replace(/\..+/, '');

    return currentDate;
  }
}

module.exports = Ping;
