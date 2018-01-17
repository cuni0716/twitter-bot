## Twitter bot


### Development
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



### Deploy on production
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
