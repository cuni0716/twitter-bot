export function calculateRating(twit) {
  if (twit.retwitted) return 0;

  const retweets = (twit.retweet_count || 0) * 2;
  const favourites = twit.favourite_count || 0;

  return retweets + favourites;
}
