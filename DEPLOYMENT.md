# Docker Deployment

Run the full MVP stack with Postgres:

```bash
docker compose up --build
```

Open:

```text
http://localhost:3000
```

The `web` container runs:

- `prisma generate`
- `prisma db push`
- demo seed data when `SEED_DEMO_DATA=1`
- `next start`

For production, change these in `docker-compose.yml` or your host environment:

- `POSTGRES_PASSWORD`
- `DATABASE_URL`
- `SESSION_SECRET`
- SMTP variables for real OTP email delivery

To start without reseeding demo data:

```bash
SEED_DEMO_DATA=0 docker compose up --build
```

To skip schema push when using managed migrations:

```bash
SKIP_DB_PUSH=1 docker compose up --build
```
