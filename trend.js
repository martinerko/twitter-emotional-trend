var _uniq = require('lodash.uniq');
var lexiconData = require('fs').readFileSync(__dirname + '/public/Maxdiff-Twitter-Lexicon_0to1.txt', 'utf8');

// convert lexicon data into map of words with score
var emotionalScore = lexiconData.split(/\r?\n/g).reduce(function(res, line) {
  var data = line.split(/\t/);
  res[data[0]] = +data[1];
  return res;
}, {});

var knownTokens = Object.keys(emotionalScore);

function parseTokens(tweet) {
  var hashtags = tweet.entities.hashtags.map(function(h) {
    return h.text.toLowerCase();
  });
  var words = tweet.text.split(/\s+/).map(function(w) {
    return w.toLowerCase();
  });

  // list of uniq idenified tokens
  return _uniq(hashtags.concat(words)).filter(function(t) {
    return ~knownTokens.indexOf(t);
  });
}

function calculateScore(tweet) {
  var tokens = parseTokens(tweet);
  // if we could not identified any tokens, we return middle mode
  if (!tokens.length) {
    return 0.5;
  }

  var score = tokens.reduce(function(total, t) {
    return total + emotionalScore[t];
  }, 0);

  // percentage score
  return 100 / tokens.length * score;
}

function calculateHexaColor(tweet) {
  var tweetScore = calculateScore(tweet);
  var colorScore = Math.round(15 * tweetScore / 100).toString(16).toUpperCase();

  // hex websafe color
  return '#FF' + colorScore + colorScore + '00';
}

module.exports = {
  calculateScore: calculateScore,
  calculateHexaColor: calculateHexaColor
};
