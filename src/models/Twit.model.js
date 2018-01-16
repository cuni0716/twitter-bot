const Twit = db => db.define('Twit', {
  id: Number,
  tweetId: String,
  user: String,
  retweetCount: Number,
  favoritedCount: Number,
  rating: Number,
  createdAt: Date,
}, {
  methods: {
    calculateRating: () => (this.retweetCount * 2) + this.favoritedCount,
  },
});

export default Twit;
