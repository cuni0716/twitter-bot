import Twitter from 'twitter';
import moment from 'moment';

import { calculateRating } from './helpers';


if (!process.env.TWITTER_CONSUMER_SECRET) {
  console.log('Missing environment vars, stoping...');
  process.exit();
}

const TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY;
const TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET;
const TWITTER_ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN;
const TWITTER_ACCESS_TOKEN_SECRET = process.env.TWITTER_ACCESS_TOKEN_SECRET;
const TWITTER_SEARCH_PHRASE = '#reduxjs OR #ecmascript OR #expressjs OR #reactjs OR #nodejs';
const TWO_HOURS = 1000;
const TWO_HOURS = 120 * 60 * 1000;
const RESULT_TYPE = 'recent';
const LANG = 'en';
const RETWEETED = [];

const Bot = new Twitter({
  consumer_key: TWITTER_CONSUMER_KEY,
  consumer_secret: TWITTER_CONSUMER_SECRET,
  access_token_key: TWITTER_ACCESS_TOKEN,
  access_token_secret: TWITTER_ACCESS_TOKEN_SECRET
});

console.log('---> Bot is up and running!');

function Retweet() {

  const actualHour = moment().format('HH');

  // if (Number(actualHour) < 8) return console.log('Bot could not retweet, too late');

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
      const rating = calculateRating(twit);
      if (rating > bestOne.rating && !RETWEETED.includes(twit.id)) {
        bestOne = { rating, id: twit.id_str };
        RETWEETED.push(twit.id);
      }
    });

    Bot.post(`statuses/retweet/${bestOne.id}.json`, { id: bestOne.id }, (error, response) => {
      if (error) return console.log('Bot could not retweet', bestOne, error);

      console.log(`Bot retweeted ${bestOne.id} with rating ${bestOne.rating}`);
      console.log(`In this session we already retweet ${RETWEETED.length} tweets`);
    });

  });

}

setInterval(Retweet, TWO_HOURS);
