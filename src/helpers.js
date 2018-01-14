import format from 'date-fns/format';
import addHours from 'date-fns/add_hours';

import Retweet from './index';
import { ONE_HOUR, THREE_HOURS } from './constants';

export const calculateRating = (twit) => {
  if (twit.retweeted) return 0;
  const retweets = (twit.retweet_count || 0) * 2;
  const favourites = twit.favorite_count || 0;
  return retweets + favourites;
};

export const time = () => format(new Date(), 'DD-MM-YYYY HH:mm:ss');
export const catchError = errors => console.error(time(), ' --- [ ERROR ]', errors[0].message);
export const randomTime = () => Math.floor((Math.random() * THREE_HOURS) + ONE_HOUR);

export const prepareNewRetweet = () => {
  const delay = randomTime();
  const nextRetweetDate = new Date(Date.now() + delay);
  const formattedDate = format(addHours(nextRetweetDate, 1), 'HH:mm:ss');
  console.log(`${time()} --- [ INFO ] Next retweet will be at ${formattedDate}\n`);
  return setTimeout(Retweet, delay);
};
