import Twitter from 'twitter';

import { calculateRating, prepareNewRetweet, time, catchError } from './helpers';
import { ENV, TWITTER_CREDENTIALS, DISCARDED, QUERY } from './constants';


const Bot = new Twitter(TWITTER_CREDENTIALS);

console.log(`${time()} --- [ INFO ] Bot is up and running!\n`);

const Retweet = async () => {
  const result = await Bot.get('search/tweets', QUERY).catch(catchError);

  if (!result) return prepareNewRetweet();

  const tweets = result.statuses;
  let bestOne = { rating: 0, id: null };

  tweets.forEach((twit) => {
    const rating = calculateRating(twit);
    if (rating > bestOne.rating && !DISCARDED.includes(twit.id_str)) bestOne = { rating, id: twit.id_str };
  });

  if (ENV === 'production') {
    const retweet = await Bot.post(`statuses/retweet/${bestOne.id}`, { id: bestOne.id }).catch(catchError);
    if (!retweet) return Retweet();
    console.log(`${time()} --- [ RETWEET ] id: ${retweet.id_str} rating: ${bestOne.rating}`);
  } else {
    console.log(`${time()} --- [ RETWEET ] SKIPPED BECAUSE IT'S NOT PRODUCTION`);
  }

  DISCARDED.push(bestOne.id);
  console.log(`${time()} --- [ INFO ] retweet count this session: ${DISCARDED.length}`);
  return prepareNewRetweet();
};

Retweet();

export default Retweet;
