'use strict';

var _twitter = require('twitter');

var _twitter2 = _interopRequireDefault(_twitter);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (!process.env.TWITTER_CONSUMER_SECRET) {
  console.log('Missing environment vars, stoping...');
  process.exit();
}

var TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY;
var TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET;
var TWITTER_ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN;
var TWITTER_ACCESS_TOKEN_SECRET = process.env.TWITTER_ACCESS_TOKEN_SECRET;
var TWITTER_SEARCH_PHRASE = '#nodejs OR #expressjs OR #reactjs OR #ecmascript OR reduxjs';
var INTERVAL = 120 * 60 * 1000;
var COUNT = 100;
var RESULT_TYPE = 'recent';
var LANG = 'en';
var RETWEETED = [];

var Bot = (0, _twitter2.default)({
  consumer_key: TWITTER_CONSUMER_KEY,
  consumer_secret: TWITTER_CONSUMER_SECRET,
  access_token_key: TWITTER_ACCESS_TOKEN,
  access_token_secret: TWITTER_ACCESS_TOKEN_SECRET
});

console.log('---> Bot is up and running!');

function Retweet() {

  var actualHour = (0, _moment2.default)().format('HH');

  if (Number(actualHour) > 23 || Number(actualHour) < 8) return console.log('Bot could not retweet, too late');

  var query = {
    q: TWITTER_SEARCH_PHRASE,
    count: COUNT,
    result_type: RESULT_TYPE,
    lang: LANG
  };

  Bot.get('search/tweets', query, function (error, data, response) {
    if (error) return console.log('Bot could not find tweets', error);

    var tweets = data.statuses;
    var bestOne = { rating: 0, id: null };

    tweets.forEach(function (twit) {
      var rating = (twit.retweet_count || 0) + (twit.favourite_count || 0);
      if (rating > bestOne.rating && !RETWEETED.includes(twit.id)) {
        bestOne = { rating: rating, id: twit.id_str };
        RETWEETED.push(twit.id);
      }
    });

    Bot.post('statuses/retweet/' + bestOne.id + '.json', { id: bestOne.id }, function (error, response) {
      if (error) return console.log('Bot could not retweet', bestOne, error);

      console.log('Bot retweeted ' + bestOne.id);
    });
  });
}

setInterval(Retweet, INTERVAL);