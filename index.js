var express = require('express');
var EventEmitter = require('events');
var util = require('util');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var Twitter = require('twitter');
var countriesIso = require('./public/countries_iso3.json');
var calculateHexaColor = require('./trend').calculateHexaColor;

server.listen(3000);
app.use('/public', express.static('public'));
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

// twitter setup
var client = new Twitter(require('./config'));
function TweetEmitter() {
  EventEmitter.call(this);
}
util.inherits(TweetEmitter, EventEmitter);

var tweetEmitter = new TweetEmitter();

client.stream('statuses/sample', function(stream) {
  stream.on('data', function(tweet) {
    if (tweet.place) {
      tweetEmitter.emit('tweet', {
        id: tweet.id_str,
        user: tweet.user.screen_name,
        text: tweet.text,
        color: calculateHexaColor(tweet),
        countryCode: countriesIso[tweet.place.country_code]
      });
    }
  });
  stream.on('error', function(err) {
    console.log(err);
  });
});

tweetEmitter.on('tweet', function(tweet) {
  // emit to client
  io.emit('tweet', tweet);
});
