# Docker Deployment

Run the full MVP stack with local Postgres:

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

## Supabase Production Setup

Use Supabase as the production Postgres host:

1. Create a Supabase project.
2. In Supabase SQL Editor or via Prisma, create the schema with:
   ```bash
   DATABASE_URL="your-supabase-postgres-url" npx prisma db push
   ```
3. Set `DATABASE_URL` in your deployment environment to the Supabase Postgres connection string.
4. Create a private Storage bucket named `nyuad-id-uploads`.
5. Set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_ID_UPLOAD_BUCKET=nyuad-id-uploads`

`SUPABASE_SERVICE_ROLE_KEY` is server-only. Never expose it with a `NEXT_PUBLIC_` prefix.

For production, change these in `docker-compose.yml` or your host environment:

- `POSTGRES_PASSWORD`
- `DATABASE_URL`
- `SESSION_SECRET`
- SMTP variables for real OTP email delivery
- Supabase variables for hosted DB and ID-card storage

To start without reseeding demo data:

```bash
SEED_DEMO_DATA=0 docker compose up --build
```

To skip schema push when using managed migrations:

```bash
SKIP_DB_PUSH=1 docker compose up --build
```
