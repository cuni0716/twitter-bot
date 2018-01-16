## Twitter bot


### Development
```bash
cp .env.example .env
```

```bash
docker-compose up --build
```

### Production
```bash
cp .env.example .env_production
```

```bash
docker-compose -f docker-compose.production.yml up -d
```
