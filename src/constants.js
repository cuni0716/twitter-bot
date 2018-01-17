const {
  APP_ENV,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
  TWITTER_INTERESTS,
  TWITTER_CONSUMER_KEY,
  TWITTER_ACCESS_TOKEN,
  TWITTER_CONSUMER_SECRET,
  TWITTER_ACCESS_TOKEN_SECRET,
} = process.env;

export const ENV = APP_ENV || 'development';
export const DB = MYSQL_DATABASE;
export const DB_USER = MYSQL_USER;
export const DB_PASS = MYSQL_PASSWORD;
export const TWITTER_SEARCH_PHRASE = TWITTER_INTERESTS.split(',').map(item => `#${item}`).join(' OR ');
export const RETWEET_WEIGHT = 2;
export const FAVOURITE_WEIGHT = 4;
export const ONE_HOUR = 60 * 60 * 1000;
export const THREE_HOURS = 180 * 60 * 1000;
export const COUNT = 100;
export const RESULT_TYPE = 'recent';
export const LANG = 'en';
export const DISCARDED = [];
export const TWITTER_CREDENTIALS = {
  consumer_key: TWITTER_CONSUMER_KEY,
  consumer_secret: TWITTER_CONSUMER_SECRET,
  access_token_key: TWITTER_ACCESS_TOKEN,
  access_token_secret: TWITTER_ACCESS_TOKEN_SECRET,
};
export const QUERY = {
  q: TWITTER_SEARCH_PHRASE, count: COUNT, result_type: RESULT_TYPE, lang: LANG,
};
