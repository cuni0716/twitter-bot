import 'mysql';

import orm from 'orm';
import format from 'date-fns/format';
import addHours from 'date-fns/add_hours';

import Retweet from './index';
import { DB, DB_USER, DB_PASS, ONE_HOUR, THREE_HOURS, RETWEET_WEIGHT, FAVOURITE_WEIGHT } from './constants';


export const getDatabase = async () => orm.connectAsync(`
  mysql://${DB_USER}:${DB_PASS}@mysql/${DB}?pool=true&debug=${process.env.APP_ENV !== 'production'}
`);

export const calculateRating = (twit) => {
  if (twit.retweeted) return 0;
  const retweets = (twit.retweet_count || 0) * RETWEET_WEIGHT;
  const favourites = (twit.favorite_count || 0) * FAVOURITE_WEIGHT;
  return retweets + favourites;
};

export const isBetter = (twit, rating, bestOne, retweeteds, DISCARDED) =>
  rating > bestOne.rating && !retweeteds.includes(twit.id_str) && !DISCARDED.includes(twit.id_str);

export const time = () => format(addHours(new Date(), 1), 'DD-MM-YYYY HH:mm:ss');

export const catchBOTError = errors => console.error(time(), '--- [ ERROR ]', errors[0].message);

export const catchSQLError = error => console.log(time(), '--- [ ERROR ]', error.sqlMessage);

export const randomTime = () => Math.floor((Math.random() * THREE_HOURS) + ONE_HOUR);

export const prepareNewRetweet = () => {
  const delay = randomTime();
  const nextRetweetDate = new Date(Date.now() + delay);
  const formattedDate = format(addHours(nextRetweetDate, 1), 'HH:mm:ss');
  console.log(`${time()} --- [ INFO ] Next retweet will be at ${formattedDate}`);
  return setTimeout(Retweet, delay);
};
