import Twitter from 'twitter';
import { calculateRating } from './helpers';


const {
  TWITTER_CONSUMER_KEY: consumer_key,
  TWITTER_CONSUMER_SECRET: consumer_secret,
  TWITTER_ACCESS_TOKEN: access_token_key,
  TWITTER_ACCESS_TOKEN_SECRET: access_token_secret,
} = process.env;

const TWITTER_SEARCH_PHRASE = '#reduxjs OR #ecmascript OR #expressjs OR #reactjs OR #nodejs';
const TWO_HOURS = 120 * 60 * 1000;
const COUNT = 100;
const RESULT_TYPE = 'recent';
const LANG = 'en';
const RETWEETED = [];

const Bot = new Twitter({
  consumer_key,
  consumer_secret,
  access_token_key,
  access_token_secret,
});

console.log('---> Bot is up and running!');

function Retweet() {
  const query = {
    q: TWITTER_SEARCH_PHRASE,
    count: COUNT,
    result_type: RESULT_TYPE,
    lang: LANG,
  };

  Bot.get('search/tweets', query, (error, data) => {
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

    return Bot.post(`statuses/retweet/${bestOne.id}.json`, { id: bestOne.id }, (err) => {
      if (err) return console.log(`Bot could not retweet id ${bestOne.id}. REASON: ${err[0].message}`);

      console.log(`Bot retweeted ${bestOne.id} with rating ${bestOne.rating}`);
      console.log(`In this session we already retweet ${RETWEETED.length} tweets`);
      return null;
    });
  });
}

Retweet();

setInterval(Retweet, TWO_HOURS);
