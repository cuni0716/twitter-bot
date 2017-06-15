import twitter from 'twitter';
import moment from 'moment';


if (process.env.APP_ENV === 'local') require('dotenv').config();

const TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY;
const TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET;
const TWITTER_ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN;
const TWITTER_ACCESS_TOKEN_SECRET = process.env.TWITTER_ACCESS_TOKEN_SECRET;
const TWITTER_SEARCH_PHRASE = '#nodejs OR #expressjs OR #reactjs OR #ecmascript OR reduxjs';
const INTERVAL = 120 * 60 * 1000;
const COUNT = 100;
const RESULT_TYPE = 'recent';
const LANG = 'en';
const RETWEETED = [];

const Bot = twitter({
  consumer_key: TWITTER_CONSUMER_KEY,
  consumer_secret: TWITTER_CONSUMER_SECRET,
  access_token_key: TWITTER_ACCESS_TOKEN,
  access_token_secret: TWITTER_ACCESS_TOKEN_SECRET
});

console.log('---> Bot is up and running!');

function Retweet() {

  const actualHour = moment().format('HH');

  if (Number(actualHour) > 23 || Number(actualHour) < 8) return console.log('Bot could not retweet, too late');

  const query = {
    q: TWITTER_SEARCH_PHRASE,
    count: COUNT,
    result_type: RESULT_TYPE,
    lang: LANG
  };

  Bot.get('search/tweets', query, (error, data, response) => {
    if (error) return console.log('Bot could not find tweets', error);

    const tweets = data.statuses;
    let bestOne = { rating: 0, id: null };

    tweets.forEach((twit) => {
      const rating = (twit.retweet_count || 0) + (twit.favourite_count || 0);
      if (rating > bestOne.rating && !RETWEETED.includes(twit.id)) {
        bestOne = { rating, id: twit.id_str };
        RETWEETED.push(twit.id);
      }
    });

    Bot.post(`statuses/retweet/${bestOne.id}.json`, { id: bestOne.id }, (error, response) => {
      if (error) return console.log('Bot could not retweet', bestOne, error);

      console.log(`Bot retweeted ${bestOne.id}`);
    });

  });

}

setInterval(Retweet, INTERVAL);
