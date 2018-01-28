import Twitter from 'twitter';

import models from './models';
import Tweet from './models/Tweet';
import { ENV, TWITTER_CREDENTIALS, DISCARDED, QUERY } from './constants';
import {
  getDatabase,
  calculateRating,
  isBetter,
  prepareNewRetweet,
  time,
  catchBOTError,
  catchSQLError,
} from './helpers';


const Bot = new Twitter(TWITTER_CREDENTIALS);

console.log(`${time()} --- [ INFO ] Bot is up and running!\n`);

const Retweet = async () => {
  const Database = await getDatabase();

  models.forEach(model => model(Database));
  await Database.sync();

  const { Twit: TwitModel } = Database.models;
  const retweeteds = await TwitModel.findAsync().map(twit => twit.tweetId);
  const result = await Bot.get('search/tweets', QUERY).catch(catchBOTError);

  if (!result) return prepareNewRetweet();

  const tweets = result.statuses;
  let bestOne = new Tweet();

  tweets.forEach((twit) => {
    const rating = calculateRating(twit);
    if (isBetter(twit, rating, bestOne, retweeteds, DISCARDED)) {
      bestOne = new Tweet(twit.id_str, twit.user.screen_name, twit.retweet_count, twit.favorite_count);
    }
  });

  await TwitModel.createAsync(bestOne).catch(catchSQLError);

  if (ENV === 'production') {
    const retweet = await Bot.post(`statuses/retweet/${bestOne.tweetId}`, { id: bestOne.tweetId }).catch(catchBOTError);
    if (!retweet) return Retweet();
    console.log(`${time()} --- [ RETWEET ] id: ${retweet.id_str} rating: ${bestOne.rating}`);
  } else {
    console.log(`${time()} --- [ RETWEET ] SKIPPED BECAUSE IT'S NOT PRODUCTION`);
  }

  DISCARDED.push(bestOne.tweetId);

  Database.driver.execQuery('SHOW PROCESSLIST;', (err, data) => {
    data.forEach((process) => {
      if (process.Command === 'Sleep') Database.driver.execQuery(`kill ${process.Id};`, () => {});
    });
  });

  return prepareNewRetweet();
};

Retweet();

export default Retweet;
