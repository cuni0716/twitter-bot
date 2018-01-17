import { RETWEET_WEIGHT, FAVOURITE_WEIGHT } from '../constants';


export default class Tweet {
  constructor(id, user, retweets, favorites) {
    this.tweetId = id || null;
    this.user = user || null;
    this.retweetCount = retweets || 0;
    this.favoritedCount = favorites || 0;
    this.rating = this.calculateRating();
    this.createdAt = new Date();
  }

  calculateRating() {
    return (this.retweetCount * RETWEET_WEIGHT) + (this.favoritedCount * FAVOURITE_WEIGHT);
  }
}
