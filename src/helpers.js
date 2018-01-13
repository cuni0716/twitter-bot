export function calculateRating(twit) {
  if (twit.retweeted) return 0;
  const retweets = (twit.retweet_count || 0) * 2;
  const favourites = twit.favorite_count || 0;
  return retweets + favourites;
}
