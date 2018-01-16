## Twitter bot


### Development
```bash
cp .env.example .env
yarn install
docker-compose up --build
```

### Production
```bash
cp .env.example .env_production
yarn install
docker-compose -f docker-compose.production.yml up -d
```
