# Twitter bot

Zero code bot for you to search for some topics of your interest on twitter and retweet one of them every few hours. Store all retweets on a database that you can access and query.

## Development
```bash
cp .env.example .env
```

Open `.env` file and fill in the values


#### Start on devmode
```bash
npm run dev
```

#### Connect to mysql
```bash
npm run sql
```
____


## Deploy on production
```bash
cp .env.example .env_production
```

Open `.env_production` file and fill in the values

#### Start on production mode
```bash
npm run deploy
```

#### See the logs
```bash
npm run logs
```

#### Update it

For minor updates you only need to do `npm run update:minor` in the bot folder.

For major updates you may need to `npm run update` in the bot folder.
