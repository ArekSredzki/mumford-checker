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
  this.interval = 15;

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

    self.interval = (opts.timeout * (1000));

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
    }, self.timeout);
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
      request(self.website, function(error, res, body) {
        // Website is up
        if (!error && res.statusCode === 200) {
          if (body.TPE1.indexOf('Mumford') > -1) {
            // Mumford detected!!
            request.post({
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Accepts': 'application/json'
              },
              url: process.env.BLOWERIO_URL + '/messages',
              form: {
                to: countryCode + mobileNumber,
                message: message
              }
            }, function(error, response, body) {
              if (!error && response.statusCode == 201) {
                console.log('Message sent!')
              } else {
                var apiResult = JSON.parse(body)
                console.log('Error was: ' + apiResult.message)
              }
            })
          }
        }
      });
    } catch (err) {
      console.error(err);
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
