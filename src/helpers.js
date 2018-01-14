import distanceInWords from 'date-fns/distance_in_words';

import Retweet from './index';
import { ONE_HOUR, THREE_HOURS } from './constants';

export const calculateRating = (twit) => {
  if (twit.retweeted) return 0;
  const retweets = (twit.retweet_count || 0) * 2;
  const favourites = twit.favorite_count || 0;
  return retweets + favourites;
};

export const catchError = errors => console.error('[ ERROR ]', errors[0].message, '\n');

export const randomTime = () => Math.floor((Math.random() * THREE_HOURS) + ONE_HOUR);

export const prepareNewRetweet = () => {
  const delay = randomTime();
  const wordsDistance = distanceInWords(new Date(), new Date(Date.now() + randomTime()));
  console.log(`[ INFO ] Next retweet will be in ${wordsDistance}\n`);
  return setTimeout(Retweet, delay);
};
