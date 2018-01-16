import Twitter from 'twitter';

import models from './models';
import { getDatabase, calculateRating, isBetter, prepareNewRetweet, time, catchError, catchSQLError } from './helpers';
import { ENV, TWITTER_CREDENTIALS, DISCARDED, QUERY } from './constants';


const Bot = new Twitter(TWITTER_CREDENTIALS);

console.log(`${time()} --- [ INFO ] Bot is up and running!\n`);

const Retweet = async () => {
  const Database = await getDatabase();

  models.forEach(model => model(Database));
  await Database.sync();

  const { Twit } = Database.models;
  const retweeteds = await Twit.findAsync().map(twit => twit.tweetId);
  const result = await Bot.get('search/tweets', QUERY).catch(catchError);
  if (!result) return prepareNewRetweet();

  const tweets = result.statuses;
  let bestOne = {
    id: null, user: null, retweetCount: 0, favoritedCount: 0, rating: 0,
  };


  tweets.forEach((twit) => {
    const rating = calculateRating(twit);
    if (isBetter(twit, rating, bestOne, retweeteds, DISCARDED)) {
      bestOne = {
        tweetId: twit.id_str,
        user: twit.user.screen_name,
        retweetCount: twit.retweet_count,
        favoritedCount: twit.favorite_count,
        rating,
        createdAt: new Date(),
      };
    }
  });

  await Twit.createAsync(bestOne).catch(catchSQLError);

  if (ENV === 'production') {
    const retweet = await Bot.post(`statuses/retweet/${bestOne.tweetId}`, { id: bestOne.tweetId }).catch(catchError);
    if (!retweet) return Retweet();
    console.log(`${time()} --- [ RETWEET ] id: ${retweet.id_str} rating: ${bestOne.rating}`);
  } else {
    console.log(`${time()} --- [ RETWEET ] SKIPPED BECAUSE IT'S NOT PRODUCTION`);
  }

  DISCARDED.push(bestOne.tweetId);
  return prepareNewRetweet();
};

Retweet();

export default Retweet;
