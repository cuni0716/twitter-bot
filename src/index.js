const Twitter = require('twitter');
const format = require('date-fns/format');
const addHours = require('date-fns/add_hours');


const ENV = process.env.APP_ENV || 'development';
const TWITTER_INTERESTS = ['reduxjs', 'ecmascript', 'expressjs', 'reactjs', 'nodejs'];
const TWITTER_SEARCH_PHRASE = TWITTER_INTERESTS.map(item => `#${item}`).join(' OR ');
const RETWEET_WEIGHT = 2;
const FAVOURITE_WEIGHT = 4;
const ONE_HOUR = 60 * 60 * 1000;
const THREE_HOURS = 180 * 60 * 1000;
const COUNT = 100;
const RESULT_TYPE = 'recent';
const LANG = 'en';
const DISCARDED = [];

const bot = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

const QUERY = {
  q: TWITTER_SEARCH_PHRASE, count: COUNT, result_type: RESULT_TYPE, lang: LANG,
};

const time = () => format(addHours(new Date(), 1), 'DD-MM-YYYY HH:mm:ss');

const randomTime = () => Math.floor((Math.random() * THREE_HOURS) + ONE_HOUR);

const prepareNewRetweet = () => {
  const delay = randomTime();
  const nextRetweetDate = new Date(Date.now() + delay);
  const formattedDate = format(addHours(nextRetweetDate, 1), 'HH:mm:ss');
  console.log(`${time()} --- [ INFO ] Next retweet will be at ${formattedDate}`);
  return setTimeout(Retweet, delay);
};

console.log(`${time()} --- [ INFO ] Bot is up and running!\n`);

const Retweet = async () => {
  const result = await bot.get('search/tweets', QUERY).catch(console.log);

  if (!result) return prepareNewRetweet();

  const tweets = result.statuses;
  const bestOne = { rating: 0 };

  tweets.forEach((twit) => {
    const rating = calculateRating(twit);
    if (isBetter(twit, rating, bestOne)) {
      bestOne.tweetId = twit.id_str;
    }
  });

  if (ENV === 'production') {
    const retweet = await bot.post(`statuses/retweet/${bestOne.tweetId}`, { id: bestOne.tweetId }).catch(console.log);
    if (!retweet) return Retweet();
    console.log(`${time()} --- [ RETWEET ] id: ${retweet.id_str} rating: ${bestOne.rating}`);
  } else {
    console.log(`${time()} --- [ RETWEET ] SKIPPED BECAUSE IT'S NOT PRODUCTION`);
  }

  DISCARDED.push(bestOne.tweetId);

  return prepareNewRetweet();
};

Retweet();


const calculateRating = (twit) => {
  if (twit.retweeted) return 0;
  const retweets = (twit.retweet_count || 0) * RETWEET_WEIGHT;
  const favourites = (twit.favorite_count || 0) * FAVOURITE_WEIGHT;
  return retweets + favourites;
};

const isBetter = (twit, rating, bestOne) =>
  rating > bestOne.rating && !DISCARDED.includes(twit.id_str);
