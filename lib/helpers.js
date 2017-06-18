"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateRating = calculateRating;
function calculateRating(twit) {
  if (twit.retwitted) return 0;

  var retweets = (twit.retweet_count || 0) * 2;
  var favourites = twit.favourite_count || 0;

  return retweets + favourites;
}